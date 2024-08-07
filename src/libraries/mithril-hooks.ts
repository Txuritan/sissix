import m from './mithril';

namespace ReactTypes {
    declare const UNDEFINED_VOID_ONLY: unique symbol;
    // Destructors are only allowed to return void.
    type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };

    export type DependencyList = ReadonlyArray<unknown>;
    export type EffectCallback = () => void | Destructor;
}

namespace MithrilHooks {
    export type TearDownFn = () => void;
    export type UpdateFn = () => void;
    export type MemoFn<T> = () => T;
    export type ValueFn<T> = (currentValue: T, index: number) => T;
    export type ValueOrFn<T> = T | ValueFn<T>;
    export type NewValueFn<T> = (value: ValueOrFn<T>, index: number) => T;
    export type EffectReturnFn = () => unknown;
    export type Reducer<T, A> = (state: T, action: A) => T;
    export type State = {
      states: unknown[];
      statesIndex: number;
      depsIndex: number;
      depsStates: ReactTypes.DependencyList[];
      setup: boolean;
      teardowns: Map<string | number, TearDownFn>;
      updates: UpdateFn[];
    };
}

let currentState: MithrilHooks.State;

const call = Function.prototype.call.bind(Function.prototype.call);

const scheduleRender = () =>
    // Call m within the function body so environments with a global instance of m (like flems.io) don't complain
    m.redraw();

const updateDeps = (deps?: ReactTypes.DependencyList) => {
    const state = currentState;
    const { depsIndex } = state;
    state.depsIndex += 1;
    const prevDeps = state.depsStates[depsIndex] || [];
    const shouldRecompute =
        deps === undefined
            ? true // Always compute
            : Array.isArray(deps)
                ? deps.length > 0
                    ? !deps.every((x, i) => x === prevDeps[i]) // Only compute when one of the deps has changed
                    : !state.setup // Empty array: only compute at mount
                : false; // Invalid value, do nothing
    if (deps !== undefined) {
        state.depsStates[depsIndex] = deps;
    }
    return shouldRecompute;
};

const effect =
    (isAsync = false) =>
        (fn: ReactTypes.EffectCallback, deps?: ReactTypes.DependencyList) => {
            const state = currentState;
            const shouldRecompute = updateDeps(deps);
            if (shouldRecompute) {
                const { depsIndex } = state;
                const runCallbackFn = () => {
                    const teardown = fn();
                    // A callback may return a function. If any, add it to the teardowns:
                    if (typeof teardown === 'function') {
                        // Store this this function to be called at cleanup and unmount
                        state.teardowns.set(
                            depsIndex,
                            teardown as MithrilHooks.EffectReturnFn,
                        );
                        // At unmount, call re-render at least once
                        state.teardowns.set('_', scheduleRender);
                    }
                };

                // First clean up any previous cleanup function
                const teardown = state.teardowns.get(depsIndex);
                try {
                    if (typeof teardown === 'function') {
                        teardown();
                    }
                } finally {
                    state.teardowns.delete(depsIndex);
                }

                state.updates.push(
                    isAsync
                        ? () =>
                            new Promise(resolve => {
                                requestAnimationFrame(resolve);
                            }).then(runCallbackFn)
                        : runCallbackFn,
                );
            }
        };

const updateState = <T>(
    initialState?: T,
    newValueFn?: MithrilHooks.NewValueFn<T>,
): [T, (value: MithrilHooks.ValueOrFn<T>) => any, number] => {
    const state = currentState;
    const index = state.statesIndex;
    state.statesIndex += 1;
    if (!state.setup) {
        state.states[index] = initialState;
    }
    return [
        state.states[index] as T,
        (value: MithrilHooks.ValueOrFn<T>) => {
            const previousValue = state.states[index];
            const newValue = newValueFn ? newValueFn(value as T, index) : value;
            state.states[index] = newValue;
            if (JSON.stringify(newValue) !== JSON.stringify(previousValue)) {
                scheduleRender(); // Calling redraw multiple times: Mithril will drop extraneous redraw calls, so performance should not be an issue
            }
        },
        index,
    ];
};

export const useState = <T = unknown>(
    initialState?: T,
): [T, (value: MithrilHooks.ValueOrFn<T>) => unknown, number] => {
    const state = currentState;
    const newValueFn = (value: MithrilHooks.ValueOrFn<T>, index: number) =>
        typeof value === 'function'
            ? (value as MithrilHooks.ValueFn<T>)(state.states[index] as T, index)
            : value;
    return updateState<T>(initialState, newValueFn);
};

export const useEffect = effect(true);
export const useLayoutEffect = effect();

export function useReducer<T, A = any, U = any>(
    reducer: MithrilHooks.Reducer<T, A>,
    initialState: U,
    initFn: (args?: U) => T,
): [T, (action: A) => T];
export function useReducer<T, A = any, U = any>(
    reducer: MithrilHooks.Reducer<T, A>,
    initialState?: T,
    initFn?: never,
): [T, (action: A) => T];
export function useReducer<T, A = any, U = any>(
    reducer: MithrilHooks.Reducer<T, A>,
    initialState?: unknown,
    initFn?: ((args?: unknown) => T) | never,
): [T, (action: A) => T] {
    const state = currentState;
    // From the React docs: You can also create the initial state lazily. To do this, you can pass an init function as the third argument. The initial state will be set to init(initialValue).
    const initValue: T =
        !state.setup && initFn
            ? (initFn(initialState as U) as T)
            : (initialState as T);

    const getValueDispatch = (): [T, (action: A) => T] => {
        const [value, setValue, index] = updateState(initValue);
        const dispatch = (action: A): T => {
            const previousValue = state.states[index] as T;
            return setValue(
                // Next state:
                reducer(previousValue, action),
            );
        };
        return [value, dispatch];
    };

    return getValueDispatch();
}

export const useRef = <T = unknown>(initialValue?: T) => {
    // A ref is a persisted object that will not be updated, so it has no setter
    const [value] = updateState<{ current: T | undefined }>({
        current: initialValue,
    });
    return value;
};

export const useMemo = <T = unknown>(
    fn: MithrilHooks.MemoFn<T>,
    deps?: ReactTypes.DependencyList,
) => {
    const state = currentState;
    const shouldRecompute = updateDeps(deps);
    const [memoized, setMemoized] = !state.setup
        ? updateState<T>(fn())
        : updateState<T>();
    if (state.setup && shouldRecompute) {
        setMemoized(fn());
    }
    return memoized;
};

export const useCallback = <T extends (...args: unknown[]) => unknown>(
    callback: T,
    deps?: ReactTypes.DependencyList,
) =>
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useMemo(() => callback, deps);

export const withHooks = <T = unknown>(
    renderFunction: (
        attrs: T & { vnode: m.Vnode<T, MithrilHooks.State>; children: m.Children },
    ) => m.Children,
    initialAttrs?: T,
): m.Component<T, MithrilHooks.State> => {
    const init = (vnode: m.Vnode<T, MithrilHooks.State>) => {
        Object.assign(vnode.state, {
            setup: false,
            states: [],
            statesIndex: 0,
            depsStates: [],
            depsIndex: 0,
            updates: [],
            cleanups: new Map(),
            teardowns: new Map(), // Keep track of teardowns even when the update was run only once
        });
    };

    const update = (vnode: m.VnodeDOM<T, MithrilHooks.State>) => {
        const prevState = currentState;
        currentState = vnode.state;
        try {
            vnode.state.updates.forEach(call);
        } finally {
            Object.assign(vnode.state, {
                setup: true,
                updates: [],
                depsIndex: 0,
                statesIndex: 0,
            });
            currentState = prevState;
        }
    };

    // eslint-disable-next-line consistent-return
    const render = (vnode: m.Vnode<T, MithrilHooks.State>) => {
        const prevState = currentState;
        currentState = vnode.state;
        try {
            return renderFunction({
                ...initialAttrs,
                ...vnode.attrs,
                vnode,
                children: vnode.children,
            });
        } catch (e) {
            console.error(e); // eslint-disable-line no-console
        } finally {
            currentState = prevState;
        }
        return undefined;
    };

    const teardown = (vnode: m.VnodeDOM<T, MithrilHooks.State>) => {
        const prevState = currentState;
        currentState = vnode.state;
        try {
            vnode.state.teardowns.forEach(call);
        } finally {
            currentState = prevState;
        }
    };

    return {
        oninit: init,
        oncreate: update,
        onupdate: update,
        view: render,
        onremove: teardown,
    };
};

export const useStateLocal = <T>(key: string, defaultValue?: T): [T, (value: MithrilHooks.ValueOrFn<T>) => unknown, number] => {
    const [value, set, n] = useState<T>(defaultValue)

    if (localStorage) {
        set(JSON.parse(localStorage.getItem(key) ?? "{}"));
    }

    useEffect(() => {
        if (localStorage) {
            try {
                if (value !== undefined) {
                    localStorage.setItem(key, JSON.stringify(value))
                } else {
                    localStorage.removeItem(key)
                }
            } catch (e) {
                console.warn(e)
            }
        }
    }, [value]);

    return [value, set, n];
};
