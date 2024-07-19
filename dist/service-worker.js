(() => {
  // src/libraries/path.ts
  var makeOptions = (opts = {}) => ({
    arrayFormat: opts.arrayFormat || "none",
    booleanFormat: opts.booleanFormat || "none",
    nullFormat: opts.nullFormat || "default"
  });
  var encodeValue = (value) => encodeURIComponent(value);
  var decodeValue = (value) => decodeURIComponent(value.replace(/\+/g, " "));
  var encodeBoolean = (name, value, opts) => {
    if (opts.booleanFormat === "empty-true" && value) {
      return name;
    }
    let encodedValue;
    if (opts.booleanFormat === "unicode") {
      encodedValue = value ? "\u2713" : "\u2717";
    } else {
      encodedValue = value.toString();
    }
    return `${name}=${encodedValue}`;
  };
  var encodeNull = (name, opts) => {
    if (opts.nullFormat === "hidden") {
      return "";
    }
    if (opts.nullFormat === "string") {
      return `${name}=null`;
    }
    return name;
  };
  var getNameEncoder = (opts) => {
    if (opts.arrayFormat === "index") {
      return (name, index) => `${name}[${index}]`;
    }
    if (opts.arrayFormat === "brackets") {
      return (name) => `${name}[]`;
    }
    return (name) => name;
  };
  var encodeArray = (name, arr, opts) => {
    const encodeName = getNameEncoder(opts);
    return arr.map((val, index) => `${encodeName(name, index)}=${encodeValue(val)}`).join("&");
  };
  var encode = (name, value, opts) => {
    const encodedName = encodeValue(name);
    if (value === null) {
      return encodeNull(encodedName, opts);
    }
    if (typeof value === "boolean") {
      return encodeBoolean(encodedName, value, opts);
    }
    if (Array.isArray(value)) {
      return encodeArray(encodedName, value, opts);
    }
    return `${encodedName}=${encodeValue(value)}`;
  };
  var decode = (value, opts) => {
    if (value === void 0) {
      return opts.booleanFormat === "empty-true" ? true : null;
    }
    if (opts.booleanFormat === "string") {
      if (value === "true") {
        return true;
      }
      if (value === "false") {
        return false;
      }
    }
    if (opts.nullFormat === "string") {
      if (value === "null") {
        return null;
      }
    }
    const decodedValue = decodeValue(value);
    if (opts.booleanFormat === "unicode") {
      if (decodedValue === "\u2713") {
        return true;
      }
      if (decodedValue === "\u2717") {
        return false;
      }
    }
    return decodedValue;
  };
  var getSearch = (path) => {
    const pos = path.indexOf("?");
    if (pos === -1) {
      return path;
    }
    return path.slice(pos + 1);
  };
  var isSerializable = (val) => val !== void 0;
  var parseName = (name) => {
    const bracketPosition = name.indexOf("[");
    const hasBrackets = bracketPosition !== -1;
    return {
      hasBrackets,
      name: hasBrackets ? name.slice(0, bracketPosition) : name
    };
  };
  var parseQueryParams = (path, opts) => {
    const options = makeOptions(opts);
    return getSearch(path).split("&").reduce((params, param) => {
      const [rawName, value] = param.split("=");
      const { hasBrackets, name } = parseName(rawName);
      const decodedName = decodeValue(name);
      const currentValue = params[name];
      const decodedValue = decode(value, options);
      if (currentValue === void 0) {
        params[decodedName] = hasBrackets ? [decodedValue] : decodedValue;
      } else {
        params[decodedName] = (Array.isArray(currentValue) ? currentValue : [currentValue]).concat(decodedValue);
      }
      return params;
    }, {});
  };
  var buildQueryParams = (params, opts) => {
    const options = makeOptions(opts);
    return Object.keys(params).filter((paramName) => isSerializable(params[paramName])).map((paramName) => encode(paramName, params[paramName], options)).filter(Boolean).join("&");
  };
  var excludeSubDelimiters = /[^!$'()*+,;|:]/g;
  var encodeURIComponentExcludingSubDelims = (segment) => segment.replace(excludeSubDelimiters, (match) => encodeURIComponent(match));
  var encodingMethods = {
    default: encodeURIComponentExcludingSubDelims,
    uri: encodeURI,
    uriComponent: encodeURIComponent,
    none: (val) => val,
    legacy: encodeURI
  };
  var decodingMethods = {
    default: decodeURIComponent,
    uri: decodeURI,
    uriComponent: decodeURIComponent,
    none: (val) => val,
    legacy: decodeURIComponent
  };
  var encodeParam = (param, encoding, isSpatParam) => {
    const encoder = encodingMethods[encoding] || encodeURIComponentExcludingSubDelims;
    if (isSpatParam) {
      return String(param).split("/").map(encoder).join("/");
    }
    return encoder(String(param));
  };
  var decodeParam = (param, encoding) => (decodingMethods[encoding] || decodeURIComponent)(param);
  var defaultOrConstrained = (match) => `(${match ? match.replace(/(^<|>$)/g, "") : "[a-zA-Z0-9-_.~%':|=+\\*@$]+"})`;
  var rules = [
    {
      name: "url-parameter",
      pattern: /^:([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
      regex: (match) => new RegExp(defaultOrConstrained(match[2]))
    },
    {
      name: "url-parameter-splat",
      pattern: /^\*([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/,
      regex: /([^?]*)/
    },
    {
      name: "url-parameter-matrix",
      pattern: /^;([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
      regex: (match) => new RegExp(`;${match[1]}=${defaultOrConstrained(match[2])}`)
    },
    {
      name: "query-parameter",
      pattern: /^(?:\?|&)(?::)?([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/
    },
    {
      name: "delimiter",
      pattern: /^(\/|\?)/,
      regex: (match) => new RegExp(`\\${match[0]}`)
    },
    {
      name: "sub-delimiter",
      pattern: /^(!|&|-|_|\.|;)/,
      regex: (match) => new RegExp(match[0])
    },
    {
      name: "fragment",
      pattern: /^([0-9a-zA-Z]+)/,
      regex: (match) => new RegExp(match[0])
    }
  ];
  var tokenise = (str, tokens = []) => {
    const matched = rules.some((rule) => {
      const match = str.match(rule.pattern);
      if (!match) {
        return false;
      }
      tokens.push({
        type: rule.name,
        match: match[0],
        val: match.slice(1, 2),
        otherVal: match.slice(2),
        regex: rule.regex instanceof Function ? rule.regex(match) : rule.regex
      });
      if (match[0].length < str.length) {
        tokens = tokenise(str.substr(match[0].length), tokens);
      }
      return true;
    });
    if (!matched) {
      throw new Error(`Could not parse path '${str}'`);
    }
    return tokens;
  };
  var exists = (val) => val !== void 0 && val !== null;
  var optTrailingSlash = (source, strictTrailingSlash) => {
    if (strictTrailingSlash) {
      return source;
    }
    if (source === "\\/") {
      return source;
    }
    return `${source.replace(/\\\/$/, "")}(?:\\/)?`;
  };
  var upToDelimiter = (source, delimiter) => {
    if (!delimiter) {
      return source;
    }
    return /(\/)$/.test(source) ? source : `${source}(\\/|\\?|\\.|;|$)`;
  };
  var appendQueryParam = (params, param, val = "") => {
    const existingVal = params[param];
    if (existingVal === void 0) {
      params[param] = val;
    } else {
      params[param] = Array.isArray(existingVal) ? existingVal.concat(val) : [existingVal, val];
    }
    return params;
  };
  var defaultOptions = {
    urlParamsEncoding: "default"
  };
  var Path = class _Path {
    static createPath(path, options) {
      return new _Path(path, options);
    }
    constructor(path, options) {
      if (!path) {
        throw new Error("Missing path in Path constructor");
      }
      this.path = path;
      this.options = {
        ...defaultOptions,
        ...options
      };
      this.tokens = tokenise(path);
      this.hasUrlParams = this.tokens.filter((t) => /^url-parameter/.test(t.type)).length > 0;
      this.hasSpatParam = this.tokens.filter((t) => /splat$/.test(t.type)).length > 0;
      this.hasMatrixParams = this.tokens.filter((t) => /matrix$/.test(t.type)).length > 0;
      this.hasQueryParams = this.tokens.filter((t) => /^query-parameter/.test(t.type)).length > 0;
      this.spatParams = this.getParams("url-parameter-splat");
      this.urlParams = this.getParams(/^url-parameter/);
      this.queryParams = this.getParams("query-parameter");
      this.params = this.urlParams.concat(this.queryParams);
      this.source = this.tokens.filter((t) => t.regex !== void 0).map((t) => t.regex.source).join("");
    }
    isQueryParam(name) {
      return this.queryParams.indexOf(name) !== -1;
    }
    isSpatParam(name) {
      return this.spatParams.indexOf(name) !== -1;
    }
    test(path, opts) {
      const options = {
        caseSensitive: false,
        strictTrailingSlash: false,
        ...this.options,
        ...opts
      };
      const source = optTrailingSlash(this.source, options.strictTrailingSlash);
      const match = this.urlTest(
        path,
        source + (this.hasQueryParams ? "(\\?.*$|$)" : "$"),
        options.caseSensitive,
        options.urlParamsEncoding
      );
      if (!match || !this.hasQueryParams) {
        return match;
      }
      const queryParams = parseQueryParams(path, options.queryParams);
      const unexpectedQueryParams = Object.keys(queryParams).filter(
        (p) => !this.isQueryParam(p)
      );
      if (unexpectedQueryParams.length === 0) {
        Object.keys(queryParams).forEach(
          // @ts-ignore
          (p) => match[p] = queryParams[p]
        );
        return match;
      }
      return null;
    }
    partialTest(path, opts) {
      const options = {
        caseSensitive: false,
        delimited: true,
        ...this.options,
        ...opts
      };
      const source = upToDelimiter(this.source, options.delimited);
      const match = this.urlTest(
        path,
        source,
        options.caseSensitive,
        options.urlParamsEncoding
      );
      if (!match) {
        return match;
      }
      if (!this.hasQueryParams) {
        return match;
      }
      const queryParams = parseQueryParams(path, options.queryParams);
      Object.keys(queryParams).filter((p) => this.isQueryParam(p)).forEach((p) => appendQueryParam(match, p, queryParams[p]));
      return match;
    }
    build(params = {}, opts) {
      const options = {
        ignoreConstraints: false,
        ignoreSearch: false,
        queryParams: {},
        ...this.options,
        ...opts
      };
      const encodedUrlParams = Object.keys(params).filter((p) => !this.isQueryParam(p)).reduce((acc, key) => {
        if (!exists(params[key])) {
          return acc;
        }
        const val = params[key];
        const isSpatParam = this.isSpatParam(key);
        if (typeof val === "boolean") {
          acc[key] = val;
        } else if (Array.isArray(val)) {
          acc[key] = val.map(
            (v) => encodeParam(v, options.urlParamsEncoding, isSpatParam)
          );
        } else {
          acc[key] = encodeParam(val, options.urlParamsEncoding, isSpatParam);
        }
        return acc;
      }, {});
      if (this.urlParams.some((p) => !exists(params[p]))) {
        const missingParameters = this.urlParams.filter(
          (p) => !exists(params[p])
        );
        throw new Error(
          `Cannot build path: '${this.path}' requires missing parameters { ${missingParameters.join(", ")} }`
        );
      }
      if (!options.ignoreConstraints) {
        const constraintsPassed = this.tokens.filter((t) => /^url-parameter/.test(t.type) && !/-splat$/.test(t.type)).every(
          (t) => new RegExp(`^${defaultOrConstrained(t.otherVal[0])}$`).test(
            encodedUrlParams[t.val]
          )
        );
        if (!constraintsPassed) {
          throw new Error(
            `Some parameters of '${this.path}' are of invalid format`
          );
        }
      }
      const base = this.tokens.filter((t) => /^query-parameter/.test(t.type) === false).map((t) => {
        if (t.type === "url-parameter-matrix") {
          return `;${t.val}=${encodedUrlParams[t.val[0]]}`;
        }
        return /^url-parameter/.test(t.type) ? encodedUrlParams[t.val[0]] : t.match;
      }).join("");
      if (options.ignoreSearch) {
        return base;
      }
      const searchParams = this.queryParams.filter((p) => Object.keys(params).indexOf(p) !== -1).reduce((sparams, paramName) => {
        sparams[paramName] = params[paramName];
        return sparams;
      }, {});
      const searchPart = buildQueryParams(searchParams, options.queryParams);
      return searchPart ? `${base}?${searchPart}` : base;
    }
    getParams(type2) {
      const predicate = type2 instanceof RegExp ? (t) => type2.test(t.type) : (t) => t.type === type2;
      return this.tokens.filter(predicate).map((t) => t.val[0]);
    }
    urlTest(path, source, caseSensitive, urlParamsEncoding) {
      const regex = new RegExp(`^${source}`, caseSensitive ? "" : "i");
      const match = path.match(regex);
      if (!match) {
        return null;
      }
      if (!this.urlParams.length) {
        return {};
      }
      return match.slice(1, this.urlParams.length + 1).reduce((params, m, i) => {
        params[this.urlParams[i]] = decodeParam(m, urlParamsEncoding);
        return params;
      }, {});
    }
  };
  var path_default = Path;

  // src/libraries/dexie.js
  var _global = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
  var keys = Object.keys;
  var isArray = Array.isArray;
  if (typeof Promise !== "undefined" && !_global.Promise) {
    _global.Promise = Promise;
  }
  function extend(obj, extension) {
    if (typeof extension !== "object")
      return obj;
    keys(extension).forEach(function(key) {
      obj[key] = extension[key];
    });
    return obj;
  }
  var getProto = Object.getPrototypeOf;
  var _hasOwn = {}.hasOwnProperty;
  function hasOwn(obj, prop) {
    return _hasOwn.call(obj, prop);
  }
  function props(proto, extension) {
    if (typeof extension === "function")
      extension = extension(getProto(proto));
    (typeof Reflect === "undefined" ? keys : Reflect.ownKeys)(extension).forEach((key) => {
      setProp(proto, key, extension[key]);
    });
  }
  var defineProperty = Object.defineProperty;
  function setProp(obj, prop, functionOrGetSet, options) {
    defineProperty(obj, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === "function" ? { get: functionOrGetSet.get, set: functionOrGetSet.set, configurable: true } : { value: functionOrGetSet, configurable: true, writable: true }, options));
  }
  function derive(Child) {
    return {
      from: function(Parent) {
        Child.prototype = Object.create(Parent.prototype);
        setProp(Child.prototype, "constructor", Child);
        return {
          extend: props.bind(null, Child.prototype)
        };
      }
    };
  }
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  function getPropertyDescriptor(obj, prop) {
    const pd = getOwnPropertyDescriptor(obj, prop);
    let proto;
    return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
  }
  var _slice = [].slice;
  function slice(args, start, end) {
    return _slice.call(args, start, end);
  }
  function override(origFunc, overridedFactory) {
    return overridedFactory(origFunc);
  }
  function assert(b) {
    if (!b)
      throw new Error("Assertion Failed");
  }
  function asap$1(fn) {
    if (_global.setImmediate)
      setImmediate(fn);
    else
      setTimeout(fn, 0);
  }
  function arrayToObject(array, extractor) {
    return array.reduce((result, item, i) => {
      var nameAndValue = extractor(item, i);
      if (nameAndValue)
        result[nameAndValue[0]] = nameAndValue[1];
      return result;
    }, {});
  }
  function getByKeyPath(obj, keyPath) {
    if (typeof keyPath === "string" && hasOwn(obj, keyPath))
      return obj[keyPath];
    if (!keyPath)
      return obj;
    if (typeof keyPath !== "string") {
      var rv = [];
      for (var i = 0, l = keyPath.length; i < l; ++i) {
        var val = getByKeyPath(obj, keyPath[i]);
        rv.push(val);
      }
      return rv;
    }
    var period = keyPath.indexOf(".");
    if (period !== -1) {
      var innerObj = obj[keyPath.substr(0, period)];
      return innerObj == null ? void 0 : getByKeyPath(innerObj, keyPath.substr(period + 1));
    }
    return void 0;
  }
  function setByKeyPath(obj, keyPath, value) {
    if (!obj || keyPath === void 0)
      return;
    if ("isFrozen" in Object && Object.isFrozen(obj))
      return;
    if (typeof keyPath !== "string" && "length" in keyPath) {
      assert(typeof value !== "string" && "length" in value);
      for (var i = 0, l = keyPath.length; i < l; ++i) {
        setByKeyPath(obj, keyPath[i], value[i]);
      }
    } else {
      var period = keyPath.indexOf(".");
      if (period !== -1) {
        var currentKeyPath = keyPath.substr(0, period);
        var remainingKeyPath = keyPath.substr(period + 1);
        if (remainingKeyPath === "")
          if (value === void 0) {
            if (isArray(obj) && !isNaN(parseInt(currentKeyPath)))
              obj.splice(currentKeyPath, 1);
            else
              delete obj[currentKeyPath];
          } else
            obj[currentKeyPath] = value;
        else {
          var innerObj = obj[currentKeyPath];
          if (!innerObj || !hasOwn(obj, currentKeyPath))
            innerObj = obj[currentKeyPath] = {};
          setByKeyPath(innerObj, remainingKeyPath, value);
        }
      } else {
        if (value === void 0) {
          if (isArray(obj) && !isNaN(parseInt(keyPath)))
            obj.splice(keyPath, 1);
          else
            delete obj[keyPath];
        } else
          obj[keyPath] = value;
      }
    }
  }
  function delByKeyPath(obj, keyPath) {
    if (typeof keyPath === "string")
      setByKeyPath(obj, keyPath, void 0);
    else if ("length" in keyPath)
      [].map.call(keyPath, function(kp) {
        setByKeyPath(obj, kp, void 0);
      });
  }
  function shallowClone(obj) {
    var rv = {};
    for (var m in obj) {
      if (hasOwn(obj, m))
        rv[m] = obj[m];
    }
    return rv;
  }
  var concat = [].concat;
  function flatten(a) {
    return concat.apply([], a);
  }
  var intrinsicTypeNames = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(flatten([8, 16, 32, 64].map((num) => ["Int", "Uint", "Float"].map((t) => t + num + "Array")))).filter((t) => _global[t]);
  var intrinsicTypes = new Set(intrinsicTypeNames.map((t) => _global[t]));
  function cloneSimpleObjectTree(o) {
    const rv = {};
    for (const k in o)
      if (hasOwn(o, k)) {
        const v = o[k];
        rv[k] = !v || typeof v !== "object" || intrinsicTypes.has(v.constructor) ? v : cloneSimpleObjectTree(v);
      }
    return rv;
  }
  function objectIsEmpty(o) {
    for (const k in o)
      if (hasOwn(o, k))
        return false;
    return true;
  }
  var circularRefs = null;
  function deepClone(any) {
    circularRefs = /* @__PURE__ */ new WeakMap();
    const rv = innerDeepClone(any);
    circularRefs = null;
    return rv;
  }
  function innerDeepClone(x) {
    if (!x || typeof x !== "object")
      return x;
    let rv = circularRefs.get(x);
    if (rv)
      return rv;
    if (isArray(x)) {
      rv = [];
      circularRefs.set(x, rv);
      for (var i = 0, l = x.length; i < l; ++i) {
        rv.push(innerDeepClone(x[i]));
      }
    } else if (intrinsicTypes.has(x.constructor)) {
      rv = x;
    } else {
      const proto = getProto(x);
      rv = proto === Object.prototype ? {} : Object.create(proto);
      circularRefs.set(x, rv);
      for (var prop in x) {
        if (hasOwn(x, prop)) {
          rv[prop] = innerDeepClone(x[prop]);
        }
      }
    }
    return rv;
  }
  var { toString } = {};
  function toStringTag(o) {
    return toString.call(o).slice(8, -1);
  }
  var iteratorSymbol = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
  var getIteratorOf = typeof iteratorSymbol === "symbol" ? function(x) {
    var i;
    return x != null && (i = x[iteratorSymbol]) && i.apply(x);
  } : function() {
    return null;
  };
  function delArrayItem(a, x) {
    const i = a.indexOf(x);
    if (i >= 0)
      a.splice(i, 1);
    return i >= 0;
  }
  var NO_CHAR_ARRAY = {};
  function getArrayOf(arrayLike) {
    var i, a, x, it;
    if (arguments.length === 1) {
      if (isArray(arrayLike))
        return arrayLike.slice();
      if (this === NO_CHAR_ARRAY && typeof arrayLike === "string")
        return [arrayLike];
      if (it = getIteratorOf(arrayLike)) {
        a = [];
        while (x = it.next(), !x.done)
          a.push(x.value);
        return a;
      }
      if (arrayLike == null)
        return [arrayLike];
      i = arrayLike.length;
      if (typeof i === "number") {
        a = new Array(i);
        while (i--)
          a[i] = arrayLike[i];
        return a;
      }
      return [arrayLike];
    }
    i = arguments.length;
    a = new Array(i);
    while (i--)
      a[i] = arguments[i];
    return a;
  }
  var isAsyncFunction = typeof Symbol !== "undefined" ? (fn) => fn[Symbol.toStringTag] === "AsyncFunction" : () => false;
  var dexieErrorNames = [
    "Modify",
    "Bulk",
    "OpenFailed",
    "VersionChange",
    "Schema",
    "Upgrade",
    "InvalidTable",
    "MissingAPI",
    "NoSuchDatabase",
    "InvalidArgument",
    "SubTransaction",
    "Unsupported",
    "Internal",
    "DatabaseClosed",
    "PrematureCommit",
    "ForeignAwait"
  ];
  var idbDomErrorNames = [
    "Unknown",
    "Constraint",
    "Data",
    "TransactionInactive",
    "ReadOnly",
    "Version",
    "NotFound",
    "InvalidState",
    "InvalidAccess",
    "Abort",
    "Timeout",
    "QuotaExceeded",
    "Syntax",
    "DataClone"
  ];
  var errorList = dexieErrorNames.concat(idbDomErrorNames);
  var defaultTexts = {
    VersionChanged: "Database version changed by other database connection",
    DatabaseClosed: "Database has been closed",
    Abort: "Transaction aborted",
    TransactionInactive: "Transaction has already completed or failed",
    MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"
  };
  function DexieError(name, msg) {
    this.name = name;
    this.message = msg;
  }
  derive(DexieError).from(Error).extend({
    toString: function() {
      return this.name + ": " + this.message;
    }
  });
  function getMultiErrorMessage(msg, failures) {
    return msg + ". Errors: " + Object.keys(failures).map((key) => failures[key].toString()).filter((v, i, s) => s.indexOf(v) === i).join("\n");
  }
  function ModifyError(msg, failures, successCount, failedKeys) {
    this.failures = failures;
    this.failedKeys = failedKeys;
    this.successCount = successCount;
    this.message = getMultiErrorMessage(msg, failures);
  }
  derive(ModifyError).from(DexieError);
  function BulkError(msg, failures) {
    this.name = "BulkError";
    this.failures = Object.keys(failures).map((pos) => failures[pos]);
    this.failuresByPos = failures;
    this.message = getMultiErrorMessage(msg, this.failures);
  }
  derive(BulkError).from(DexieError);
  var errnames = errorList.reduce((obj, name) => (obj[name] = name + "Error", obj), {});
  var BaseException = DexieError;
  var exceptions = errorList.reduce((obj, name) => {
    var fullName = name + "Error";
    function DexieError2(msgOrInner, inner) {
      this.name = fullName;
      if (!msgOrInner) {
        this.message = defaultTexts[name] || fullName;
        this.inner = null;
      } else if (typeof msgOrInner === "string") {
        this.message = `${msgOrInner}${!inner ? "" : "\n " + inner}`;
        this.inner = inner || null;
      } else if (typeof msgOrInner === "object") {
        this.message = `${msgOrInner.name} ${msgOrInner.message}`;
        this.inner = msgOrInner;
      }
    }
    derive(DexieError2).from(BaseException);
    obj[name] = DexieError2;
    return obj;
  }, {});
  exceptions.Syntax = SyntaxError;
  exceptions.Type = TypeError;
  exceptions.Range = RangeError;
  var exceptionMap = idbDomErrorNames.reduce((obj, name) => {
    obj[name + "Error"] = exceptions[name];
    return obj;
  }, {});
  function mapError(domError, message) {
    if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name])
      return domError;
    var rv = new exceptionMap[domError.name](message || domError.message, domError);
    if ("stack" in domError) {
      setProp(rv, "stack", { get: function() {
        return this.inner.stack;
      } });
    }
    return rv;
  }
  var fullNameExceptions = errorList.reduce((obj, name) => {
    if (["Syntax", "Type", "Range"].indexOf(name) === -1)
      obj[name + "Error"] = exceptions[name];
    return obj;
  }, {});
  fullNameExceptions.ModifyError = ModifyError;
  fullNameExceptions.DexieError = DexieError;
  fullNameExceptions.BulkError = BulkError;
  function nop() {
  }
  function mirror(val) {
    return val;
  }
  function pureFunctionChain(f1, f2) {
    if (f1 == null || f1 === mirror)
      return f2;
    return function(val) {
      return f2(f1(val));
    };
  }
  function callBoth(on1, on2) {
    return function() {
      on1.apply(this, arguments);
      on2.apply(this, arguments);
    };
  }
  function hookCreatingChain(f1, f2) {
    if (f1 === nop)
      return f2;
    return function() {
      var res = f1.apply(this, arguments);
      if (res !== void 0)
        arguments[0] = res;
      var onsuccess = this.onsuccess, onerror = this.onerror;
      this.onsuccess = null;
      this.onerror = null;
      var res2 = f2.apply(this, arguments);
      if (onsuccess)
        this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
      if (onerror)
        this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
      return res2 !== void 0 ? res2 : res;
    };
  }
  function hookDeletingChain(f1, f2) {
    if (f1 === nop)
      return f2;
    return function() {
      f1.apply(this, arguments);
      var onsuccess = this.onsuccess, onerror = this.onerror;
      this.onsuccess = this.onerror = null;
      f2.apply(this, arguments);
      if (onsuccess)
        this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
      if (onerror)
        this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    };
  }
  function hookUpdatingChain(f1, f2) {
    if (f1 === nop)
      return f2;
    return function(modifications) {
      var res = f1.apply(this, arguments);
      extend(modifications, res);
      var onsuccess = this.onsuccess, onerror = this.onerror;
      this.onsuccess = null;
      this.onerror = null;
      var res2 = f2.apply(this, arguments);
      if (onsuccess)
        this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
      if (onerror)
        this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
      return res === void 0 ? res2 === void 0 ? void 0 : res2 : extend(res, res2);
    };
  }
  function reverseStoppableEventChain(f1, f2) {
    if (f1 === nop)
      return f2;
    return function() {
      if (f2.apply(this, arguments) === false)
        return false;
      return f1.apply(this, arguments);
    };
  }
  function promisableChain(f1, f2) {
    if (f1 === nop)
      return f2;
    return function() {
      var res = f1.apply(this, arguments);
      if (res && typeof res.then === "function") {
        var thiz = this, i = arguments.length, args = new Array(i);
        while (i--)
          args[i] = arguments[i];
        return res.then(function() {
          return f2.apply(thiz, args);
        });
      }
      return f2.apply(this, arguments);
    };
  }
  var debug = typeof location !== "undefined" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
  function setDebug(value, filter) {
    debug = value;
  }
  var INTERNAL = {};
  var ZONE_ECHO_LIMIT = 100;
  var [resolvedNativePromise, nativePromiseProto, resolvedGlobalPromise] = typeof Promise === "undefined" ? [] : (() => {
    let globalP = Promise.resolve();
    if (typeof crypto === "undefined" || !crypto.subtle)
      return [globalP, getProto(globalP), globalP];
    const nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
    return [
      nativeP,
      getProto(nativeP),
      globalP
    ];
  })();
  var nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
  var NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
  var patchGlobalPromise = !!resolvedGlobalPromise;
  function schedulePhysicalTick() {
    queueMicrotask(physicalTick);
  }
  var asap = function(callback, args) {
    microtickQueue.push([callback, args]);
    if (needsNewPhysicalTick) {
      schedulePhysicalTick();
      needsNewPhysicalTick = false;
    }
  };
  var isOutsideMicroTick = true;
  var needsNewPhysicalTick = true;
  var unhandledErrors = [];
  var rejectingErrors = [];
  var rejectionMapper = mirror;
  var globalPSD = {
    id: "global",
    global: true,
    ref: 0,
    unhandleds: [],
    onunhandled: nop,
    pgp: false,
    env: {},
    finalize: nop
  };
  var PSD = globalPSD;
  var microtickQueue = [];
  var numScheduledCalls = 0;
  var tickFinalizers = [];
  function DexiePromise(fn) {
    if (typeof this !== "object")
      throw new TypeError("Promises must be constructed via new");
    this._listeners = [];
    this._lib = false;
    var psd = this._PSD = PSD;
    if (typeof fn !== "function") {
      if (fn !== INTERNAL)
        throw new TypeError("Not a function");
      this._state = arguments[1];
      this._value = arguments[2];
      if (this._state === false)
        handleRejection(this, this._value);
      return;
    }
    this._state = null;
    this._value = null;
    ++psd.ref;
    executePromiseTask(this, fn);
  }
  var thenProp = {
    get: function() {
      var psd = PSD, microTaskId = totalEchoes;
      function then(onFulfilled, onRejected) {
        var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
        const cleanup = possibleAwait && !decrementExpectedAwaits();
        var rv = new DexiePromise((resolve, reject) => {
          propagateToListener(this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait, cleanup), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait, cleanup), resolve, reject, psd));
        });
        if (this._consoleTask)
          rv._consoleTask = this._consoleTask;
        return rv;
      }
      then.prototype = INTERNAL;
      return then;
    },
    set: function(value) {
      setProp(this, "then", value && value.prototype === INTERNAL ? thenProp : {
        get: function() {
          return value;
        },
        set: thenProp.set
      });
    }
  };
  props(DexiePromise.prototype, {
    then: thenProp,
    _then: function(onFulfilled, onRejected) {
      propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
    },
    catch: function(onRejected) {
      if (arguments.length === 1)
        return this.then(null, onRejected);
      var type2 = arguments[0], handler = arguments[1];
      return typeof type2 === "function" ? this.then(null, (err) => err instanceof type2 ? handler(err) : PromiseReject(err)) : this.then(null, (err) => err && err.name === type2 ? handler(err) : PromiseReject(err));
    },
    finally: function(onFinally) {
      return this.then((value) => {
        return DexiePromise.resolve(onFinally()).then(() => value);
      }, (err) => {
        return DexiePromise.resolve(onFinally()).then(() => PromiseReject(err));
      });
    },
    timeout: function(ms, msg) {
      return ms < Infinity ? new DexiePromise((resolve, reject) => {
        var handle = setTimeout(() => reject(new exceptions.Timeout(msg)), ms);
        this.then(resolve, reject).finally(clearTimeout.bind(null, handle));
      }) : this;
    }
  });
  if (typeof Symbol !== "undefined" && Symbol.toStringTag)
    setProp(DexiePromise.prototype, Symbol.toStringTag, "Dexie.Promise");
  globalPSD.env = snapShot();
  function Listener(onFulfilled, onRejected, resolve, reject, zone) {
    this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
    this.onRejected = typeof onRejected === "function" ? onRejected : null;
    this.resolve = resolve;
    this.reject = reject;
    this.psd = zone;
  }
  props(DexiePromise, {
    all: function() {
      var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
      return new DexiePromise(function(resolve, reject) {
        if (values.length === 0)
          resolve([]);
        var remaining = values.length;
        values.forEach((a, i) => DexiePromise.resolve(a).then((x) => {
          values[i] = x;
          if (!--remaining)
            resolve(values);
        }, reject));
      });
    },
    resolve: (value) => {
      if (value instanceof DexiePromise)
        return value;
      if (value && typeof value.then === "function")
        return new DexiePromise((resolve, reject) => {
          value.then(resolve, reject);
        });
      var rv = new DexiePromise(INTERNAL, true, value);
      return rv;
    },
    reject: PromiseReject,
    race: function() {
      var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
      return new DexiePromise((resolve, reject) => {
        values.map((value) => DexiePromise.resolve(value).then(resolve, reject));
      });
    },
    PSD: {
      get: () => PSD,
      set: (value) => PSD = value
    },
    totalEchoes: { get: () => totalEchoes },
    newPSD: newScope,
    usePSD,
    scheduler: {
      get: () => asap,
      set: (value) => {
        asap = value;
      }
    },
    rejectionMapper: {
      get: () => rejectionMapper,
      set: (value) => {
        rejectionMapper = value;
      }
    },
    follow: (fn, zoneProps) => {
      return new DexiePromise((resolve, reject) => {
        return newScope((resolve2, reject2) => {
          var psd = PSD;
          psd.unhandleds = [];
          psd.onunhandled = reject2;
          psd.finalize = callBoth(function() {
            run_at_end_of_this_or_next_physical_tick(() => {
              this.unhandleds.length === 0 ? resolve2() : reject2(this.unhandleds[0]);
            });
          }, psd.finalize);
          fn();
        }, zoneProps, resolve, reject);
      });
    }
  });
  if (NativePromise) {
    if (NativePromise.allSettled)
      setProp(DexiePromise, "allSettled", function() {
        const possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
        return new DexiePromise((resolve) => {
          if (possiblePromises.length === 0)
            resolve([]);
          let remaining = possiblePromises.length;
          const results = new Array(remaining);
          possiblePromises.forEach((p, i) => DexiePromise.resolve(p).then((value) => results[i] = { status: "fulfilled", value }, (reason) => results[i] = { status: "rejected", reason }).then(() => --remaining || resolve(results)));
        });
      });
    if (NativePromise.any && typeof AggregateError !== "undefined")
      setProp(DexiePromise, "any", function() {
        const possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
        return new DexiePromise((resolve, reject) => {
          if (possiblePromises.length === 0)
            reject(new AggregateError([]));
          let remaining = possiblePromises.length;
          const failures = new Array(remaining);
          possiblePromises.forEach((p, i) => DexiePromise.resolve(p).then((value) => resolve(value), (failure) => {
            failures[i] = failure;
            if (!--remaining)
              reject(new AggregateError(failures));
          }));
        });
      });
  }
  function executePromiseTask(promise, fn) {
    try {
      fn((value) => {
        if (promise._state !== null)
          return;
        if (value === promise)
          throw new TypeError("A promise cannot be resolved with itself.");
        var shouldExecuteTick = promise._lib && beginMicroTickScope();
        if (value && typeof value.then === "function") {
          executePromiseTask(promise, (resolve, reject) => {
            value instanceof DexiePromise ? value._then(resolve, reject) : value.then(resolve, reject);
          });
        } else {
          promise._state = true;
          promise._value = value;
          propagateAllListeners(promise);
        }
        if (shouldExecuteTick)
          endMicroTickScope();
      }, handleRejection.bind(null, promise));
    } catch (ex) {
      handleRejection(promise, ex);
    }
  }
  function handleRejection(promise, reason) {
    rejectingErrors.push(reason);
    if (promise._state !== null)
      return;
    var shouldExecuteTick = promise._lib && beginMicroTickScope();
    reason = rejectionMapper(reason);
    promise._state = false;
    promise._value = reason;
    addPossiblyUnhandledError(promise);
    propagateAllListeners(promise);
    if (shouldExecuteTick)
      endMicroTickScope();
  }
  function propagateAllListeners(promise) {
    var listeners = promise._listeners;
    promise._listeners = [];
    for (var i = 0, len = listeners.length; i < len; ++i) {
      propagateToListener(promise, listeners[i]);
    }
    var psd = promise._PSD;
    --psd.ref || psd.finalize();
    if (numScheduledCalls === 0) {
      ++numScheduledCalls;
      asap(() => {
        if (--numScheduledCalls === 0)
          finalizePhysicalTick();
      }, []);
    }
  }
  function propagateToListener(promise, listener) {
    if (promise._state === null) {
      promise._listeners.push(listener);
      return;
    }
    var cb = promise._state ? listener.onFulfilled : listener.onRejected;
    if (cb === null) {
      return (promise._state ? listener.resolve : listener.reject)(promise._value);
    }
    ++listener.psd.ref;
    ++numScheduledCalls;
    asap(callListener, [cb, promise, listener]);
  }
  function callListener(cb, promise, listener) {
    try {
      var ret, value = promise._value;
      if (!promise._state && rejectingErrors.length)
        rejectingErrors = [];
      ret = debug && promise._consoleTask ? promise._consoleTask.run(() => cb(value)) : cb(value);
      if (!promise._state && rejectingErrors.indexOf(value) === -1) {
        markErrorAsHandled(promise);
      }
      listener.resolve(ret);
    } catch (e) {
      listener.reject(e);
    } finally {
      if (--numScheduledCalls === 0)
        finalizePhysicalTick();
      --listener.psd.ref || listener.psd.finalize();
    }
  }
  function physicalTick() {
    usePSD(globalPSD, () => {
      beginMicroTickScope() && endMicroTickScope();
    });
  }
  function beginMicroTickScope() {
    var wasRootExec = isOutsideMicroTick;
    isOutsideMicroTick = false;
    needsNewPhysicalTick = false;
    return wasRootExec;
  }
  function endMicroTickScope() {
    var callbacks, i, l;
    do {
      while (microtickQueue.length > 0) {
        callbacks = microtickQueue;
        microtickQueue = [];
        l = callbacks.length;
        for (i = 0; i < l; ++i) {
          var item = callbacks[i];
          item[0].apply(null, item[1]);
        }
      }
    } while (microtickQueue.length > 0);
    isOutsideMicroTick = true;
    needsNewPhysicalTick = true;
  }
  function finalizePhysicalTick() {
    var unhandledErrs = unhandledErrors;
    unhandledErrors = [];
    unhandledErrs.forEach((p) => {
      p._PSD.onunhandled.call(null, p._value, p);
    });
    var finalizers = tickFinalizers.slice(0);
    var i = finalizers.length;
    while (i)
      finalizers[--i]();
  }
  function run_at_end_of_this_or_next_physical_tick(fn) {
    function finalizer() {
      fn();
      tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
    }
    tickFinalizers.push(finalizer);
    ++numScheduledCalls;
    asap(() => {
      if (--numScheduledCalls === 0)
        finalizePhysicalTick();
    }, []);
  }
  function addPossiblyUnhandledError(promise) {
    if (!unhandledErrors.some((p) => p._value === promise._value))
      unhandledErrors.push(promise);
  }
  function markErrorAsHandled(promise) {
    var i = unhandledErrors.length;
    while (i)
      if (unhandledErrors[--i]._value === promise._value) {
        unhandledErrors.splice(i, 1);
        return;
      }
  }
  function PromiseReject(reason) {
    return new DexiePromise(INTERNAL, false, reason);
  }
  function wrap(fn, errorCatcher) {
    var psd = PSD;
    return function() {
      var wasRootExec = beginMicroTickScope(), outerScope = PSD;
      try {
        switchToZone(psd, true);
        return fn.apply(this, arguments);
      } catch (e) {
        errorCatcher && errorCatcher(e);
      } finally {
        switchToZone(outerScope, false);
        if (wasRootExec)
          endMicroTickScope();
      }
    };
  }
  var task = { awaits: 0, echoes: 0, id: 0 };
  var taskCounter = 0;
  var zoneStack = [];
  var zoneEchoes = 0;
  var totalEchoes = 0;
  var zone_id_counter = 0;
  function newScope(fn, props2, a1, a2) {
    var parent = PSD, psd = Object.create(parent);
    psd.parent = parent;
    psd.ref = 0;
    psd.global = false;
    psd.id = ++zone_id_counter;
    globalPSD.env;
    psd.env = patchGlobalPromise ? {
      Promise: DexiePromise,
      PromiseProp: { value: DexiePromise, configurable: true, writable: true },
      all: DexiePromise.all,
      race: DexiePromise.race,
      allSettled: DexiePromise.allSettled,
      any: DexiePromise.any,
      resolve: DexiePromise.resolve,
      reject: DexiePromise.reject
    } : {};
    if (props2)
      extend(psd, props2);
    ++parent.ref;
    psd.finalize = function() {
      --this.parent.ref || this.parent.finalize();
    };
    var rv = usePSD(psd, fn, a1, a2);
    if (psd.ref === 0)
      psd.finalize();
    return rv;
  }
  function incrementExpectedAwaits() {
    if (!task.id)
      task.id = ++taskCounter;
    ++task.awaits;
    task.echoes += ZONE_ECHO_LIMIT;
    return task.id;
  }
  function decrementExpectedAwaits() {
    if (!task.awaits)
      return false;
    if (--task.awaits === 0)
      task.id = 0;
    task.echoes = task.awaits * ZONE_ECHO_LIMIT;
    return true;
  }
  if (("" + nativePromiseThen).indexOf("[native code]") === -1) {
    incrementExpectedAwaits = decrementExpectedAwaits = nop;
  }
  function onPossibleParallellAsync(possiblePromise) {
    if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
      incrementExpectedAwaits();
      return possiblePromise.then((x) => {
        decrementExpectedAwaits();
        return x;
      }, (e) => {
        decrementExpectedAwaits();
        return rejection(e);
      });
    }
    return possiblePromise;
  }
  function zoneEnterEcho(targetZone) {
    ++totalEchoes;
    if (!task.echoes || --task.echoes === 0) {
      task.echoes = task.awaits = task.id = 0;
    }
    zoneStack.push(PSD);
    switchToZone(targetZone, true);
  }
  function zoneLeaveEcho() {
    var zone = zoneStack[zoneStack.length - 1];
    zoneStack.pop();
    switchToZone(zone, false);
  }
  function switchToZone(targetZone, bEnteringZone) {
    var currentZone = PSD;
    if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)) {
      queueMicrotask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
    }
    if (targetZone === PSD)
      return;
    PSD = targetZone;
    if (currentZone === globalPSD)
      globalPSD.env = snapShot();
    if (patchGlobalPromise) {
      var GlobalPromise = globalPSD.env.Promise;
      var targetEnv = targetZone.env;
      if (currentZone.global || targetZone.global) {
        Object.defineProperty(_global, "Promise", targetEnv.PromiseProp);
        GlobalPromise.all = targetEnv.all;
        GlobalPromise.race = targetEnv.race;
        GlobalPromise.resolve = targetEnv.resolve;
        GlobalPromise.reject = targetEnv.reject;
        if (targetEnv.allSettled)
          GlobalPromise.allSettled = targetEnv.allSettled;
        if (targetEnv.any)
          GlobalPromise.any = targetEnv.any;
      }
    }
  }
  function snapShot() {
    var GlobalPromise = _global.Promise;
    return patchGlobalPromise ? {
      Promise: GlobalPromise,
      PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
      all: GlobalPromise.all,
      race: GlobalPromise.race,
      allSettled: GlobalPromise.allSettled,
      any: GlobalPromise.any,
      resolve: GlobalPromise.resolve,
      reject: GlobalPromise.reject
    } : {};
  }
  function usePSD(psd, fn, a1, a2, a3) {
    var outerScope = PSD;
    try {
      switchToZone(psd, true);
      return fn(a1, a2, a3);
    } finally {
      switchToZone(outerScope, false);
    }
  }
  function nativeAwaitCompatibleWrap(fn, zone, possibleAwait, cleanup) {
    return typeof fn !== "function" ? fn : function() {
      var outerZone = PSD;
      if (possibleAwait)
        incrementExpectedAwaits();
      switchToZone(zone, true);
      try {
        return fn.apply(this, arguments);
      } finally {
        switchToZone(outerZone, false);
        if (cleanup)
          queueMicrotask(decrementExpectedAwaits);
      }
    };
  }
  function execInGlobalContext(cb) {
    if (Promise === NativePromise && task.echoes === 0) {
      if (zoneEchoes === 0) {
        cb();
      } else {
        enqueueNativeMicroTask(cb);
      }
    } else {
      setTimeout(cb, 0);
    }
  }
  var rejection = DexiePromise.reject;
  function tempTransaction(db, mode, storeNames, fn) {
    if (!db.idbdb || !db._state.openComplete && (!PSD.letThrough && !db._vip)) {
      if (db._state.openComplete) {
        return rejection(new exceptions.DatabaseClosed(db._state.dbOpenError));
      }
      if (!db._state.isBeingOpened) {
        if (!db._state.autoOpen)
          return rejection(new exceptions.DatabaseClosed());
        db.open().catch(nop);
      }
      return db._state.dbReadyPromise.then(() => tempTransaction(db, mode, storeNames, fn));
    } else {
      var trans = db._createTransaction(mode, storeNames, db._dbSchema);
      try {
        trans.create();
        db._state.PR1398_maxLoop = 3;
      } catch (ex) {
        if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
          console.warn("Dexie: Need to reopen db");
          db.close({ disableAutoOpen: false });
          return db.open().then(() => tempTransaction(db, mode, storeNames, fn));
        }
        return rejection(ex);
      }
      return trans._promise(mode, (resolve, reject) => {
        return newScope(() => {
          PSD.trans = trans;
          return fn(resolve, reject, trans);
        });
      }).then((result) => {
        if (mode === "readwrite")
          try {
            trans.idbtrans.commit();
          } catch {
          }
        return mode === "readonly" ? result : trans._completion.then(() => result);
      });
    }
  }
  var DEXIE_VERSION = "4.0.8";
  var maxString = String.fromCharCode(65535);
  var minKey = -Infinity;
  var INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
  var STRING_EXPECTED = "String expected.";
  var connections = [];
  var DBNAMES_DB = "__dbnames";
  var READONLY = "readonly";
  var READWRITE = "readwrite";
  function combine(filter1, filter2) {
    return filter1 ? filter2 ? function() {
      return filter1.apply(this, arguments) && filter2.apply(this, arguments);
    } : filter1 : filter2;
  }
  var AnyRange = {
    type: 3,
    lower: -Infinity,
    lowerOpen: false,
    upper: [[]],
    upperOpen: false
  };
  function workaroundForUndefinedPrimKey(keyPath) {
    return typeof keyPath === "string" && !/\./.test(keyPath) ? (obj) => {
      if (obj[keyPath] === void 0 && keyPath in obj) {
        obj = deepClone(obj);
        delete obj[keyPath];
      }
      return obj;
    } : (obj) => obj;
  }
  function Entity() {
    throw exceptions.Type();
  }
  function cmp(a, b) {
    try {
      const ta = type(a);
      const tb = type(b);
      if (ta !== tb) {
        if (ta === "Array")
          return 1;
        if (tb === "Array")
          return -1;
        if (ta === "binary")
          return 1;
        if (tb === "binary")
          return -1;
        if (ta === "string")
          return 1;
        if (tb === "string")
          return -1;
        if (ta === "Date")
          return 1;
        if (tb !== "Date")
          return NaN;
        return -1;
      }
      switch (ta) {
        case "number":
        case "Date":
        case "string":
          return a > b ? 1 : a < b ? -1 : 0;
        case "binary": {
          return compareUint8Arrays(getUint8Array(a), getUint8Array(b));
        }
        case "Array":
          return compareArrays(a, b);
      }
    } catch {
    }
    return NaN;
  }
  function compareArrays(a, b) {
    const al = a.length;
    const bl = b.length;
    const l = al < bl ? al : bl;
    for (let i = 0; i < l; ++i) {
      const res = cmp(a[i], b[i]);
      if (res !== 0)
        return res;
    }
    return al === bl ? 0 : al < bl ? -1 : 1;
  }
  function compareUint8Arrays(a, b) {
    const al = a.length;
    const bl = b.length;
    const l = al < bl ? al : bl;
    for (let i = 0; i < l; ++i) {
      if (a[i] !== b[i])
        return a[i] < b[i] ? -1 : 1;
    }
    return al === bl ? 0 : al < bl ? -1 : 1;
  }
  function type(x) {
    const t = typeof x;
    if (t !== "object")
      return t;
    if (ArrayBuffer.isView(x))
      return "binary";
    const tsTag = toStringTag(x);
    return tsTag === "ArrayBuffer" ? "binary" : tsTag;
  }
  function getUint8Array(a) {
    if (a instanceof Uint8Array)
      return a;
    if (ArrayBuffer.isView(a))
      return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
    return new Uint8Array(a);
  }
  var Table = class {
    _trans(mode, fn, writeLocked) {
      const trans = this._tx || PSD.trans;
      const tableName = this.name;
      const task2 = debug && typeof console !== "undefined" && console.createTask && console.createTask(`Dexie: ${mode === "readonly" ? "read" : "write"} ${this.name}`);
      function checkTableInTransaction(resolve, reject, trans2) {
        if (!trans2.schema[tableName])
          throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
        return fn(trans2.idbtrans, trans2);
      }
      const wasRootExec = beginMicroTickScope();
      try {
        let p = trans && trans.db._novip === this.db._novip ? trans === PSD.trans ? trans._promise(mode, checkTableInTransaction, writeLocked) : newScope(() => trans._promise(mode, checkTableInTransaction, writeLocked), { trans, transless: PSD.transless || PSD }) : tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
        if (task2) {
          p._consoleTask = task2;
          p = p.catch((err) => {
            console.trace(err);
            return rejection(err);
          });
        }
        return p;
      } finally {
        if (wasRootExec)
          endMicroTickScope();
      }
    }
    get(keyOrCrit, cb) {
      if (keyOrCrit && keyOrCrit.constructor === Object)
        return this.where(keyOrCrit).first(cb);
      if (keyOrCrit == null)
        return rejection(new exceptions.Type(`Invalid argument to Table.get()`));
      return this._trans("readonly", (trans) => {
        return this.core.get({ trans, key: keyOrCrit }).then((res) => this.hook.reading.fire(res));
      }).then(cb);
    }
    where(indexOrCrit) {
      if (typeof indexOrCrit === "string")
        return new this.db.WhereClause(this, indexOrCrit);
      if (isArray(indexOrCrit))
        return new this.db.WhereClause(this, `[${indexOrCrit.join("+")}]`);
      const keyPaths = keys(indexOrCrit);
      if (keyPaths.length === 1)
        return this.where(keyPaths[0]).equals(indexOrCrit[keyPaths[0]]);
      const compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter((ix) => {
        if (ix.compound && keyPaths.every((keyPath) => ix.keyPath.indexOf(keyPath) >= 0)) {
          for (let i = 0; i < keyPaths.length; ++i) {
            if (keyPaths.indexOf(ix.keyPath[i]) === -1)
              return false;
          }
          return true;
        }
        return false;
      }).sort((a, b) => a.keyPath.length - b.keyPath.length)[0];
      if (compoundIndex && this.db._maxKey !== maxString) {
        const keyPathsInValidOrder = compoundIndex.keyPath.slice(0, keyPaths.length);
        return this.where(keyPathsInValidOrder).equals(keyPathsInValidOrder.map((kp) => indexOrCrit[kp]));
      }
      if (!compoundIndex && debug)
        console.warn(`The query ${JSON.stringify(indexOrCrit)} on ${this.name} would benefit from a compound index [${keyPaths.join("+")}]`);
      const { idxByName } = this.schema;
      const idb = this.db._deps.indexedDB;
      function equals(a, b) {
        return idb.cmp(a, b) === 0;
      }
      const [idx, filterFunction] = keyPaths.reduce(([prevIndex, prevFilterFn], keyPath) => {
        const index = idxByName[keyPath];
        const value = indexOrCrit[keyPath];
        return [
          prevIndex || index,
          prevIndex || !index ? combine(prevFilterFn, index && index.multi ? (x) => {
            const prop = getByKeyPath(x, keyPath);
            return isArray(prop) && prop.some((item) => equals(value, item));
          } : (x) => equals(value, getByKeyPath(x, keyPath))) : prevFilterFn
        ];
      }, [null, null]);
      return idx ? this.where(idx.name).equals(indexOrCrit[idx.keyPath]).filter(filterFunction) : compoundIndex ? this.filter(filterFunction) : this.where(keyPaths).equals("");
    }
    filter(filterFunction) {
      return this.toCollection().and(filterFunction);
    }
    count(thenShortcut) {
      return this.toCollection().count(thenShortcut);
    }
    offset(offset) {
      return this.toCollection().offset(offset);
    }
    limit(numRows) {
      return this.toCollection().limit(numRows);
    }
    each(callback) {
      return this.toCollection().each(callback);
    }
    toArray(thenShortcut) {
      return this.toCollection().toArray(thenShortcut);
    }
    toCollection() {
      return new this.db.Collection(new this.db.WhereClause(this));
    }
    orderBy(index) {
      return new this.db.Collection(new this.db.WhereClause(this, isArray(index) ? `[${index.join("+")}]` : index));
    }
    reverse() {
      return this.toCollection().reverse();
    }
    mapToClass(constructor) {
      const { db, name: tableName } = this;
      this.schema.mappedClass = constructor;
      if (constructor.prototype instanceof Entity) {
        constructor = class extends constructor {
          get db() {
            return db;
          }
          table() {
            return tableName;
          }
        };
      }
      const inheritedProps = /* @__PURE__ */ new Set();
      for (let proto = constructor.prototype; proto; proto = getProto(proto)) {
        Object.getOwnPropertyNames(proto).forEach((propName) => inheritedProps.add(propName));
      }
      const readHook = (obj) => {
        if (!obj)
          return obj;
        const res = Object.create(constructor.prototype);
        for (let m in obj)
          if (!inheritedProps.has(m))
            try {
              res[m] = obj[m];
            } catch (_) {
            }
        return res;
      };
      if (this.schema.readHook) {
        this.hook.reading.unsubscribe(this.schema.readHook);
      }
      this.schema.readHook = readHook;
      this.hook("reading", readHook);
      return constructor;
    }
    defineClass() {
      function Class(content) {
        extend(this, content);
      }
      return this.mapToClass(Class);
    }
    add(obj, key) {
      const { auto, keyPath } = this.schema.primKey;
      let objToAdd = obj;
      if (keyPath && auto) {
        objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
      }
      return this._trans("readwrite", (trans) => {
        return this.core.mutate({ trans, type: "add", keys: key != null ? [key] : null, values: [objToAdd] });
      }).then((res) => res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult).then((lastResult) => {
        if (keyPath) {
          try {
            setByKeyPath(obj, keyPath, lastResult);
          } catch (_) {
          }
        }
        return lastResult;
      });
    }
    update(keyOrObject, modifications) {
      if (typeof keyOrObject === "object" && !isArray(keyOrObject)) {
        const key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
        if (key === void 0)
          return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
        return this.where(":id").equals(key).modify(modifications);
      } else {
        return this.where(":id").equals(keyOrObject).modify(modifications);
      }
    }
    put(obj, key) {
      const { auto, keyPath } = this.schema.primKey;
      let objToAdd = obj;
      if (keyPath && auto) {
        objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
      }
      return this._trans("readwrite", (trans) => this.core.mutate({ trans, type: "put", values: [objToAdd], keys: key != null ? [key] : null })).then((res) => res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult).then((lastResult) => {
        if (keyPath) {
          try {
            setByKeyPath(obj, keyPath, lastResult);
          } catch (_) {
          }
        }
        return lastResult;
      });
    }
    delete(key) {
      return this._trans("readwrite", (trans) => this.core.mutate({ trans, type: "delete", keys: [key] })).then((res) => res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0);
    }
    clear() {
      return this._trans("readwrite", (trans) => this.core.mutate({ trans, type: "deleteRange", range: AnyRange })).then((res) => res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0);
    }
    bulkGet(keys2) {
      return this._trans("readonly", (trans) => {
        return this.core.getMany({
          keys: keys2,
          trans
        }).then((result) => result.map((res) => this.hook.reading.fire(res)));
      });
    }
    bulkAdd(objects, keysOrOptions, options) {
      const keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
      options = options || (keys2 ? void 0 : keysOrOptions);
      const wantResults = options ? options.allKeys : void 0;
      return this._trans("readwrite", (trans) => {
        const { auto, keyPath } = this.schema.primKey;
        if (keyPath && keys2)
          throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
        if (keys2 && keys2.length !== objects.length)
          throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
        const numObjects = objects.length;
        let objectsToAdd = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
        return this.core.mutate({ trans, type: "add", keys: keys2, values: objectsToAdd, wantResults }).then(({ numFailures, results, lastResult, failures }) => {
          const result = wantResults ? results : lastResult;
          if (numFailures === 0)
            return result;
          throw new BulkError(`${this.name}.bulkAdd(): ${numFailures} of ${numObjects} operations failed`, failures);
        });
      });
    }
    bulkPut(objects, keysOrOptions, options) {
      const keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
      options = options || (keys2 ? void 0 : keysOrOptions);
      const wantResults = options ? options.allKeys : void 0;
      return this._trans("readwrite", (trans) => {
        const { auto, keyPath } = this.schema.primKey;
        if (keyPath && keys2)
          throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
        if (keys2 && keys2.length !== objects.length)
          throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
        const numObjects = objects.length;
        let objectsToPut = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
        return this.core.mutate({ trans, type: "put", keys: keys2, values: objectsToPut, wantResults }).then(({ numFailures, results, lastResult, failures }) => {
          const result = wantResults ? results : lastResult;
          if (numFailures === 0)
            return result;
          throw new BulkError(`${this.name}.bulkPut(): ${numFailures} of ${numObjects} operations failed`, failures);
        });
      });
    }
    bulkUpdate(keysAndChanges) {
      const coreTable = this.core;
      const keys2 = keysAndChanges.map((entry) => entry.key);
      const changeSpecs = keysAndChanges.map((entry) => entry.changes);
      const offsetMap = [];
      return this._trans("readwrite", (trans) => {
        return coreTable.getMany({ trans, keys: keys2, cache: "clone" }).then((objs) => {
          const resultKeys = [];
          const resultObjs = [];
          keysAndChanges.forEach(({ key, changes }, idx) => {
            const obj = objs[idx];
            if (obj) {
              for (const keyPath of Object.keys(changes)) {
                const value = changes[keyPath];
                if (keyPath === this.schema.primKey.keyPath) {
                  if (cmp(value, key) !== 0) {
                    throw new exceptions.Constraint(`Cannot update primary key in bulkUpdate()`);
                  }
                } else {
                  setByKeyPath(obj, keyPath, value);
                }
              }
              offsetMap.push(idx);
              resultKeys.push(key);
              resultObjs.push(obj);
            }
          });
          const numEntries = resultKeys.length;
          return coreTable.mutate({
            trans,
            type: "put",
            keys: resultKeys,
            values: resultObjs,
            updates: {
              keys: keys2,
              changeSpecs
            }
          }).then(({ numFailures, failures }) => {
            if (numFailures === 0)
              return numEntries;
            for (const offset of Object.keys(failures)) {
              const mappedOffset = offsetMap[Number(offset)];
              if (mappedOffset != null) {
                const failure = failures[offset];
                delete failures[offset];
                failures[mappedOffset] = failure;
              }
            }
            throw new BulkError(`${this.name}.bulkUpdate(): ${numFailures} of ${numEntries} operations failed`, failures);
          });
        });
      });
    }
    bulkDelete(keys2) {
      const numKeys = keys2.length;
      return this._trans("readwrite", (trans) => {
        return this.core.mutate({ trans, type: "delete", keys: keys2 });
      }).then(({ numFailures, lastResult, failures }) => {
        if (numFailures === 0)
          return lastResult;
        throw new BulkError(`${this.name}.bulkDelete(): ${numFailures} of ${numKeys} operations failed`, failures);
      });
    }
  };
  function Events(ctx) {
    var evs = {};
    var rv = function(eventName, subscriber) {
      if (subscriber) {
        var i2 = arguments.length, args = new Array(i2 - 1);
        while (--i2)
          args[i2 - 1] = arguments[i2];
        evs[eventName].subscribe.apply(null, args);
        return ctx;
      } else if (typeof eventName === "string") {
        return evs[eventName];
      }
    };
    rv.addEventType = add;
    for (var i = 1, l = arguments.length; i < l; ++i) {
      add(arguments[i]);
    }
    return rv;
    function add(eventName, chainFunction, defaultFunction) {
      if (typeof eventName === "object")
        return addConfiguredEvents(eventName);
      if (!chainFunction)
        chainFunction = reverseStoppableEventChain;
      if (!defaultFunction)
        defaultFunction = nop;
      var context = {
        subscribers: [],
        fire: defaultFunction,
        subscribe: function(cb) {
          if (context.subscribers.indexOf(cb) === -1) {
            context.subscribers.push(cb);
            context.fire = chainFunction(context.fire, cb);
          }
        },
        unsubscribe: function(cb) {
          context.subscribers = context.subscribers.filter(function(fn) {
            return fn !== cb;
          });
          context.fire = context.subscribers.reduce(chainFunction, defaultFunction);
        }
      };
      evs[eventName] = rv[eventName] = context;
      return context;
    }
    function addConfiguredEvents(cfg) {
      keys(cfg).forEach(function(eventName) {
        var args = cfg[eventName];
        if (isArray(args)) {
          add(eventName, cfg[eventName][0], cfg[eventName][1]);
        } else if (args === "asap") {
          var context = add(eventName, mirror, function fire() {
            var i2 = arguments.length, args2 = new Array(i2);
            while (i2--)
              args2[i2] = arguments[i2];
            context.subscribers.forEach(function(fn) {
              asap$1(function fireEvent() {
                fn.apply(null, args2);
              });
            });
          });
        } else
          throw new exceptions.InvalidArgument("Invalid event config");
      });
    }
  }
  function makeClassConstructor(prototype, constructor) {
    derive(constructor).from({ prototype });
    return constructor;
  }
  function createTableConstructor(db) {
    return makeClassConstructor(Table.prototype, function Table2(name, tableSchema, trans) {
      this.db = db;
      this._tx = trans;
      this.name = name;
      this.schema = tableSchema;
      this.hook = db._allTables[name] ? db._allTables[name].hook : Events(null, {
        "creating": [hookCreatingChain, nop],
        "reading": [pureFunctionChain, mirror],
        "updating": [hookUpdatingChain, nop],
        "deleting": [hookDeletingChain, nop]
      });
    });
  }
  function isPlainKeyRange(ctx, ignoreLimitFilter) {
    return !(ctx.filter || ctx.algorithm || ctx.or) && (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
  }
  function addFilter(ctx, fn) {
    ctx.filter = combine(ctx.filter, fn);
  }
  function addReplayFilter(ctx, factory, isLimitFilter) {
    var curr = ctx.replayFilter;
    ctx.replayFilter = curr ? () => combine(curr(), factory()) : factory;
    ctx.justLimit = isLimitFilter && !curr;
  }
  function addMatchFilter(ctx, fn) {
    ctx.isMatch = combine(ctx.isMatch, fn);
  }
  function getIndexOrStore(ctx, coreSchema) {
    if (ctx.isPrimKey)
      return coreSchema.primaryKey;
    const index = coreSchema.getIndexByKeyPath(ctx.index);
    if (!index)
      throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + coreSchema.name + " is not indexed");
    return index;
  }
  function openCursor(ctx, coreTable, trans) {
    const index = getIndexOrStore(ctx, coreTable.schema);
    return coreTable.openCursor({
      trans,
      values: !ctx.keysOnly,
      reverse: ctx.dir === "prev",
      unique: !!ctx.unique,
      query: {
        index,
        range: ctx.range
      }
    });
  }
  function iter(ctx, fn, coreTrans, coreTable) {
    const filter = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
    if (!ctx.or) {
      return iterate(openCursor(ctx, coreTable, coreTrans), combine(ctx.algorithm, filter), fn, !ctx.keysOnly && ctx.valueMapper);
    } else {
      const set = {};
      const union = (item, cursor, advance) => {
        if (!filter || filter(cursor, advance, (result) => cursor.stop(result), (err) => cursor.fail(err))) {
          var primaryKey = cursor.primaryKey;
          var key = "" + primaryKey;
          if (key === "[object ArrayBuffer]")
            key = "" + new Uint8Array(primaryKey);
          if (!hasOwn(set, key)) {
            set[key] = true;
            fn(item, cursor, advance);
          }
        }
      };
      return Promise.all([
        ctx.or._iterate(union, coreTrans),
        iterate(openCursor(ctx, coreTable, coreTrans), ctx.algorithm, union, !ctx.keysOnly && ctx.valueMapper)
      ]);
    }
  }
  function iterate(cursorPromise, filter, fn, valueMapper) {
    var mappedFn = valueMapper ? (x, c, a) => fn(valueMapper(x), c, a) : fn;
    var wrappedFn = wrap(mappedFn);
    return cursorPromise.then((cursor) => {
      if (cursor) {
        return cursor.start(() => {
          var c = () => cursor.continue();
          if (!filter || filter(cursor, (advancer) => c = advancer, (val) => {
            cursor.stop(val);
            c = nop;
          }, (e) => {
            cursor.fail(e);
            c = nop;
          }))
            wrappedFn(cursor.value, cursor, (advancer) => c = advancer);
          c();
        });
      }
    });
  }
  var PropModSymbol = Symbol();
  var PropModification = class {
    execute(value) {
      if (this.add !== void 0) {
        const term = this.add;
        if (isArray(term)) {
          return [...isArray(value) ? value : [], ...term].sort();
        }
        if (typeof term === "number")
          return (Number(value) || 0) + term;
        if (typeof term === "bigint") {
          try {
            return BigInt(value) + term;
          } catch {
            return BigInt(0) + term;
          }
        }
        throw new TypeError(`Invalid term ${term}`);
      }
      if (this.remove !== void 0) {
        const subtrahend = this.remove;
        if (isArray(subtrahend)) {
          return isArray(value) ? value.filter((item) => !subtrahend.includes(item)).sort() : [];
        }
        if (typeof subtrahend === "number")
          return Number(value) - subtrahend;
        if (typeof subtrahend === "bigint") {
          try {
            return BigInt(value) - subtrahend;
          } catch {
            return BigInt(0) - subtrahend;
          }
        }
        throw new TypeError(`Invalid subtrahend ${subtrahend}`);
      }
      const prefixToReplace = this.replacePrefix?.[0];
      if (prefixToReplace && typeof value === "string" && value.startsWith(prefixToReplace)) {
        return this.replacePrefix[1] + value.substring(prefixToReplace.length);
      }
      return value;
    }
    constructor(spec) {
      Object.assign(this, spec);
    }
  };
  var Collection = class {
    _read(fn, cb) {
      var ctx = this._ctx;
      return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readonly", fn).then(cb);
    }
    _write(fn) {
      var ctx = this._ctx;
      return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readwrite", fn, "locked");
    }
    _addAlgorithm(fn) {
      var ctx = this._ctx;
      ctx.algorithm = combine(ctx.algorithm, fn);
    }
    _iterate(fn, coreTrans) {
      return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
    }
    clone(props2) {
      var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
      if (props2)
        extend(ctx, props2);
      rv._ctx = ctx;
      return rv;
    }
    raw() {
      this._ctx.valueMapper = null;
      return this;
    }
    each(fn) {
      var ctx = this._ctx;
      return this._read((trans) => iter(ctx, fn, trans, ctx.table.core));
    }
    count(cb) {
      return this._read((trans) => {
        const ctx = this._ctx;
        const coreTable = ctx.table.core;
        if (isPlainKeyRange(ctx, true)) {
          return coreTable.count({
            trans,
            query: {
              index: getIndexOrStore(ctx, coreTable.schema),
              range: ctx.range
            }
          }).then((count2) => Math.min(count2, ctx.limit));
        } else {
          var count = 0;
          return iter(ctx, () => {
            ++count;
            return false;
          }, trans, coreTable).then(() => count);
        }
      }).then(cb);
    }
    sortBy(keyPath, cb) {
      const parts = keyPath.split(".").reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
      function getval(obj, i) {
        if (i)
          return getval(obj[parts[i]], i - 1);
        return obj[lastPart];
      }
      var order = this._ctx.dir === "next" ? 1 : -1;
      function sorter(a, b) {
        var aVal = getval(a, lastIndex), bVal = getval(b, lastIndex);
        return aVal < bVal ? -order : aVal > bVal ? order : 0;
      }
      return this.toArray(function(a) {
        return a.sort(sorter);
      }).then(cb);
    }
    toArray(cb) {
      return this._read((trans) => {
        var ctx = this._ctx;
        if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
          const { valueMapper } = ctx;
          const index = getIndexOrStore(ctx, ctx.table.core.schema);
          return ctx.table.core.query({
            trans,
            limit: ctx.limit,
            values: true,
            query: {
              index,
              range: ctx.range
            }
          }).then(({ result }) => valueMapper ? result.map(valueMapper) : result);
        } else {
          const a = [];
          return iter(ctx, (item) => a.push(item), trans, ctx.table.core).then(() => a);
        }
      }, cb);
    }
    offset(offset) {
      var ctx = this._ctx;
      if (offset <= 0)
        return this;
      ctx.offset += offset;
      if (isPlainKeyRange(ctx)) {
        addReplayFilter(ctx, () => {
          var offsetLeft = offset;
          return (cursor, advance) => {
            if (offsetLeft === 0)
              return true;
            if (offsetLeft === 1) {
              --offsetLeft;
              return false;
            }
            advance(() => {
              cursor.advance(offsetLeft);
              offsetLeft = 0;
            });
            return false;
          };
        });
      } else {
        addReplayFilter(ctx, () => {
          var offsetLeft = offset;
          return () => --offsetLeft < 0;
        });
      }
      return this;
    }
    limit(numRows) {
      this._ctx.limit = Math.min(this._ctx.limit, numRows);
      addReplayFilter(this._ctx, () => {
        var rowsLeft = numRows;
        return function(cursor, advance, resolve) {
          if (--rowsLeft <= 0)
            advance(resolve);
          return rowsLeft >= 0;
        };
      }, true);
      return this;
    }
    until(filterFunction, bIncludeStopEntry) {
      addFilter(this._ctx, function(cursor, advance, resolve) {
        if (filterFunction(cursor.value)) {
          advance(resolve);
          return bIncludeStopEntry;
        } else {
          return true;
        }
      });
      return this;
    }
    first(cb) {
      return this.limit(1).toArray(function(a) {
        return a[0];
      }).then(cb);
    }
    last(cb) {
      return this.reverse().first(cb);
    }
    filter(filterFunction) {
      addFilter(this._ctx, function(cursor) {
        return filterFunction(cursor.value);
      });
      addMatchFilter(this._ctx, filterFunction);
      return this;
    }
    and(filter) {
      return this.filter(filter);
    }
    or(indexName) {
      return new this.db.WhereClause(this._ctx.table, indexName, this);
    }
    reverse() {
      this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev";
      if (this._ondirectionchange)
        this._ondirectionchange(this._ctx.dir);
      return this;
    }
    desc() {
      return this.reverse();
    }
    eachKey(cb) {
      var ctx = this._ctx;
      ctx.keysOnly = !ctx.isMatch;
      return this.each(function(val, cursor) {
        cb(cursor.key, cursor);
      });
    }
    eachUniqueKey(cb) {
      this._ctx.unique = "unique";
      return this.eachKey(cb);
    }
    eachPrimaryKey(cb) {
      var ctx = this._ctx;
      ctx.keysOnly = !ctx.isMatch;
      return this.each(function(val, cursor) {
        cb(cursor.primaryKey, cursor);
      });
    }
    keys(cb) {
      var ctx = this._ctx;
      ctx.keysOnly = !ctx.isMatch;
      var a = [];
      return this.each(function(item, cursor) {
        a.push(cursor.key);
      }).then(function() {
        return a;
      }).then(cb);
    }
    primaryKeys(cb) {
      var ctx = this._ctx;
      if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
        return this._read((trans) => {
          var index = getIndexOrStore(ctx, ctx.table.core.schema);
          return ctx.table.core.query({
            trans,
            values: false,
            limit: ctx.limit,
            query: {
              index,
              range: ctx.range
            }
          });
        }).then(({ result }) => result).then(cb);
      }
      ctx.keysOnly = !ctx.isMatch;
      var a = [];
      return this.each(function(item, cursor) {
        a.push(cursor.primaryKey);
      }).then(function() {
        return a;
      }).then(cb);
    }
    uniqueKeys(cb) {
      this._ctx.unique = "unique";
      return this.keys(cb);
    }
    firstKey(cb) {
      return this.limit(1).keys(function(a) {
        return a[0];
      }).then(cb);
    }
    lastKey(cb) {
      return this.reverse().firstKey(cb);
    }
    distinct() {
      var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
      if (!idx || !idx.multi)
        return this;
      var set = {};
      addFilter(this._ctx, function(cursor) {
        var strKey = cursor.primaryKey.toString();
        var found = hasOwn(set, strKey);
        set[strKey] = true;
        return !found;
      });
      return this;
    }
    modify(changes) {
      var ctx = this._ctx;
      return this._write((trans) => {
        var modifyer;
        if (typeof changes === "function") {
          modifyer = changes;
        } else {
          var keyPaths = keys(changes);
          var numKeys = keyPaths.length;
          modifyer = function(item) {
            let anythingModified = false;
            for (let i = 0; i < numKeys; ++i) {
              let keyPath = keyPaths[i];
              let val = changes[keyPath];
              let origVal = getByKeyPath(item, keyPath);
              if (val instanceof PropModification) {
                setByKeyPath(item, keyPath, val.execute(origVal));
                anythingModified = true;
              } else if (origVal !== val) {
                setByKeyPath(item, keyPath, val);
                anythingModified = true;
              }
            }
            return anythingModified;
          };
        }
        const coreTable = ctx.table.core;
        const { outbound, extractKey } = coreTable.schema.primaryKey;
        const limit = this.db._options.modifyChunkSize || 200;
        const totalFailures = [];
        let successCount = 0;
        const failedKeys = [];
        const applyMutateResult = (expectedCount, res) => {
          const { failures, numFailures } = res;
          successCount += expectedCount - numFailures;
          for (let pos of keys(failures)) {
            totalFailures.push(failures[pos]);
          }
        };
        return this.clone().primaryKeys().then((keys2) => {
          const criteria = isPlainKeyRange(ctx) && ctx.limit === Infinity && (typeof changes !== "function" || changes === deleteCallback) && {
            index: ctx.index,
            range: ctx.range
          };
          const nextChunk = (offset) => {
            const count = Math.min(limit, keys2.length - offset);
            return coreTable.getMany({
              trans,
              keys: keys2.slice(offset, offset + count),
              cache: "immutable"
            }).then((values) => {
              const addValues = [];
              const putValues = [];
              const putKeys = outbound ? [] : null;
              const deleteKeys = [];
              for (let i = 0; i < count; ++i) {
                const origValue = values[i];
                const ctx2 = {
                  value: deepClone(origValue),
                  primKey: keys2[offset + i]
                };
                if (modifyer.call(ctx2, ctx2.value, ctx2) !== false) {
                  if (ctx2.value == null) {
                    deleteKeys.push(keys2[offset + i]);
                  } else if (!outbound && cmp(extractKey(origValue), extractKey(ctx2.value)) !== 0) {
                    deleteKeys.push(keys2[offset + i]);
                    addValues.push(ctx2.value);
                  } else {
                    putValues.push(ctx2.value);
                    if (outbound)
                      putKeys.push(keys2[offset + i]);
                  }
                }
              }
              return Promise.resolve(addValues.length > 0 && coreTable.mutate({ trans, type: "add", values: addValues }).then((res) => {
                for (let pos in res.failures) {
                  deleteKeys.splice(parseInt(pos), 1);
                }
                applyMutateResult(addValues.length, res);
              })).then(() => (putValues.length > 0 || criteria && typeof changes === "object") && coreTable.mutate({
                trans,
                type: "put",
                keys: putKeys,
                values: putValues,
                criteria,
                changeSpec: typeof changes !== "function" && changes,
                isAdditionalChunk: offset > 0
              }).then((res) => applyMutateResult(putValues.length, res))).then(() => (deleteKeys.length > 0 || criteria && changes === deleteCallback) && coreTable.mutate({
                trans,
                type: "delete",
                keys: deleteKeys,
                criteria,
                isAdditionalChunk: offset > 0
              }).then((res) => applyMutateResult(deleteKeys.length, res))).then(() => {
                return keys2.length > offset + count && nextChunk(offset + limit);
              });
            });
          };
          return nextChunk(0).then(() => {
            if (totalFailures.length > 0)
              throw new ModifyError("Error modifying one or more objects", totalFailures, successCount, failedKeys);
            return keys2.length;
          });
        });
      });
    }
    delete() {
      var ctx = this._ctx, range = ctx.range;
      if (isPlainKeyRange(ctx) && (ctx.isPrimKey || range.type === 3)) {
        return this._write((trans) => {
          const { primaryKey } = ctx.table.core.schema;
          const coreRange = range;
          return ctx.table.core.count({ trans, query: { index: primaryKey, range: coreRange } }).then((count) => {
            return ctx.table.core.mutate({ trans, type: "deleteRange", range: coreRange }).then(({ failures, lastResult, results, numFailures }) => {
              if (numFailures)
                throw new ModifyError("Could not delete some values", Object.keys(failures).map((pos) => failures[pos]), count - numFailures);
              return count - numFailures;
            });
          });
        });
      }
      return this.modify(deleteCallback);
    }
  };
  var deleteCallback = (value, ctx) => ctx.value = null;
  function createCollectionConstructor(db) {
    return makeClassConstructor(Collection.prototype, function Collection2(whereClause, keyRangeGenerator) {
      this.db = db;
      let keyRange = AnyRange, error = null;
      if (keyRangeGenerator)
        try {
          keyRange = keyRangeGenerator();
        } catch (ex) {
          error = ex;
        }
      const whereCtx = whereClause._ctx;
      const table = whereCtx.table;
      const readingHook = table.hook.reading.fire;
      this._ctx = {
        table,
        index: whereCtx.index,
        isPrimKey: !whereCtx.index || table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name,
        range: keyRange,
        keysOnly: false,
        dir: "next",
        unique: "",
        algorithm: null,
        filter: null,
        replayFilter: null,
        justLimit: true,
        isMatch: null,
        offset: 0,
        limit: Infinity,
        error,
        or: whereCtx.or,
        valueMapper: readingHook !== mirror ? readingHook : null
      };
    });
  }
  function simpleCompare(a, b) {
    return a < b ? -1 : a === b ? 0 : 1;
  }
  function simpleCompareReverse(a, b) {
    return a > b ? -1 : a === b ? 0 : 1;
  }
  function fail(collectionOrWhereClause, err, T) {
    var collection = collectionOrWhereClause instanceof WhereClause ? new collectionOrWhereClause.Collection(collectionOrWhereClause) : collectionOrWhereClause;
    collection._ctx.error = T ? new T(err) : new TypeError(err);
    return collection;
  }
  function emptyCollection(whereClause) {
    return new whereClause.Collection(whereClause, () => rangeEqual("")).limit(0);
  }
  function upperFactory(dir) {
    return dir === "next" ? (s) => s.toUpperCase() : (s) => s.toLowerCase();
  }
  function lowerFactory(dir) {
    return dir === "next" ? (s) => s.toLowerCase() : (s) => s.toUpperCase();
  }
  function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp2, dir) {
    var length = Math.min(key.length, lowerNeedle.length);
    var llp = -1;
    for (var i = 0; i < length; ++i) {
      var lwrKeyChar = lowerKey[i];
      if (lwrKeyChar !== lowerNeedle[i]) {
        if (cmp2(key[i], upperNeedle[i]) < 0)
          return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
        if (cmp2(key[i], lowerNeedle[i]) < 0)
          return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
        if (llp >= 0)
          return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
        return null;
      }
      if (cmp2(key[i], lwrKeyChar) < 0)
        llp = i;
    }
    if (length < lowerNeedle.length && dir === "next")
      return key + upperNeedle.substr(key.length);
    if (length < key.length && dir === "prev")
      return key.substr(0, upperNeedle.length);
    return llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1);
  }
  function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
    var upper, lower, compare, upperNeedles, lowerNeedles, direction, nextKeySuffix, needlesLen = needles.length;
    if (!needles.every((s) => typeof s === "string")) {
      return fail(whereClause, STRING_EXPECTED);
    }
    function initDirection(dir) {
      upper = upperFactory(dir);
      lower = lowerFactory(dir);
      compare = dir === "next" ? simpleCompare : simpleCompareReverse;
      var needleBounds = needles.map(function(needle) {
        return { lower: lower(needle), upper: upper(needle) };
      }).sort(function(a, b) {
        return compare(a.lower, b.lower);
      });
      upperNeedles = needleBounds.map(function(nb) {
        return nb.upper;
      });
      lowerNeedles = needleBounds.map(function(nb) {
        return nb.lower;
      });
      direction = dir;
      nextKeySuffix = dir === "next" ? "" : suffix;
    }
    initDirection("next");
    var c = new whereClause.Collection(whereClause, () => createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix));
    c._ondirectionchange = function(direction2) {
      initDirection(direction2);
    };
    var firstPossibleNeedle = 0;
    c._addAlgorithm(function(cursor, advance, resolve) {
      var key = cursor.key;
      if (typeof key !== "string")
        return false;
      var lowerKey = lower(key);
      if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
        return true;
      } else {
        var lowestPossibleCasing = null;
        for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
          var casing = nextCasing(key, lowerKey, upperNeedles[i], lowerNeedles[i], compare, direction);
          if (casing === null && lowestPossibleCasing === null)
            firstPossibleNeedle = i + 1;
          else if (lowestPossibleCasing === null || compare(lowestPossibleCasing, casing) > 0) {
            lowestPossibleCasing = casing;
          }
        }
        if (lowestPossibleCasing !== null) {
          advance(function() {
            cursor.continue(lowestPossibleCasing + nextKeySuffix);
          });
        } else {
          advance(resolve);
        }
        return false;
      }
    });
    return c;
  }
  function createRange(lower, upper, lowerOpen, upperOpen) {
    return {
      type: 2,
      lower,
      upper,
      lowerOpen,
      upperOpen
    };
  }
  function rangeEqual(value) {
    return {
      type: 1,
      lower: value,
      upper: value
    };
  }
  var WhereClause = class {
    get Collection() {
      return this._ctx.table.db.Collection;
    }
    between(lower, upper, includeLower, includeUpper) {
      includeLower = includeLower !== false;
      includeUpper = includeUpper === true;
      try {
        if (this._cmp(lower, upper) > 0 || this._cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper))
          return emptyCollection(this);
        return new this.Collection(this, () => createRange(lower, upper, !includeLower, !includeUpper));
      } catch (e) {
        return fail(this, INVALID_KEY_ARGUMENT);
      }
    }
    equals(value) {
      if (value == null)
        return fail(this, INVALID_KEY_ARGUMENT);
      return new this.Collection(this, () => rangeEqual(value));
    }
    above(value) {
      if (value == null)
        return fail(this, INVALID_KEY_ARGUMENT);
      return new this.Collection(this, () => createRange(value, void 0, true));
    }
    aboveOrEqual(value) {
      if (value == null)
        return fail(this, INVALID_KEY_ARGUMENT);
      return new this.Collection(this, () => createRange(value, void 0, false));
    }
    below(value) {
      if (value == null)
        return fail(this, INVALID_KEY_ARGUMENT);
      return new this.Collection(this, () => createRange(void 0, value, false, true));
    }
    belowOrEqual(value) {
      if (value == null)
        return fail(this, INVALID_KEY_ARGUMENT);
      return new this.Collection(this, () => createRange(void 0, value));
    }
    startsWith(str) {
      if (typeof str !== "string")
        return fail(this, STRING_EXPECTED);
      return this.between(str, str + maxString, true, true);
    }
    startsWithIgnoreCase(str) {
      if (str === "")
        return this.startsWith(str);
      return addIgnoreCaseAlgorithm(this, (x, a) => x.indexOf(a[0]) === 0, [str], maxString);
    }
    equalsIgnoreCase(str) {
      return addIgnoreCaseAlgorithm(this, (x, a) => x === a[0], [str], "");
    }
    anyOfIgnoreCase() {
      var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
      if (set.length === 0)
        return emptyCollection(this);
      return addIgnoreCaseAlgorithm(this, (x, a) => a.indexOf(x) !== -1, set, "");
    }
    startsWithAnyOfIgnoreCase() {
      var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
      if (set.length === 0)
        return emptyCollection(this);
      return addIgnoreCaseAlgorithm(this, (x, a) => a.some((n) => x.indexOf(n) === 0), set, maxString);
    }
    anyOf() {
      const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
      let compare = this._cmp;
      try {
        set.sort(compare);
      } catch (e) {
        return fail(this, INVALID_KEY_ARGUMENT);
      }
      if (set.length === 0)
        return emptyCollection(this);
      const c = new this.Collection(this, () => createRange(set[0], set[set.length - 1]));
      c._ondirectionchange = (direction) => {
        compare = direction === "next" ? this._ascending : this._descending;
        set.sort(compare);
      };
      let i = 0;
      c._addAlgorithm((cursor, advance, resolve) => {
        const key = cursor.key;
        while (compare(key, set[i]) > 0) {
          ++i;
          if (i === set.length) {
            advance(resolve);
            return false;
          }
        }
        if (compare(key, set[i]) === 0) {
          return true;
        } else {
          advance(() => {
            cursor.continue(set[i]);
          });
          return false;
        }
      });
      return c;
    }
    notEqual(value) {
      return this.inAnyRange([[minKey, value], [value, this.db._maxKey]], { includeLowers: false, includeUppers: false });
    }
    noneOf() {
      const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
      if (set.length === 0)
        return new this.Collection(this);
      try {
        set.sort(this._ascending);
      } catch (e) {
        return fail(this, INVALID_KEY_ARGUMENT);
      }
      const ranges = set.reduce((res, val) => res ? res.concat([[res[res.length - 1][1], val]]) : [[minKey, val]], null);
      ranges.push([set[set.length - 1], this.db._maxKey]);
      return this.inAnyRange(ranges, { includeLowers: false, includeUppers: false });
    }
    inAnyRange(ranges, options) {
      const cmp2 = this._cmp, ascending = this._ascending, descending = this._descending, min = this._min, max = this._max;
      if (ranges.length === 0)
        return emptyCollection(this);
      if (!ranges.every((range) => range[0] !== void 0 && range[1] !== void 0 && ascending(range[0], range[1]) <= 0)) {
        return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
      }
      const includeLowers = !options || options.includeLowers !== false;
      const includeUppers = options && options.includeUppers === true;
      function addRange2(ranges2, newRange) {
        let i = 0, l = ranges2.length;
        for (; i < l; ++i) {
          const range = ranges2[i];
          if (cmp2(newRange[0], range[1]) < 0 && cmp2(newRange[1], range[0]) > 0) {
            range[0] = min(range[0], newRange[0]);
            range[1] = max(range[1], newRange[1]);
            break;
          }
        }
        if (i === l)
          ranges2.push(newRange);
        return ranges2;
      }
      let sortDirection = ascending;
      function rangeSorter(a, b) {
        return sortDirection(a[0], b[0]);
      }
      let set;
      try {
        set = ranges.reduce(addRange2, []);
        set.sort(rangeSorter);
      } catch (ex) {
        return fail(this, INVALID_KEY_ARGUMENT);
      }
      let rangePos = 0;
      const keyIsBeyondCurrentEntry = includeUppers ? (key) => ascending(key, set[rangePos][1]) > 0 : (key) => ascending(key, set[rangePos][1]) >= 0;
      const keyIsBeforeCurrentEntry = includeLowers ? (key) => descending(key, set[rangePos][0]) > 0 : (key) => descending(key, set[rangePos][0]) >= 0;
      function keyWithinCurrentRange(key) {
        return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
      }
      let checkKey = keyIsBeyondCurrentEntry;
      const c = new this.Collection(this, () => createRange(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers));
      c._ondirectionchange = (direction) => {
        if (direction === "next") {
          checkKey = keyIsBeyondCurrentEntry;
          sortDirection = ascending;
        } else {
          checkKey = keyIsBeforeCurrentEntry;
          sortDirection = descending;
        }
        set.sort(rangeSorter);
      };
      c._addAlgorithm((cursor, advance, resolve) => {
        var key = cursor.key;
        while (checkKey(key)) {
          ++rangePos;
          if (rangePos === set.length) {
            advance(resolve);
            return false;
          }
        }
        if (keyWithinCurrentRange(key)) {
          return true;
        } else if (this._cmp(key, set[rangePos][1]) === 0 || this._cmp(key, set[rangePos][0]) === 0) {
          return false;
        } else {
          advance(() => {
            if (sortDirection === ascending)
              cursor.continue(set[rangePos][0]);
            else
              cursor.continue(set[rangePos][1]);
          });
          return false;
        }
      });
      return c;
    }
    startsWithAnyOf() {
      const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
      if (!set.every((s) => typeof s === "string")) {
        return fail(this, "startsWithAnyOf() only works with strings");
      }
      if (set.length === 0)
        return emptyCollection(this);
      return this.inAnyRange(set.map((str) => [str, str + maxString]));
    }
  };
  function createWhereClauseConstructor(db) {
    return makeClassConstructor(WhereClause.prototype, function WhereClause2(table, index, orCollection) {
      this.db = db;
      this._ctx = {
        table,
        index: index === ":id" ? null : index,
        or: orCollection
      };
      this._cmp = this._ascending = cmp;
      this._descending = (a, b) => cmp(b, a);
      this._max = (a, b) => cmp(a, b) > 0 ? a : b;
      this._min = (a, b) => cmp(a, b) < 0 ? a : b;
      this._IDBKeyRange = db._deps.IDBKeyRange;
      if (!this._IDBKeyRange)
        throw new exceptions.MissingAPI();
    });
  }
  function eventRejectHandler(reject) {
    return wrap(function(event) {
      preventDefault(event);
      reject(event.target.error);
      return false;
    });
  }
  function preventDefault(event) {
    if (event.stopPropagation)
      event.stopPropagation();
    if (event.preventDefault)
      event.preventDefault();
  }
  var DEXIE_STORAGE_MUTATED_EVENT_NAME = "storagemutated";
  var STORAGE_MUTATED_DOM_EVENT_NAME = "x-storagemutated-1";
  var globalEvents = Events(null, DEXIE_STORAGE_MUTATED_EVENT_NAME);
  var Transaction = class {
    _lock() {
      assert(!PSD.global);
      ++this._reculock;
      if (this._reculock === 1 && !PSD.global)
        PSD.lockOwnerFor = this;
      return this;
    }
    _unlock() {
      assert(!PSD.global);
      if (--this._reculock === 0) {
        if (!PSD.global)
          PSD.lockOwnerFor = null;
        while (this._blockedFuncs.length > 0 && !this._locked()) {
          var fnAndPSD = this._blockedFuncs.shift();
          try {
            usePSD(fnAndPSD[1], fnAndPSD[0]);
          } catch (e) {
          }
        }
      }
      return this;
    }
    _locked() {
      return this._reculock && PSD.lockOwnerFor !== this;
    }
    create(idbtrans) {
      if (!this.mode)
        return this;
      const idbdb = this.db.idbdb;
      const dbOpenError = this.db._state.dbOpenError;
      assert(!this.idbtrans);
      if (!idbtrans && !idbdb) {
        switch (dbOpenError && dbOpenError.name) {
          case "DatabaseClosedError":
            throw new exceptions.DatabaseClosed(dbOpenError);
          case "MissingAPIError":
            throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
          default:
            throw new exceptions.OpenFailed(dbOpenError);
        }
      }
      if (!this.active)
        throw new exceptions.TransactionInactive();
      assert(this._completion._state === null);
      idbtrans = this.idbtrans = idbtrans || (this.db.core ? this.db.core.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }) : idbdb.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }));
      idbtrans.onerror = wrap((ev) => {
        preventDefault(ev);
        this._reject(idbtrans.error);
      });
      idbtrans.onabort = wrap((ev) => {
        preventDefault(ev);
        this.active && this._reject(new exceptions.Abort(idbtrans.error));
        this.active = false;
        this.on("abort").fire(ev);
      });
      idbtrans.oncomplete = wrap(() => {
        this.active = false;
        this._resolve();
        if ("mutatedParts" in idbtrans) {
          globalEvents.storagemutated.fire(idbtrans["mutatedParts"]);
        }
      });
      return this;
    }
    _promise(mode, fn, bWriteLock) {
      if (mode === "readwrite" && this.mode !== "readwrite")
        return rejection(new exceptions.ReadOnly("Transaction is readonly"));
      if (!this.active)
        return rejection(new exceptions.TransactionInactive());
      if (this._locked()) {
        return new DexiePromise((resolve, reject) => {
          this._blockedFuncs.push([() => {
            this._promise(mode, fn, bWriteLock).then(resolve, reject);
          }, PSD]);
        });
      } else if (bWriteLock) {
        return newScope(() => {
          var p2 = new DexiePromise((resolve, reject) => {
            this._lock();
            const rv = fn(resolve, reject, this);
            if (rv && rv.then)
              rv.then(resolve, reject);
          });
          p2.finally(() => this._unlock());
          p2._lib = true;
          return p2;
        });
      } else {
        var p = new DexiePromise((resolve, reject) => {
          var rv = fn(resolve, reject, this);
          if (rv && rv.then)
            rv.then(resolve, reject);
        });
        p._lib = true;
        return p;
      }
    }
    _root() {
      return this.parent ? this.parent._root() : this;
    }
    waitFor(promiseLike) {
      var root = this._root();
      const promise = DexiePromise.resolve(promiseLike);
      if (root._waitingFor) {
        root._waitingFor = root._waitingFor.then(() => promise);
      } else {
        root._waitingFor = promise;
        root._waitingQueue = [];
        var store = root.idbtrans.objectStore(root.storeNames[0]);
        (function spin() {
          ++root._spinCount;
          while (root._waitingQueue.length)
            root._waitingQueue.shift()();
          if (root._waitingFor)
            store.get(-Infinity).onsuccess = spin;
        })();
      }
      var currentWaitPromise = root._waitingFor;
      return new DexiePromise((resolve, reject) => {
        promise.then((res) => root._waitingQueue.push(wrap(resolve.bind(null, res))), (err) => root._waitingQueue.push(wrap(reject.bind(null, err)))).finally(() => {
          if (root._waitingFor === currentWaitPromise) {
            root._waitingFor = null;
          }
        });
      });
    }
    abort() {
      if (this.active) {
        this.active = false;
        if (this.idbtrans)
          this.idbtrans.abort();
        this._reject(new exceptions.Abort());
      }
    }
    table(tableName) {
      const memoizedTables = this._memoizedTables || (this._memoizedTables = {});
      if (hasOwn(memoizedTables, tableName))
        return memoizedTables[tableName];
      const tableSchema = this.schema[tableName];
      if (!tableSchema) {
        throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
      }
      const transactionBoundTable = new this.db.Table(tableName, tableSchema, this);
      transactionBoundTable.core = this.db.core.table(tableName);
      memoizedTables[tableName] = transactionBoundTable;
      return transactionBoundTable;
    }
  };
  function createTransactionConstructor(db) {
    return makeClassConstructor(Transaction.prototype, function Transaction2(mode, storeNames, dbschema, chromeTransactionDurability, parent) {
      this.db = db;
      this.mode = mode;
      this.storeNames = storeNames;
      this.schema = dbschema;
      this.chromeTransactionDurability = chromeTransactionDurability;
      this.idbtrans = null;
      this.on = Events(this, "complete", "error", "abort");
      this.parent = parent || null;
      this.active = true;
      this._reculock = 0;
      this._blockedFuncs = [];
      this._resolve = null;
      this._reject = null;
      this._waitingFor = null;
      this._waitingQueue = null;
      this._spinCount = 0;
      this._completion = new DexiePromise((resolve, reject) => {
        this._resolve = resolve;
        this._reject = reject;
      });
      this._completion.then(() => {
        this.active = false;
        this.on.complete.fire();
      }, (e) => {
        var wasActive = this.active;
        this.active = false;
        this.on.error.fire(e);
        this.parent ? this.parent._reject(e) : wasActive && this.idbtrans && this.idbtrans.abort();
        return rejection(e);
      });
    });
  }
  function createIndexSpec(name, keyPath, unique, multi, auto, compound, isPrimKey) {
    return {
      name,
      keyPath,
      unique,
      multi,
      auto,
      compound,
      src: (unique && !isPrimKey ? "&" : "") + (multi ? "*" : "") + (auto ? "++" : "") + nameFromKeyPath(keyPath)
    };
  }
  function nameFromKeyPath(keyPath) {
    return typeof keyPath === "string" ? keyPath : keyPath ? "[" + [].join.call(keyPath, "+") + "]" : "";
  }
  function createTableSchema(name, primKey, indexes) {
    return {
      name,
      primKey,
      indexes,
      mappedClass: null,
      idxByName: arrayToObject(indexes, (index) => [index.name, index])
    };
  }
  function safariMultiStoreFix(storeNames) {
    return storeNames.length === 1 ? storeNames[0] : storeNames;
  }
  var getMaxKey = (IdbKeyRange) => {
    try {
      IdbKeyRange.only([[]]);
      getMaxKey = () => [[]];
      return [[]];
    } catch (e) {
      getMaxKey = () => maxString;
      return maxString;
    }
  };
  function getKeyExtractor(keyPath) {
    if (keyPath == null) {
      return () => void 0;
    } else if (typeof keyPath === "string") {
      return getSinglePathKeyExtractor(keyPath);
    } else {
      return (obj) => getByKeyPath(obj, keyPath);
    }
  }
  function getSinglePathKeyExtractor(keyPath) {
    const split = keyPath.split(".");
    if (split.length === 1) {
      return (obj) => obj[keyPath];
    } else {
      return (obj) => getByKeyPath(obj, keyPath);
    }
  }
  function arrayify(arrayLike) {
    return [].slice.call(arrayLike);
  }
  var _id_counter = 0;
  function getKeyPathAlias(keyPath) {
    return keyPath == null ? ":id" : typeof keyPath === "string" ? keyPath : `[${keyPath.join("+")}]`;
  }
  function createDBCore(db, IdbKeyRange, tmpTrans) {
    function extractSchema(db2, trans) {
      const tables2 = arrayify(db2.objectStoreNames);
      return {
        schema: {
          name: db2.name,
          tables: tables2.map((table) => trans.objectStore(table)).map((store) => {
            const { keyPath, autoIncrement } = store;
            const compound = isArray(keyPath);
            const outbound = keyPath == null;
            const indexByKeyPath = {};
            const result = {
              name: store.name,
              primaryKey: {
                name: null,
                isPrimaryKey: true,
                outbound,
                compound,
                keyPath,
                autoIncrement,
                unique: true,
                extractKey: getKeyExtractor(keyPath)
              },
              indexes: arrayify(store.indexNames).map((indexName) => store.index(indexName)).map((index) => {
                const { name, unique, multiEntry, keyPath: keyPath2 } = index;
                const compound2 = isArray(keyPath2);
                const result2 = {
                  name,
                  compound: compound2,
                  keyPath: keyPath2,
                  unique,
                  multiEntry,
                  extractKey: getKeyExtractor(keyPath2)
                };
                indexByKeyPath[getKeyPathAlias(keyPath2)] = result2;
                return result2;
              }),
              getIndexByKeyPath: (keyPath2) => indexByKeyPath[getKeyPathAlias(keyPath2)]
            };
            indexByKeyPath[":id"] = result.primaryKey;
            if (keyPath != null) {
              indexByKeyPath[getKeyPathAlias(keyPath)] = result.primaryKey;
            }
            return result;
          })
        },
        hasGetAll: tables2.length > 0 && "getAll" in trans.objectStore(tables2[0]) && !(typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604)
      };
    }
    function makeIDBKeyRange(range) {
      if (range.type === 3)
        return null;
      if (range.type === 4)
        throw new Error("Cannot convert never type to IDBKeyRange");
      const { lower, upper, lowerOpen, upperOpen } = range;
      const idbRange = lower === void 0 ? upper === void 0 ? null : IdbKeyRange.upperBound(upper, !!upperOpen) : upper === void 0 ? IdbKeyRange.lowerBound(lower, !!lowerOpen) : IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
      return idbRange;
    }
    function createDbCoreTable(tableSchema) {
      const tableName = tableSchema.name;
      function mutate({ trans, type: type2, keys: keys2, values, range }) {
        return new Promise((resolve, reject) => {
          resolve = wrap(resolve);
          const store = trans.objectStore(tableName);
          const outbound = store.keyPath == null;
          const isAddOrPut = type2 === "put" || type2 === "add";
          if (!isAddOrPut && type2 !== "delete" && type2 !== "deleteRange")
            throw new Error("Invalid operation type: " + type2);
          const { length } = keys2 || values || { length: 1 };
          if (keys2 && values && keys2.length !== values.length) {
            throw new Error("Given keys array must have same length as given values array.");
          }
          if (length === 0)
            return resolve({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
          let req;
          const reqs = [];
          const failures = [];
          let numFailures = 0;
          const errorHandler = (event) => {
            ++numFailures;
            preventDefault(event);
          };
          if (type2 === "deleteRange") {
            if (range.type === 4)
              return resolve({ numFailures, failures, results: [], lastResult: void 0 });
            if (range.type === 3)
              reqs.push(req = store.clear());
            else
              reqs.push(req = store.delete(makeIDBKeyRange(range)));
          } else {
            const [args1, args2] = isAddOrPut ? outbound ? [values, keys2] : [values, null] : [keys2, null];
            if (isAddOrPut) {
              for (let i = 0; i < length; ++i) {
                reqs.push(req = args2 && args2[i] !== void 0 ? store[type2](args1[i], args2[i]) : store[type2](args1[i]));
                req.onerror = errorHandler;
              }
            } else {
              for (let i = 0; i < length; ++i) {
                reqs.push(req = store[type2](args1[i]));
                req.onerror = errorHandler;
              }
            }
          }
          const done = (event) => {
            const lastResult = event.target.result;
            reqs.forEach((req2, i) => req2.error != null && (failures[i] = req2.error));
            resolve({
              numFailures,
              failures,
              results: type2 === "delete" ? keys2 : reqs.map((req2) => req2.result),
              lastResult
            });
          };
          req.onerror = (event) => {
            errorHandler(event);
            done(event);
          };
          req.onsuccess = done;
        });
      }
      function openCursor2({ trans, values, query: query2, reverse, unique }) {
        return new Promise((resolve, reject) => {
          resolve = wrap(resolve);
          const { index, range } = query2;
          const store = trans.objectStore(tableName);
          const source = index.isPrimaryKey ? store : store.index(index.name);
          const direction = reverse ? unique ? "prevunique" : "prev" : unique ? "nextunique" : "next";
          const req = values || !("openKeyCursor" in source) ? source.openCursor(makeIDBKeyRange(range), direction) : source.openKeyCursor(makeIDBKeyRange(range), direction);
          req.onerror = eventRejectHandler(reject);
          req.onsuccess = wrap((ev) => {
            const cursor = req.result;
            if (!cursor) {
              resolve(null);
              return;
            }
            cursor.___id = ++_id_counter;
            cursor.done = false;
            const _cursorContinue = cursor.continue.bind(cursor);
            let _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
            if (_cursorContinuePrimaryKey)
              _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
            const _cursorAdvance = cursor.advance.bind(cursor);
            const doThrowCursorIsNotStarted = () => {
              throw new Error("Cursor not started");
            };
            const doThrowCursorIsStopped = () => {
              throw new Error("Cursor not stopped");
            };
            cursor.trans = trans;
            cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsNotStarted;
            cursor.fail = wrap(reject);
            cursor.next = function() {
              let gotOne = 1;
              return this.start(() => gotOne-- ? this.continue() : this.stop()).then(() => this);
            };
            cursor.start = (callback) => {
              const iterationPromise = new Promise((resolveIteration, rejectIteration) => {
                resolveIteration = wrap(resolveIteration);
                req.onerror = eventRejectHandler(rejectIteration);
                cursor.fail = rejectIteration;
                cursor.stop = (value) => {
                  cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsStopped;
                  resolveIteration(value);
                };
              });
              const guardedCallback = () => {
                if (req.result) {
                  try {
                    callback();
                  } catch (err) {
                    cursor.fail(err);
                  }
                } else {
                  cursor.done = true;
                  cursor.start = () => {
                    throw new Error("Cursor behind last entry");
                  };
                  cursor.stop();
                }
              };
              req.onsuccess = wrap((ev2) => {
                req.onsuccess = guardedCallback;
                guardedCallback();
              });
              cursor.continue = _cursorContinue;
              cursor.continuePrimaryKey = _cursorContinuePrimaryKey;
              cursor.advance = _cursorAdvance;
              guardedCallback();
              return iterationPromise;
            };
            resolve(cursor);
          }, reject);
        });
      }
      function query(hasGetAll2) {
        return (request) => {
          return new Promise((resolve, reject) => {
            resolve = wrap(resolve);
            const { trans, values, limit, query: query2 } = request;
            const nonInfinitLimit = limit === Infinity ? void 0 : limit;
            const { index, range } = query2;
            const store = trans.objectStore(tableName);
            const source = index.isPrimaryKey ? store : store.index(index.name);
            const idbKeyRange = makeIDBKeyRange(range);
            if (limit === 0)
              return resolve({ result: [] });
            if (hasGetAll2) {
              const req = values ? source.getAll(idbKeyRange, nonInfinitLimit) : source.getAllKeys(idbKeyRange, nonInfinitLimit);
              req.onsuccess = (event) => resolve({ result: event.target.result });
              req.onerror = eventRejectHandler(reject);
            } else {
              let count = 0;
              const req = values || !("openKeyCursor" in source) ? source.openCursor(idbKeyRange) : source.openKeyCursor(idbKeyRange);
              const result = [];
              req.onsuccess = (event) => {
                const cursor = req.result;
                if (!cursor)
                  return resolve({ result });
                result.push(values ? cursor.value : cursor.primaryKey);
                if (++count === limit)
                  return resolve({ result });
                cursor.continue();
              };
              req.onerror = eventRejectHandler(reject);
            }
          });
        };
      }
      return {
        name: tableName,
        schema: tableSchema,
        mutate,
        getMany({ trans, keys: keys2 }) {
          return new Promise((resolve, reject) => {
            resolve = wrap(resolve);
            const store = trans.objectStore(tableName);
            const length = keys2.length;
            const result = new Array(length);
            let keyCount = 0;
            let callbackCount = 0;
            let req;
            const successHandler = (event) => {
              const req2 = event.target;
              if ((result[req2._pos] = req2.result) != null)
                ;
              if (++callbackCount === keyCount)
                resolve(result);
            };
            const errorHandler = eventRejectHandler(reject);
            for (let i = 0; i < length; ++i) {
              const key = keys2[i];
              if (key != null) {
                req = store.get(keys2[i]);
                req._pos = i;
                req.onsuccess = successHandler;
                req.onerror = errorHandler;
                ++keyCount;
              }
            }
            if (keyCount === 0)
              resolve(result);
          });
        },
        get({ trans, key }) {
          return new Promise((resolve, reject) => {
            resolve = wrap(resolve);
            const store = trans.objectStore(tableName);
            const req = store.get(key);
            req.onsuccess = (event) => resolve(event.target.result);
            req.onerror = eventRejectHandler(reject);
          });
        },
        query: query(hasGetAll),
        openCursor: openCursor2,
        count({ query: query2, trans }) {
          const { index, range } = query2;
          return new Promise((resolve, reject) => {
            const store = trans.objectStore(tableName);
            const source = index.isPrimaryKey ? store : store.index(index.name);
            const idbKeyRange = makeIDBKeyRange(range);
            const req = idbKeyRange ? source.count(idbKeyRange) : source.count();
            req.onsuccess = wrap((ev) => resolve(ev.target.result));
            req.onerror = eventRejectHandler(reject);
          });
        }
      };
    }
    const { schema, hasGetAll } = extractSchema(db, tmpTrans);
    const tables = schema.tables.map((tableSchema) => createDbCoreTable(tableSchema));
    const tableMap = {};
    tables.forEach((table) => tableMap[table.name] = table);
    return {
      stack: "dbcore",
      transaction: db.transaction.bind(db),
      table(name) {
        const result = tableMap[name];
        if (!result)
          throw new Error(`Table '${name}' not found`);
        return tableMap[name];
      },
      MIN_KEY: -Infinity,
      MAX_KEY: getMaxKey(IdbKeyRange),
      schema
    };
  }
  function createMiddlewareStack(stackImpl, middlewares) {
    return middlewares.reduce((down, { create }) => ({ ...down, ...create(down) }), stackImpl);
  }
  function createMiddlewareStacks(middlewares, idbdb, { IDBKeyRange, indexedDB: indexedDB2 }, tmpTrans) {
    const dbcore = createMiddlewareStack(createDBCore(idbdb, IDBKeyRange, tmpTrans), middlewares.dbcore);
    return {
      dbcore
    };
  }
  function generateMiddlewareStacks(db, tmpTrans) {
    const idbdb = tmpTrans.db;
    const stacks = createMiddlewareStacks(db._middlewares, idbdb, db._deps, tmpTrans);
    db.core = stacks.dbcore;
    db.tables.forEach((table) => {
      const tableName = table.name;
      if (db.core.schema.tables.some((tbl) => tbl.name === tableName)) {
        table.core = db.core.table(tableName);
        if (db[tableName] instanceof db.Table) {
          db[tableName].core = table.core;
        }
      }
    });
  }
  function setApiOnPlace(db, objs, tableNames, dbschema) {
    tableNames.forEach((tableName) => {
      const schema = dbschema[tableName];
      objs.forEach((obj) => {
        const propDesc = getPropertyDescriptor(obj, tableName);
        if (!propDesc || "value" in propDesc && propDesc.value === void 0) {
          if (obj === db.Transaction.prototype || obj instanceof db.Transaction) {
            setProp(obj, tableName, {
              get() {
                return this.table(tableName);
              },
              set(value) {
                defineProperty(this, tableName, { value, writable: true, configurable: true, enumerable: true });
              }
            });
          } else {
            obj[tableName] = new db.Table(tableName, schema);
          }
        }
      });
    });
  }
  function removeTablesApi(db, objs) {
    objs.forEach((obj) => {
      for (let key in obj) {
        if (obj[key] instanceof db.Table)
          delete obj[key];
      }
    });
  }
  function lowerVersionFirst(a, b) {
    return a._cfg.version - b._cfg.version;
  }
  function runUpgraders(db, oldVersion, idbUpgradeTrans, reject) {
    const globalSchema = db._dbSchema;
    if (idbUpgradeTrans.objectStoreNames.contains("$meta") && !globalSchema.$meta) {
      globalSchema.$meta = createTableSchema("$meta", parseIndexSyntax("")[0], []);
      db._storeNames.push("$meta");
    }
    const trans = db._createTransaction("readwrite", db._storeNames, globalSchema);
    trans.create(idbUpgradeTrans);
    trans._completion.catch(reject);
    const rejectTransaction = trans._reject.bind(trans);
    const transless = PSD.transless || PSD;
    newScope(() => {
      PSD.trans = trans;
      PSD.transless = transless;
      if (oldVersion === 0) {
        keys(globalSchema).forEach((tableName) => {
          createTable(idbUpgradeTrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
        });
        generateMiddlewareStacks(db, idbUpgradeTrans);
        DexiePromise.follow(() => db.on.populate.fire(trans)).catch(rejectTransaction);
      } else {
        generateMiddlewareStacks(db, idbUpgradeTrans);
        return getExistingVersion(db, trans, oldVersion).then((oldVersion2) => updateTablesAndIndexes(db, oldVersion2, trans, idbUpgradeTrans)).catch(rejectTransaction);
      }
    });
  }
  function patchCurrentVersion(db, idbUpgradeTrans) {
    createMissingTables(db._dbSchema, idbUpgradeTrans);
    if (idbUpgradeTrans.db.version % 10 === 0 && !idbUpgradeTrans.objectStoreNames.contains("$meta")) {
      idbUpgradeTrans.db.createObjectStore("$meta").add(Math.ceil(idbUpgradeTrans.db.version / 10 - 1), "version");
    }
    const globalSchema = buildGlobalSchema(db, db.idbdb, idbUpgradeTrans);
    adjustToExistingIndexNames(db, db._dbSchema, idbUpgradeTrans);
    const diff = getSchemaDiff(globalSchema, db._dbSchema);
    for (const tableChange of diff.change) {
      if (tableChange.change.length || tableChange.recreate) {
        console.warn(`Unable to patch indexes of table ${tableChange.name} because it has changes on the type of index or primary key.`);
        return;
      }
      const store = idbUpgradeTrans.objectStore(tableChange.name);
      tableChange.add.forEach((idx) => {
        if (debug)
          console.debug(`Dexie upgrade patch: Creating missing index ${tableChange.name}.${idx.src}`);
        addIndex(store, idx);
      });
    }
  }
  function getExistingVersion(db, trans, oldVersion) {
    if (trans.storeNames.includes("$meta")) {
      return trans.table("$meta").get("version").then((metaVersion) => {
        return metaVersion != null ? metaVersion : oldVersion;
      });
    } else {
      return DexiePromise.resolve(oldVersion);
    }
  }
  function updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans) {
    const queue = [];
    const versions = db._versions;
    let globalSchema = db._dbSchema = buildGlobalSchema(db, db.idbdb, idbUpgradeTrans);
    const versToRun = versions.filter((v) => v._cfg.version >= oldVersion);
    if (versToRun.length === 0) {
      return DexiePromise.resolve();
    }
    versToRun.forEach((version) => {
      queue.push(() => {
        const oldSchema = globalSchema;
        const newSchema = version._cfg.dbschema;
        adjustToExistingIndexNames(db, oldSchema, idbUpgradeTrans);
        adjustToExistingIndexNames(db, newSchema, idbUpgradeTrans);
        globalSchema = db._dbSchema = newSchema;
        const diff = getSchemaDiff(oldSchema, newSchema);
        diff.add.forEach((tuple) => {
          createTable(idbUpgradeTrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
        });
        diff.change.forEach((change) => {
          if (change.recreate) {
            throw new exceptions.Upgrade("Not yet support for changing primary key");
          } else {
            const store = idbUpgradeTrans.objectStore(change.name);
            change.add.forEach((idx) => addIndex(store, idx));
            change.change.forEach((idx) => {
              store.deleteIndex(idx.name);
              addIndex(store, idx);
            });
            change.del.forEach((idxName) => store.deleteIndex(idxName));
          }
        });
        const contentUpgrade = version._cfg.contentUpgrade;
        if (contentUpgrade && version._cfg.version > oldVersion) {
          generateMiddlewareStacks(db, idbUpgradeTrans);
          trans._memoizedTables = {};
          let upgradeSchema = shallowClone(newSchema);
          diff.del.forEach((table) => {
            upgradeSchema[table] = oldSchema[table];
          });
          removeTablesApi(db, [db.Transaction.prototype]);
          setApiOnPlace(db, [db.Transaction.prototype], keys(upgradeSchema), upgradeSchema);
          trans.schema = upgradeSchema;
          const contentUpgradeIsAsync = isAsyncFunction(contentUpgrade);
          if (contentUpgradeIsAsync) {
            incrementExpectedAwaits();
          }
          let returnValue;
          const promiseFollowed = DexiePromise.follow(() => {
            returnValue = contentUpgrade(trans);
            if (returnValue) {
              if (contentUpgradeIsAsync) {
                var decrementor = decrementExpectedAwaits.bind(null, null);
                returnValue.then(decrementor, decrementor);
              }
            }
          });
          return returnValue && typeof returnValue.then === "function" ? DexiePromise.resolve(returnValue) : promiseFollowed.then(() => returnValue);
        }
      });
      queue.push((idbtrans) => {
        const newSchema = version._cfg.dbschema;
        deleteRemovedTables(newSchema, idbtrans);
        removeTablesApi(db, [db.Transaction.prototype]);
        setApiOnPlace(db, [db.Transaction.prototype], db._storeNames, db._dbSchema);
        trans.schema = db._dbSchema;
      });
      queue.push((idbtrans) => {
        if (db.idbdb.objectStoreNames.contains("$meta")) {
          if (Math.ceil(db.idbdb.version / 10) === version._cfg.version) {
            db.idbdb.deleteObjectStore("$meta");
            delete db._dbSchema.$meta;
            db._storeNames = db._storeNames.filter((name) => name !== "$meta");
          } else {
            idbtrans.objectStore("$meta").put(version._cfg.version, "version");
          }
        }
      });
    });
    function runQueue() {
      return queue.length ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) : DexiePromise.resolve();
    }
    return runQueue().then(() => {
      createMissingTables(globalSchema, idbUpgradeTrans);
    });
  }
  function getSchemaDiff(oldSchema, newSchema) {
    const diff = {
      del: [],
      add: [],
      change: []
    };
    let table;
    for (table in oldSchema) {
      if (!newSchema[table])
        diff.del.push(table);
    }
    for (table in newSchema) {
      const oldDef = oldSchema[table], newDef = newSchema[table];
      if (!oldDef) {
        diff.add.push([table, newDef]);
      } else {
        const change = {
          name: table,
          def: newDef,
          recreate: false,
          del: [],
          add: [],
          change: []
        };
        if ("" + (oldDef.primKey.keyPath || "") !== "" + (newDef.primKey.keyPath || "") || oldDef.primKey.auto !== newDef.primKey.auto) {
          change.recreate = true;
          diff.change.push(change);
        } else {
          const oldIndexes = oldDef.idxByName;
          const newIndexes = newDef.idxByName;
          let idxName;
          for (idxName in oldIndexes) {
            if (!newIndexes[idxName])
              change.del.push(idxName);
          }
          for (idxName in newIndexes) {
            const oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
            if (!oldIdx)
              change.add.push(newIdx);
            else if (oldIdx.src !== newIdx.src)
              change.change.push(newIdx);
          }
          if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
            diff.change.push(change);
          }
        }
      }
    }
    return diff;
  }
  function createTable(idbtrans, tableName, primKey, indexes) {
    const store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ? { keyPath: primKey.keyPath, autoIncrement: primKey.auto } : { autoIncrement: primKey.auto });
    indexes.forEach((idx) => addIndex(store, idx));
    return store;
  }
  function createMissingTables(newSchema, idbtrans) {
    keys(newSchema).forEach((tableName) => {
      if (!idbtrans.db.objectStoreNames.contains(tableName)) {
        if (debug)
          console.debug("Dexie: Creating missing table", tableName);
        createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
      }
    });
  }
  function deleteRemovedTables(newSchema, idbtrans) {
    [].slice.call(idbtrans.db.objectStoreNames).forEach((storeName) => newSchema[storeName] == null && idbtrans.db.deleteObjectStore(storeName));
  }
  function addIndex(store, idx) {
    store.createIndex(idx.name, idx.keyPath, { unique: idx.unique, multiEntry: idx.multi });
  }
  function buildGlobalSchema(db, idbdb, tmpTrans) {
    const globalSchema = {};
    const dbStoreNames = slice(idbdb.objectStoreNames, 0);
    dbStoreNames.forEach((storeName) => {
      const store = tmpTrans.objectStore(storeName);
      let keyPath = store.keyPath;
      const primKey = createIndexSpec(nameFromKeyPath(keyPath), keyPath || "", true, false, !!store.autoIncrement, keyPath && typeof keyPath !== "string", true);
      const indexes = [];
      for (let j = 0; j < store.indexNames.length; ++j) {
        const idbindex = store.index(store.indexNames[j]);
        keyPath = idbindex.keyPath;
        var index = createIndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== "string", false);
        indexes.push(index);
      }
      globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
    });
    return globalSchema;
  }
  function readGlobalSchema(db, idbdb, tmpTrans) {
    db.verno = idbdb.version / 10;
    const globalSchema = db._dbSchema = buildGlobalSchema(db, idbdb, tmpTrans);
    db._storeNames = slice(idbdb.objectStoreNames, 0);
    setApiOnPlace(db, [db._allTables], keys(globalSchema), globalSchema);
  }
  function verifyInstalledSchema(db, tmpTrans) {
    const installedSchema = buildGlobalSchema(db, db.idbdb, tmpTrans);
    const diff = getSchemaDiff(installedSchema, db._dbSchema);
    return !(diff.add.length || diff.change.some((ch) => ch.add.length || ch.change.length));
  }
  function adjustToExistingIndexNames(db, schema, idbtrans) {
    const storeNames = idbtrans.db.objectStoreNames;
    for (let i = 0; i < storeNames.length; ++i) {
      const storeName = storeNames[i];
      const store = idbtrans.objectStore(storeName);
      db._hasGetAll = "getAll" in store;
      for (let j = 0; j < store.indexNames.length; ++j) {
        const indexName = store.indexNames[j];
        const keyPath = store.index(indexName).keyPath;
        const dexieName = typeof keyPath === "string" ? keyPath : "[" + slice(keyPath).join("+") + "]";
        if (schema[storeName]) {
          const indexSpec = schema[storeName].idxByName[dexieName];
          if (indexSpec) {
            indexSpec.name = indexName;
            delete schema[storeName].idxByName[dexieName];
            schema[storeName].idxByName[indexName] = indexSpec;
          }
        }
      }
    }
    if (typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
      db._hasGetAll = false;
    }
  }
  function parseIndexSyntax(primKeyAndIndexes) {
    return primKeyAndIndexes.split(",").map((index, indexNum) => {
      index = index.trim();
      const name = index.replace(/([&*]|\+\+)/g, "");
      const keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split("+") : name;
      return createIndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray(keyPath), indexNum === 0);
    });
  }
  var Version = class {
    _parseStoresSpec(stores, outSchema) {
      keys(stores).forEach((tableName) => {
        if (stores[tableName] !== null) {
          var indexes = parseIndexSyntax(stores[tableName]);
          var primKey = indexes.shift();
          primKey.unique = true;
          if (primKey.multi)
            throw new exceptions.Schema("Primary key cannot be multi-valued");
          indexes.forEach((idx) => {
            if (idx.auto)
              throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
            if (!idx.keyPath)
              throw new exceptions.Schema("Index must have a name and cannot be an empty string");
          });
          outSchema[tableName] = createTableSchema(tableName, primKey, indexes);
        }
      });
    }
    stores(stores) {
      const db = this.db;
      this._cfg.storesSource = this._cfg.storesSource ? extend(this._cfg.storesSource, stores) : stores;
      const versions = db._versions;
      const storesSpec = {};
      let dbschema = {};
      versions.forEach((version) => {
        extend(storesSpec, version._cfg.storesSource);
        dbschema = version._cfg.dbschema = {};
        version._parseStoresSpec(storesSpec, dbschema);
      });
      db._dbSchema = dbschema;
      removeTablesApi(db, [db._allTables, db, db.Transaction.prototype]);
      setApiOnPlace(db, [db._allTables, db, db.Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
      db._storeNames = keys(dbschema);
      return this;
    }
    upgrade(upgradeFunction) {
      this._cfg.contentUpgrade = promisableChain(this._cfg.contentUpgrade || nop, upgradeFunction);
      return this;
    }
  };
  function createVersionConstructor(db) {
    return makeClassConstructor(Version.prototype, function Version2(versionNumber) {
      this.db = db;
      this._cfg = {
        version: versionNumber,
        storesSource: null,
        dbschema: {},
        tables: {},
        contentUpgrade: null
      };
    });
  }
  function getDbNamesTable(indexedDB2, IDBKeyRange) {
    let dbNamesDB = indexedDB2["_dbNamesDB"];
    if (!dbNamesDB) {
      dbNamesDB = indexedDB2["_dbNamesDB"] = new Dexie$1(DBNAMES_DB, {
        addons: [],
        indexedDB: indexedDB2,
        IDBKeyRange
      });
      dbNamesDB.version(1).stores({ dbnames: "name" });
    }
    return dbNamesDB.table("dbnames");
  }
  function hasDatabasesNative(indexedDB2) {
    return indexedDB2 && typeof indexedDB2.databases === "function";
  }
  function getDatabaseNames({ indexedDB: indexedDB2, IDBKeyRange }) {
    return hasDatabasesNative(indexedDB2) ? Promise.resolve(indexedDB2.databases()).then((infos) => infos.map((info) => info.name).filter((name) => name !== DBNAMES_DB)) : getDbNamesTable(indexedDB2, IDBKeyRange).toCollection().primaryKeys();
  }
  function _onDatabaseCreated({ indexedDB: indexedDB2, IDBKeyRange }, name) {
    !hasDatabasesNative(indexedDB2) && name !== DBNAMES_DB && getDbNamesTable(indexedDB2, IDBKeyRange).put({ name }).catch(nop);
  }
  function _onDatabaseDeleted({ indexedDB: indexedDB2, IDBKeyRange }, name) {
    !hasDatabasesNative(indexedDB2) && name !== DBNAMES_DB && getDbNamesTable(indexedDB2, IDBKeyRange).delete(name).catch(nop);
  }
  function vip(fn) {
    return newScope(function() {
      PSD.letThrough = true;
      return fn();
    });
  }
  function idbReady() {
    var isSafari = !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent);
    if (!isSafari || !indexedDB.databases)
      return Promise.resolve();
    var intervalId;
    return new Promise(function(resolve) {
      var tryIdb = function() {
        return indexedDB.databases().finally(resolve);
      };
      intervalId = setInterval(tryIdb, 100);
      tryIdb();
    }).finally(function() {
      return clearInterval(intervalId);
    });
  }
  function isEmptyRange(node) {
    return !("from" in node);
  }
  var RangeSet = function(fromOrTree, to2) {
    if (this) {
      extend(this, arguments.length ? { d: 1, from: fromOrTree, to: arguments.length > 1 ? to2 : fromOrTree } : { d: 0 });
    } else {
      const rv = new RangeSet();
      if (fromOrTree && "d" in fromOrTree) {
        extend(rv, fromOrTree);
      }
      return rv;
    }
  };
  props(RangeSet.prototype, {
    add(rangeSet) {
      mergeRanges(this, rangeSet);
      return this;
    },
    addKey(key) {
      addRange(this, key, key);
      return this;
    },
    addKeys(keys2) {
      keys2.forEach((key) => addRange(this, key, key));
      return this;
    },
    hasKey(key) {
      const node = getRangeSetIterator(this).next(key).value;
      return node && cmp(node.from, key) <= 0 && cmp(node.to, key) >= 0;
    },
    [iteratorSymbol]() {
      return getRangeSetIterator(this);
    }
  });
  function addRange(target, from, to2) {
    const diff = cmp(from, to2);
    if (isNaN(diff))
      return;
    if (diff > 0)
      throw RangeError();
    if (isEmptyRange(target))
      return extend(target, { from, to: to2, d: 1 });
    const left = target.l;
    const right = target.r;
    if (cmp(to2, target.from) < 0) {
      left ? addRange(left, from, to2) : target.l = { from, to: to2, d: 1, l: null, r: null };
      return rebalance(target);
    }
    if (cmp(from, target.to) > 0) {
      right ? addRange(right, from, to2) : target.r = { from, to: to2, d: 1, l: null, r: null };
      return rebalance(target);
    }
    if (cmp(from, target.from) < 0) {
      target.from = from;
      target.l = null;
      target.d = right ? right.d + 1 : 1;
    }
    if (cmp(to2, target.to) > 0) {
      target.to = to2;
      target.r = null;
      target.d = target.l ? target.l.d + 1 : 1;
    }
    const rightWasCutOff = !target.r;
    if (left && !target.l) {
      mergeRanges(target, left);
    }
    if (right && rightWasCutOff) {
      mergeRanges(target, right);
    }
  }
  function mergeRanges(target, newSet) {
    function _addRangeSet(target2, { from, to: to2, l, r }) {
      addRange(target2, from, to2);
      if (l)
        _addRangeSet(target2, l);
      if (r)
        _addRangeSet(target2, r);
    }
    if (!isEmptyRange(newSet))
      _addRangeSet(target, newSet);
  }
  function rangesOverlap(rangeSet1, rangeSet2) {
    const i1 = getRangeSetIterator(rangeSet2);
    let nextResult1 = i1.next();
    if (nextResult1.done)
      return false;
    let a = nextResult1.value;
    const i2 = getRangeSetIterator(rangeSet1);
    let nextResult2 = i2.next(a.from);
    let b = nextResult2.value;
    while (!nextResult1.done && !nextResult2.done) {
      if (cmp(b.from, a.to) <= 0 && cmp(b.to, a.from) >= 0)
        return true;
      cmp(a.from, b.from) < 0 ? a = (nextResult1 = i1.next(b.from)).value : b = (nextResult2 = i2.next(a.from)).value;
    }
    return false;
  }
  function getRangeSetIterator(node) {
    let state = isEmptyRange(node) ? null : { s: 0, n: node };
    return {
      next(key) {
        const keyProvided = arguments.length > 0;
        while (state) {
          switch (state.s) {
            case 0:
              state.s = 1;
              if (keyProvided) {
                while (state.n.l && cmp(key, state.n.from) < 0)
                  state = { up: state, n: state.n.l, s: 1 };
              } else {
                while (state.n.l)
                  state = { up: state, n: state.n.l, s: 1 };
              }
            case 1:
              state.s = 2;
              if (!keyProvided || cmp(key, state.n.to) <= 0)
                return { value: state.n, done: false };
            case 2:
              if (state.n.r) {
                state.s = 3;
                state = { up: state, n: state.n.r, s: 0 };
                continue;
              }
            case 3:
              state = state.up;
          }
        }
        return { done: true };
      }
    };
  }
  function rebalance(target) {
    const diff = (target.r?.d || 0) - (target.l?.d || 0);
    const r = diff > 1 ? "r" : diff < -1 ? "l" : "";
    if (r) {
      const l = r === "r" ? "l" : "r";
      const rootClone = { ...target };
      const oldRootRight = target[r];
      target.from = oldRootRight.from;
      target.to = oldRootRight.to;
      target[r] = oldRootRight[r];
      rootClone[r] = oldRootRight[l];
      target[l] = rootClone;
      rootClone.d = computeDepth(rootClone);
    }
    target.d = computeDepth(target);
  }
  function computeDepth({ r, l }) {
    return (r ? l ? Math.max(r.d, l.d) : r.d : l ? l.d : 0) + 1;
  }
  function extendObservabilitySet(target, newSet) {
    keys(newSet).forEach((part) => {
      if (target[part])
        mergeRanges(target[part], newSet[part]);
      else
        target[part] = cloneSimpleObjectTree(newSet[part]);
    });
    return target;
  }
  function obsSetsOverlap(os1, os2) {
    return os1.all || os2.all || Object.keys(os1).some((key) => os2[key] && rangesOverlap(os2[key], os1[key]));
  }
  var cache = {};
  var unsignaledParts = {};
  var isTaskEnqueued = false;
  function signalSubscribersLazily(part, optimistic = false) {
    extendObservabilitySet(unsignaledParts, part);
    if (!isTaskEnqueued) {
      isTaskEnqueued = true;
      setTimeout(() => {
        isTaskEnqueued = false;
        const parts = unsignaledParts;
        unsignaledParts = {};
        signalSubscribersNow(parts, false);
      }, 0);
    }
  }
  function signalSubscribersNow(updatedParts, deleteAffectedCacheEntries = false) {
    const queriesToSignal = /* @__PURE__ */ new Set();
    if (updatedParts.all) {
      for (const tblCache of Object.values(cache)) {
        collectTableSubscribers(tblCache, updatedParts, queriesToSignal, deleteAffectedCacheEntries);
      }
    } else {
      for (const key in updatedParts) {
        const parts = /^idb\:\/\/(.*)\/(.*)\//.exec(key);
        if (parts) {
          const [, dbName, tableName] = parts;
          const tblCache = cache[`idb://${dbName}/${tableName}`];
          if (tblCache)
            collectTableSubscribers(tblCache, updatedParts, queriesToSignal, deleteAffectedCacheEntries);
        }
      }
    }
    queriesToSignal.forEach((requery) => requery());
  }
  function collectTableSubscribers(tblCache, updatedParts, outQueriesToSignal, deleteAffectedCacheEntries) {
    const updatedEntryLists = [];
    for (const [indexName, entries] of Object.entries(tblCache.queries.query)) {
      const filteredEntries = [];
      for (const entry of entries) {
        if (obsSetsOverlap(updatedParts, entry.obsSet)) {
          entry.subscribers.forEach((requery) => outQueriesToSignal.add(requery));
        } else if (deleteAffectedCacheEntries) {
          filteredEntries.push(entry);
        }
      }
      if (deleteAffectedCacheEntries)
        updatedEntryLists.push([indexName, filteredEntries]);
    }
    if (deleteAffectedCacheEntries) {
      for (const [indexName, filteredEntries] of updatedEntryLists) {
        tblCache.queries.query[indexName] = filteredEntries;
      }
    }
  }
  function dexieOpen(db) {
    const state = db._state;
    const { indexedDB: indexedDB2 } = db._deps;
    if (state.isBeingOpened || db.idbdb)
      return state.dbReadyPromise.then(() => state.dbOpenError ? rejection(state.dbOpenError) : db);
    state.isBeingOpened = true;
    state.dbOpenError = null;
    state.openComplete = false;
    const openCanceller = state.openCanceller;
    let nativeVerToOpen = Math.round(db.verno * 10);
    let schemaPatchMode = false;
    function throwIfCancelled() {
      if (state.openCanceller !== openCanceller)
        throw new exceptions.DatabaseClosed("db.open() was cancelled");
    }
    let resolveDbReady = state.dbReadyResolve, upgradeTransaction = null, wasCreated = false;
    const tryOpenDB = () => new DexiePromise((resolve, reject) => {
      throwIfCancelled();
      if (!indexedDB2)
        throw new exceptions.MissingAPI();
      const dbName = db.name;
      const req = state.autoSchema || !nativeVerToOpen ? indexedDB2.open(dbName) : indexedDB2.open(dbName, nativeVerToOpen);
      if (!req)
        throw new exceptions.MissingAPI();
      req.onerror = eventRejectHandler(reject);
      req.onblocked = wrap(db._fireOnBlocked);
      req.onupgradeneeded = wrap((e) => {
        upgradeTransaction = req.transaction;
        if (state.autoSchema && !db._options.allowEmptyDB) {
          req.onerror = preventDefault;
          upgradeTransaction.abort();
          req.result.close();
          const delreq = indexedDB2.deleteDatabase(dbName);
          delreq.onsuccess = delreq.onerror = wrap(() => {
            reject(new exceptions.NoSuchDatabase(`Database ${dbName} doesnt exist`));
          });
        } else {
          upgradeTransaction.onerror = eventRejectHandler(reject);
          const oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
          wasCreated = oldVer < 1;
          db.idbdb = req.result;
          if (schemaPatchMode) {
            patchCurrentVersion(db, upgradeTransaction);
          }
          runUpgraders(db, oldVer / 10, upgradeTransaction, reject);
        }
      }, reject);
      req.onsuccess = wrap(() => {
        upgradeTransaction = null;
        const idbdb = db.idbdb = req.result;
        const objectStoreNames = slice(idbdb.objectStoreNames);
        if (objectStoreNames.length > 0)
          try {
            const tmpTrans = idbdb.transaction(safariMultiStoreFix(objectStoreNames), "readonly");
            if (state.autoSchema)
              readGlobalSchema(db, idbdb, tmpTrans);
            else {
              adjustToExistingIndexNames(db, db._dbSchema, tmpTrans);
              if (!verifyInstalledSchema(db, tmpTrans) && !schemaPatchMode) {
                console.warn(`Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this.`);
                idbdb.close();
                nativeVerToOpen = idbdb.version + 1;
                schemaPatchMode = true;
                return resolve(tryOpenDB());
              }
            }
            generateMiddlewareStacks(db, tmpTrans);
          } catch (e) {
          }
        connections.push(db);
        idbdb.onversionchange = wrap((ev) => {
          state.vcFired = true;
          db.on("versionchange").fire(ev);
        });
        idbdb.onclose = wrap((ev) => {
          db.on("close").fire(ev);
        });
        if (wasCreated)
          _onDatabaseCreated(db._deps, dbName);
        resolve();
      }, reject);
    }).catch((err) => {
      switch (err?.name) {
        case "UnknownError":
          if (state.PR1398_maxLoop > 0) {
            state.PR1398_maxLoop--;
            console.warn("Dexie: Workaround for Chrome UnknownError on open()");
            return tryOpenDB();
          }
          break;
        case "VersionError":
          if (nativeVerToOpen > 0) {
            nativeVerToOpen = 0;
            return tryOpenDB();
          }
          break;
      }
      return DexiePromise.reject(err);
    });
    return DexiePromise.race([
      openCanceller,
      (typeof navigator === "undefined" ? DexiePromise.resolve() : idbReady()).then(tryOpenDB)
    ]).then(() => {
      throwIfCancelled();
      state.onReadyBeingFired = [];
      return DexiePromise.resolve(vip(() => db.on.ready.fire(db.vip))).then(function fireRemainders() {
        if (state.onReadyBeingFired.length > 0) {
          let remainders = state.onReadyBeingFired.reduce(promisableChain, nop);
          state.onReadyBeingFired = [];
          return DexiePromise.resolve(vip(() => remainders(db.vip))).then(fireRemainders);
        }
      });
    }).finally(() => {
      if (state.openCanceller === openCanceller) {
        state.onReadyBeingFired = null;
        state.isBeingOpened = false;
      }
    }).catch((err) => {
      state.dbOpenError = err;
      try {
        upgradeTransaction && upgradeTransaction.abort();
      } catch {
      }
      if (openCanceller === state.openCanceller) {
        db._close();
      }
      return rejection(err);
    }).finally(() => {
      state.openComplete = true;
      resolveDbReady();
    }).then(() => {
      if (wasCreated) {
        const everything = {};
        db.tables.forEach((table) => {
          table.schema.indexes.forEach((idx) => {
            if (idx.name)
              everything[`idb://${db.name}/${table.name}/${idx.name}`] = new RangeSet(-Infinity, [[[]]]);
          });
          everything[`idb://${db.name}/${table.name}/`] = everything[`idb://${db.name}/${table.name}/:dels`] = new RangeSet(-Infinity, [[[]]]);
        });
        globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME).fire(everything);
        signalSubscribersNow(everything, true);
      }
      return db;
    });
  }
  function awaitIterator(iterator) {
    var callNext = (result) => iterator.next(result), doThrow = (error) => iterator.throw(error), onSuccess = step(callNext), onError = step(doThrow);
    function step(getNext) {
      return (val) => {
        var next = getNext(val), value = next.value;
        return next.done ? value : !value || typeof value.then !== "function" ? isArray(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) : value.then(onSuccess, onError);
      };
    }
    return step(callNext)();
  }
  function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
    var i = arguments.length;
    if (i < 2)
      throw new exceptions.InvalidArgument("Too few arguments");
    var args = new Array(i - 1);
    while (--i)
      args[i - 1] = arguments[i];
    scopeFunc = args.pop();
    var tables = flatten(args);
    return [mode, tables, scopeFunc];
  }
  function enterTransactionScope(db, mode, storeNames, parentTransaction, scopeFunc) {
    return DexiePromise.resolve().then(() => {
      const transless = PSD.transless || PSD;
      const trans = db._createTransaction(mode, storeNames, db._dbSchema, parentTransaction);
      trans.explicit = true;
      const zoneProps = {
        trans,
        transless
      };
      if (parentTransaction) {
        trans.idbtrans = parentTransaction.idbtrans;
      } else {
        try {
          trans.create();
          trans.idbtrans._explicit = true;
          db._state.PR1398_maxLoop = 3;
        } catch (ex) {
          if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
            console.warn("Dexie: Need to reopen db");
            db.close({ disableAutoOpen: false });
            return db.open().then(() => enterTransactionScope(db, mode, storeNames, null, scopeFunc));
          }
          return rejection(ex);
        }
      }
      const scopeFuncIsAsync = isAsyncFunction(scopeFunc);
      if (scopeFuncIsAsync) {
        incrementExpectedAwaits();
      }
      let returnValue;
      const promiseFollowed = DexiePromise.follow(() => {
        returnValue = scopeFunc.call(trans, trans);
        if (returnValue) {
          if (scopeFuncIsAsync) {
            var decrementor = decrementExpectedAwaits.bind(null, null);
            returnValue.then(decrementor, decrementor);
          } else if (typeof returnValue.next === "function" && typeof returnValue.throw === "function") {
            returnValue = awaitIterator(returnValue);
          }
        }
      }, zoneProps);
      return (returnValue && typeof returnValue.then === "function" ? DexiePromise.resolve(returnValue).then((x) => trans.active ? x : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"))) : promiseFollowed.then(() => returnValue)).then((x) => {
        if (parentTransaction)
          trans._resolve();
        return trans._completion.then(() => x);
      }).catch((e) => {
        trans._reject(e);
        return rejection(e);
      });
    });
  }
  function pad(a, value, count) {
    const result = isArray(a) ? a.slice() : [a];
    for (let i = 0; i < count; ++i)
      result.push(value);
    return result;
  }
  function createVirtualIndexMiddleware(down) {
    return {
      ...down,
      table(tableName) {
        const table = down.table(tableName);
        const { schema } = table;
        const indexLookup = {};
        const allVirtualIndexes = [];
        function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
          const keyPathAlias = getKeyPathAlias(keyPath);
          const indexList = indexLookup[keyPathAlias] = indexLookup[keyPathAlias] || [];
          const keyLength = keyPath == null ? 0 : typeof keyPath === "string" ? 1 : keyPath.length;
          const isVirtual = keyTail > 0;
          const virtualIndex = {
            ...lowLevelIndex,
            name: isVirtual ? `${keyPathAlias}(virtual-from:${lowLevelIndex.name})` : lowLevelIndex.name,
            lowLevelIndex,
            isVirtual,
            keyTail,
            keyLength,
            extractKey: getKeyExtractor(keyPath),
            unique: !isVirtual && lowLevelIndex.unique
          };
          indexList.push(virtualIndex);
          if (!virtualIndex.isPrimaryKey) {
            allVirtualIndexes.push(virtualIndex);
          }
          if (keyLength > 1) {
            const virtualKeyPath = keyLength === 2 ? keyPath[0] : keyPath.slice(0, keyLength - 1);
            addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
          }
          indexList.sort((a, b) => a.keyTail - b.keyTail);
          return virtualIndex;
        }
        const primaryKey = addVirtualIndexes(schema.primaryKey.keyPath, 0, schema.primaryKey);
        indexLookup[":id"] = [primaryKey];
        for (const index of schema.indexes) {
          addVirtualIndexes(index.keyPath, 0, index);
        }
        function findBestIndex(keyPath) {
          const result2 = indexLookup[getKeyPathAlias(keyPath)];
          return result2 && result2[0];
        }
        function translateRange(range, keyTail) {
          return {
            type: range.type === 1 ? 2 : range.type,
            lower: pad(range.lower, range.lowerOpen ? down.MAX_KEY : down.MIN_KEY, keyTail),
            lowerOpen: true,
            upper: pad(range.upper, range.upperOpen ? down.MIN_KEY : down.MAX_KEY, keyTail),
            upperOpen: true
          };
        }
        function translateRequest(req) {
          const index = req.query.index;
          return index.isVirtual ? {
            ...req,
            query: {
              index: index.lowLevelIndex,
              range: translateRange(req.query.range, index.keyTail)
            }
          } : req;
        }
        const result = {
          ...table,
          schema: {
            ...schema,
            primaryKey,
            indexes: allVirtualIndexes,
            getIndexByKeyPath: findBestIndex
          },
          count(req) {
            return table.count(translateRequest(req));
          },
          query(req) {
            return table.query(translateRequest(req));
          },
          openCursor(req) {
            const { keyTail, isVirtual, keyLength } = req.query.index;
            if (!isVirtual)
              return table.openCursor(req);
            function createVirtualCursor(cursor) {
              function _continue(key) {
                key != null ? cursor.continue(pad(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)) : req.unique ? cursor.continue(cursor.key.slice(0, keyLength).concat(req.reverse ? down.MIN_KEY : down.MAX_KEY, keyTail)) : cursor.continue();
              }
              const virtualCursor = Object.create(cursor, {
                continue: { value: _continue },
                continuePrimaryKey: {
                  value(key, primaryKey2) {
                    cursor.continuePrimaryKey(pad(key, down.MAX_KEY, keyTail), primaryKey2);
                  }
                },
                primaryKey: {
                  get() {
                    return cursor.primaryKey;
                  }
                },
                key: {
                  get() {
                    const key = cursor.key;
                    return keyLength === 1 ? key[0] : key.slice(0, keyLength);
                  }
                },
                value: {
                  get() {
                    return cursor.value;
                  }
                }
              });
              return virtualCursor;
            }
            return table.openCursor(translateRequest(req)).then((cursor) => cursor && createVirtualCursor(cursor));
          }
        };
        return result;
      }
    };
  }
  var virtualIndexMiddleware = {
    stack: "dbcore",
    name: "VirtualIndexMiddleware",
    level: 1,
    create: createVirtualIndexMiddleware
  };
  function getObjectDiff(a, b, rv, prfx) {
    rv = rv || {};
    prfx = prfx || "";
    keys(a).forEach((prop) => {
      if (!hasOwn(b, prop)) {
        rv[prfx + prop] = void 0;
      } else {
        var ap = a[prop], bp = b[prop];
        if (typeof ap === "object" && typeof bp === "object" && ap && bp) {
          const apTypeName = toStringTag(ap);
          const bpTypeName = toStringTag(bp);
          if (apTypeName !== bpTypeName) {
            rv[prfx + prop] = b[prop];
          } else if (apTypeName === "Object") {
            getObjectDiff(ap, bp, rv, prfx + prop + ".");
          } else if (ap !== bp) {
            rv[prfx + prop] = b[prop];
          }
        } else if (ap !== bp)
          rv[prfx + prop] = b[prop];
      }
    });
    keys(b).forEach((prop) => {
      if (!hasOwn(a, prop)) {
        rv[prfx + prop] = b[prop];
      }
    });
    return rv;
  }
  function getEffectiveKeys(primaryKey, req) {
    if (req.type === "delete")
      return req.keys;
    return req.keys || req.values.map(primaryKey.extractKey);
  }
  var hooksMiddleware = {
    stack: "dbcore",
    name: "HooksMiddleware",
    level: 2,
    create: (downCore) => ({
      ...downCore,
      table(tableName) {
        const downTable = downCore.table(tableName);
        const { primaryKey } = downTable.schema;
        const tableMiddleware = {
          ...downTable,
          mutate(req) {
            const dxTrans = PSD.trans;
            const { deleting, creating, updating } = dxTrans.table(tableName).hook;
            switch (req.type) {
              case "add":
                if (creating.fire === nop)
                  break;
                return dxTrans._promise("readwrite", () => addPutOrDelete(req), true);
              case "put":
                if (creating.fire === nop && updating.fire === nop)
                  break;
                return dxTrans._promise("readwrite", () => addPutOrDelete(req), true);
              case "delete":
                if (deleting.fire === nop)
                  break;
                return dxTrans._promise("readwrite", () => addPutOrDelete(req), true);
              case "deleteRange":
                if (deleting.fire === nop)
                  break;
                return dxTrans._promise("readwrite", () => deleteRange(req), true);
            }
            return downTable.mutate(req);
            function addPutOrDelete(req2) {
              const dxTrans2 = PSD.trans;
              const keys2 = req2.keys || getEffectiveKeys(primaryKey, req2);
              if (!keys2)
                throw new Error("Keys missing");
              req2 = req2.type === "add" || req2.type === "put" ? { ...req2, keys: keys2 } : { ...req2 };
              if (req2.type !== "delete")
                req2.values = [...req2.values];
              if (req2.keys)
                req2.keys = [...req2.keys];
              return getExistingValues(downTable, req2, keys2).then((existingValues) => {
                const contexts = keys2.map((key, i) => {
                  const existingValue = existingValues[i];
                  const ctx = { onerror: null, onsuccess: null };
                  if (req2.type === "delete") {
                    deleting.fire.call(ctx, key, existingValue, dxTrans2);
                  } else if (req2.type === "add" || existingValue === void 0) {
                    const generatedPrimaryKey = creating.fire.call(ctx, key, req2.values[i], dxTrans2);
                    if (key == null && generatedPrimaryKey != null) {
                      key = generatedPrimaryKey;
                      req2.keys[i] = key;
                      if (!primaryKey.outbound) {
                        setByKeyPath(req2.values[i], primaryKey.keyPath, key);
                      }
                    }
                  } else {
                    const objectDiff = getObjectDiff(existingValue, req2.values[i]);
                    const additionalChanges = updating.fire.call(ctx, objectDiff, key, existingValue, dxTrans2);
                    if (additionalChanges) {
                      const requestedValue = req2.values[i];
                      Object.keys(additionalChanges).forEach((keyPath) => {
                        if (hasOwn(requestedValue, keyPath)) {
                          requestedValue[keyPath] = additionalChanges[keyPath];
                        } else {
                          setByKeyPath(requestedValue, keyPath, additionalChanges[keyPath]);
                        }
                      });
                    }
                  }
                  return ctx;
                });
                return downTable.mutate(req2).then(({ failures, results, numFailures, lastResult }) => {
                  for (let i = 0; i < keys2.length; ++i) {
                    const primKey = results ? results[i] : keys2[i];
                    const ctx = contexts[i];
                    if (primKey == null) {
                      ctx.onerror && ctx.onerror(failures[i]);
                    } else {
                      ctx.onsuccess && ctx.onsuccess(
                        req2.type === "put" && existingValues[i] ? req2.values[i] : primKey
                      );
                    }
                  }
                  return { failures, results, numFailures, lastResult };
                }).catch((error) => {
                  contexts.forEach((ctx) => ctx.onerror && ctx.onerror(error));
                  return Promise.reject(error);
                });
              });
            }
            function deleteRange(req2) {
              return deleteNextChunk(req2.trans, req2.range, 1e4);
            }
            function deleteNextChunk(trans, range, limit) {
              return downTable.query({ trans, values: false, query: { index: primaryKey, range }, limit }).then(({ result }) => {
                return addPutOrDelete({ type: "delete", keys: result, trans }).then((res) => {
                  if (res.numFailures > 0)
                    return Promise.reject(res.failures[0]);
                  if (result.length < limit) {
                    return { failures: [], numFailures: 0, lastResult: void 0 };
                  } else {
                    return deleteNextChunk(trans, { ...range, lower: result[result.length - 1], lowerOpen: true }, limit);
                  }
                });
              });
            }
          }
        };
        return tableMiddleware;
      }
    })
  };
  function getExistingValues(table, req, effectiveKeys) {
    return req.type === "add" ? Promise.resolve([]) : table.getMany({ trans: req.trans, keys: effectiveKeys, cache: "immutable" });
  }
  function getFromTransactionCache(keys2, cache2, clone) {
    try {
      if (!cache2)
        return null;
      if (cache2.keys.length < keys2.length)
        return null;
      const result = [];
      for (let i = 0, j = 0; i < cache2.keys.length && j < keys2.length; ++i) {
        if (cmp(cache2.keys[i], keys2[j]) !== 0)
          continue;
        result.push(clone ? deepClone(cache2.values[i]) : cache2.values[i]);
        ++j;
      }
      return result.length === keys2.length ? result : null;
    } catch {
      return null;
    }
  }
  var cacheExistingValuesMiddleware = {
    stack: "dbcore",
    level: -1,
    create: (core) => {
      return {
        table: (tableName) => {
          const table = core.table(tableName);
          return {
            ...table,
            getMany: (req) => {
              if (!req.cache) {
                return table.getMany(req);
              }
              const cachedResult = getFromTransactionCache(req.keys, req.trans["_cache"], req.cache === "clone");
              if (cachedResult) {
                return DexiePromise.resolve(cachedResult);
              }
              return table.getMany(req).then((res) => {
                req.trans["_cache"] = {
                  keys: req.keys,
                  values: req.cache === "clone" ? deepClone(res) : res
                };
                return res;
              });
            },
            mutate: (req) => {
              if (req.type !== "add")
                req.trans["_cache"] = null;
              return table.mutate(req);
            }
          };
        }
      };
    }
  };
  function isCachableContext(ctx, table) {
    return ctx.trans.mode === "readonly" && !!ctx.subscr && !ctx.trans.explicit && ctx.trans.db._options.cache !== "disabled" && !table.schema.primaryKey.outbound;
  }
  function isCachableRequest(type2, req) {
    switch (type2) {
      case "query":
        return req.values && !req.unique;
      case "get":
        return false;
      case "getMany":
        return false;
      case "count":
        return false;
      case "openCursor":
        return false;
    }
  }
  var observabilityMiddleware = {
    stack: "dbcore",
    level: 0,
    name: "Observability",
    create: (core) => {
      const dbName = core.schema.name;
      const FULL_RANGE = new RangeSet(core.MIN_KEY, core.MAX_KEY);
      return {
        ...core,
        transaction: (stores, mode, options) => {
          if (PSD.subscr && mode !== "readonly") {
            throw new exceptions.ReadOnly(`Readwrite transaction in liveQuery context. Querier source: ${PSD.querier}`);
          }
          return core.transaction(stores, mode, options);
        },
        table: (tableName) => {
          const table = core.table(tableName);
          const { schema } = table;
          const { primaryKey, indexes } = schema;
          const { extractKey, outbound } = primaryKey;
          const indexesWithAutoIncPK = primaryKey.autoIncrement && indexes.filter((index) => index.compound && index.keyPath.includes(primaryKey.keyPath));
          const tableClone = {
            ...table,
            mutate: (req) => {
              const trans = req.trans;
              const mutatedParts = req.mutatedParts || (req.mutatedParts = {});
              const getRangeSet = (indexName) => {
                const part = `idb://${dbName}/${tableName}/${indexName}`;
                return mutatedParts[part] || (mutatedParts[part] = new RangeSet());
              };
              const pkRangeSet = getRangeSet("");
              const delsRangeSet = getRangeSet(":dels");
              const { type: type2 } = req;
              let [keys2, newObjs] = req.type === "deleteRange" ? [req.range] : req.type === "delete" ? [req.keys] : req.values.length < 50 ? [getEffectiveKeys(primaryKey, req).filter((id) => id), req.values] : [];
              const oldCache = req.trans["_cache"];
              if (isArray(keys2)) {
                pkRangeSet.addKeys(keys2);
                const oldObjs = type2 === "delete" || keys2.length === newObjs.length ? getFromTransactionCache(keys2, oldCache) : null;
                if (!oldObjs) {
                  delsRangeSet.addKeys(keys2);
                }
                if (oldObjs || newObjs) {
                  trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs);
                }
              } else if (keys2) {
                const range = { from: keys2.lower, to: keys2.upper };
                delsRangeSet.add(range);
                pkRangeSet.add(range);
              } else {
                pkRangeSet.add(FULL_RANGE);
                delsRangeSet.add(FULL_RANGE);
                schema.indexes.forEach((idx) => getRangeSet(idx.name).add(FULL_RANGE));
              }
              return table.mutate(req).then((res) => {
                if (keys2 && (req.type === "add" || req.type === "put")) {
                  pkRangeSet.addKeys(res.results);
                  if (indexesWithAutoIncPK) {
                    indexesWithAutoIncPK.forEach((idx) => {
                      const idxVals = req.values.map((v) => idx.extractKey(v));
                      const pkPos = idx.keyPath.findIndex((prop) => prop === primaryKey.keyPath);
                      res.results.forEach((pk) => idxVals[pkPos] = pk);
                      getRangeSet(idx.name).addKeys(idxVals);
                    });
                  }
                }
                trans.mutatedParts = extendObservabilitySet(trans.mutatedParts || {}, mutatedParts);
                return res;
              });
            }
          };
          const getRange = ({ query: { index, range } }) => [
            index,
            new RangeSet(range.lower ?? core.MIN_KEY, range.upper ?? core.MAX_KEY)
          ];
          const readSubscribers = {
            get: (req) => [primaryKey, new RangeSet(req.key)],
            getMany: (req) => [primaryKey, new RangeSet().addKeys(req.keys)],
            count: getRange,
            query: getRange,
            openCursor: getRange
          };
          keys(readSubscribers).forEach((method) => {
            tableClone[method] = function(req) {
              const { subscr } = PSD;
              const isLiveQuery = !!subscr;
              let cachable = isCachableContext(PSD, table) && isCachableRequest(method, req);
              const obsSet = cachable ? req.obsSet = {} : subscr;
              if (isLiveQuery) {
                const getRangeSet = (indexName) => {
                  const part = `idb://${dbName}/${tableName}/${indexName}`;
                  return obsSet[part] || (obsSet[part] = new RangeSet());
                };
                const pkRangeSet = getRangeSet("");
                const delsRangeSet = getRangeSet(":dels");
                const [queriedIndex, queriedRanges] = readSubscribers[method](req);
                if (method === "query" && queriedIndex.isPrimaryKey && !req.values) {
                  delsRangeSet.add(queriedRanges);
                } else {
                  getRangeSet(queriedIndex.name || "").add(queriedRanges);
                }
                if (!queriedIndex.isPrimaryKey) {
                  if (method === "count") {
                    delsRangeSet.add(FULL_RANGE);
                  } else {
                    const keysPromise = method === "query" && outbound && req.values && table.query({
                      ...req,
                      values: false
                    });
                    return table[method].apply(this, arguments).then((res) => {
                      if (method === "query") {
                        if (outbound && req.values) {
                          return keysPromise.then(({ result: resultingKeys }) => {
                            pkRangeSet.addKeys(resultingKeys);
                            return res;
                          });
                        }
                        const pKeys = req.values ? res.result.map(extractKey) : res.result;
                        if (req.values) {
                          pkRangeSet.addKeys(pKeys);
                        } else {
                          delsRangeSet.addKeys(pKeys);
                        }
                      } else if (method === "openCursor") {
                        const cursor = res;
                        const wantValues = req.values;
                        return cursor && Object.create(cursor, {
                          key: {
                            get() {
                              delsRangeSet.addKey(cursor.primaryKey);
                              return cursor.key;
                            }
                          },
                          primaryKey: {
                            get() {
                              const pkey = cursor.primaryKey;
                              delsRangeSet.addKey(pkey);
                              return pkey;
                            }
                          },
                          value: {
                            get() {
                              wantValues && pkRangeSet.addKey(cursor.primaryKey);
                              return cursor.value;
                            }
                          }
                        });
                      }
                      return res;
                    });
                  }
                }
              }
              return table[method].apply(this, arguments);
            };
          });
          return tableClone;
        }
      };
    }
  };
  function trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs) {
    function addAffectedIndex(ix) {
      const rangeSet = getRangeSet(ix.name || "");
      function extractKey(obj) {
        return obj != null ? ix.extractKey(obj) : null;
      }
      const addKeyOrKeys = (key) => ix.multiEntry && isArray(key) ? key.forEach((key2) => rangeSet.addKey(key2)) : rangeSet.addKey(key);
      (oldObjs || newObjs).forEach((_, i) => {
        const oldKey = oldObjs && extractKey(oldObjs[i]);
        const newKey = newObjs && extractKey(newObjs[i]);
        if (cmp(oldKey, newKey) !== 0) {
          if (oldKey != null)
            addKeyOrKeys(oldKey);
          if (newKey != null)
            addKeyOrKeys(newKey);
        }
      });
    }
    schema.indexes.forEach(addAffectedIndex);
  }
  function adjustOptimisticFromFailures(tblCache, req, res) {
    if (res.numFailures === 0)
      return req;
    if (req.type === "deleteRange") {
      return null;
    }
    const numBulkOps = req.keys ? req.keys.length : "values" in req && req.values ? req.values.length : 1;
    if (res.numFailures === numBulkOps) {
      return null;
    }
    const clone = { ...req };
    if (isArray(clone.keys)) {
      clone.keys = clone.keys.filter((_, i) => !(i in res.failures));
    }
    if ("values" in clone && isArray(clone.values)) {
      clone.values = clone.values.filter((_, i) => !(i in res.failures));
    }
    return clone;
  }
  function isAboveLower(key, range) {
    return range.lower === void 0 ? true : range.lowerOpen ? cmp(key, range.lower) > 0 : cmp(key, range.lower) >= 0;
  }
  function isBelowUpper(key, range) {
    return range.upper === void 0 ? true : range.upperOpen ? cmp(key, range.upper) < 0 : cmp(key, range.upper) <= 0;
  }
  function isWithinRange(key, range) {
    return isAboveLower(key, range) && isBelowUpper(key, range);
  }
  function applyOptimisticOps(result, req, ops, table, cacheEntry, immutable) {
    if (!ops || ops.length === 0)
      return result;
    const index = req.query.index;
    const { multiEntry } = index;
    const queryRange = req.query.range;
    const primaryKey = table.schema.primaryKey;
    const extractPrimKey = primaryKey.extractKey;
    const extractIndex = index.extractKey;
    const extractLowLevelIndex = (index.lowLevelIndex || index).extractKey;
    let finalResult = ops.reduce((result2, op) => {
      let modifedResult = result2;
      const includedValues = [];
      if (op.type === "add" || op.type === "put") {
        const includedPKs = new RangeSet();
        for (let i = op.values.length - 1; i >= 0; --i) {
          const value = op.values[i];
          const pk = extractPrimKey(value);
          if (includedPKs.hasKey(pk))
            continue;
          const key = extractIndex(value);
          if (multiEntry && isArray(key) ? key.some((k) => isWithinRange(k, queryRange)) : isWithinRange(key, queryRange)) {
            includedPKs.addKey(pk);
            includedValues.push(value);
          }
        }
      }
      switch (op.type) {
        case "add":
          modifedResult = result2.concat(req.values ? includedValues : includedValues.map((v) => extractPrimKey(v)));
          break;
        case "put":
          const keySet = new RangeSet().addKeys(op.values.map((v) => extractPrimKey(v)));
          modifedResult = result2.filter(
            (item) => !keySet.hasKey(req.values ? extractPrimKey(item) : item)
          ).concat(
            req.values ? includedValues : includedValues.map((v) => extractPrimKey(v))
          );
          break;
        case "delete":
          const keysToDelete = new RangeSet().addKeys(op.keys);
          modifedResult = result2.filter((item) => !keysToDelete.hasKey(req.values ? extractPrimKey(item) : item));
          break;
        case "deleteRange":
          const range = op.range;
          modifedResult = result2.filter((item) => !isWithinRange(extractPrimKey(item), range));
          break;
      }
      return modifedResult;
    }, result);
    if (finalResult === result)
      return result;
    finalResult.sort((a, b) => cmp(extractLowLevelIndex(a), extractLowLevelIndex(b)) || cmp(extractPrimKey(a), extractPrimKey(b)));
    if (req.limit && req.limit < Infinity) {
      if (finalResult.length > req.limit) {
        finalResult.length = req.limit;
      } else if (result.length === req.limit && finalResult.length < req.limit) {
        cacheEntry.dirty = true;
      }
    }
    return immutable ? Object.freeze(finalResult) : finalResult;
  }
  function areRangesEqual(r1, r2) {
    return cmp(r1.lower, r2.lower) === 0 && cmp(r1.upper, r2.upper) === 0 && !!r1.lowerOpen === !!r2.lowerOpen && !!r1.upperOpen === !!r2.upperOpen;
  }
  function compareLowers(lower1, lower2, lowerOpen1, lowerOpen2) {
    if (lower1 === void 0)
      return lower2 !== void 0 ? -1 : 0;
    if (lower2 === void 0)
      return 1;
    const c = cmp(lower1, lower2);
    if (c === 0) {
      if (lowerOpen1 && lowerOpen2)
        return 0;
      if (lowerOpen1)
        return 1;
      if (lowerOpen2)
        return -1;
    }
    return c;
  }
  function compareUppers(upper1, upper2, upperOpen1, upperOpen2) {
    if (upper1 === void 0)
      return upper2 !== void 0 ? 1 : 0;
    if (upper2 === void 0)
      return -1;
    const c = cmp(upper1, upper2);
    if (c === 0) {
      if (upperOpen1 && upperOpen2)
        return 0;
      if (upperOpen1)
        return -1;
      if (upperOpen2)
        return 1;
    }
    return c;
  }
  function isSuperRange(r1, r2) {
    return compareLowers(r1.lower, r2.lower, r1.lowerOpen, r2.lowerOpen) <= 0 && compareUppers(r1.upper, r2.upper, r1.upperOpen, r2.upperOpen) >= 0;
  }
  function findCompatibleQuery(dbName, tableName, type2, req) {
    const tblCache = cache[`idb://${dbName}/${tableName}`];
    if (!tblCache)
      return [];
    const queries = tblCache.queries[type2];
    if (!queries)
      return [null, false, tblCache, null];
    const indexName = req.query ? req.query.index.name : null;
    const entries = queries[indexName || ""];
    if (!entries)
      return [null, false, tblCache, null];
    switch (type2) {
      case "query":
        const equalEntry = entries.find((entry) => entry.req.limit === req.limit && entry.req.values === req.values && areRangesEqual(entry.req.query.range, req.query.range));
        if (equalEntry)
          return [
            equalEntry,
            true,
            tblCache,
            entries
          ];
        const superEntry = entries.find((entry) => {
          const limit = "limit" in entry.req ? entry.req.limit : Infinity;
          return limit >= req.limit && (req.values ? entry.req.values : true) && isSuperRange(entry.req.query.range, req.query.range);
        });
        return [superEntry, false, tblCache, entries];
      case "count":
        const countQuery = entries.find((entry) => areRangesEqual(entry.req.query.range, req.query.range));
        return [countQuery, !!countQuery, tblCache, entries];
    }
  }
  function subscribeToCacheEntry(cacheEntry, container, requery, signal) {
    cacheEntry.subscribers.add(requery);
    signal.addEventListener("abort", () => {
      cacheEntry.subscribers.delete(requery);
      if (cacheEntry.subscribers.size === 0) {
        enqueForDeletion(cacheEntry, container);
      }
    });
  }
  function enqueForDeletion(cacheEntry, container) {
    setTimeout(() => {
      if (cacheEntry.subscribers.size === 0) {
        delArrayItem(container, cacheEntry);
      }
    }, 3e3);
  }
  var cacheMiddleware = {
    stack: "dbcore",
    level: 0,
    name: "Cache",
    create: (core) => {
      const dbName = core.schema.name;
      const coreMW = {
        ...core,
        transaction: (stores, mode, options) => {
          const idbtrans = core.transaction(stores, mode, options);
          if (mode === "readwrite") {
            const ac = new AbortController();
            const { signal } = ac;
            const endTransaction = (wasCommitted) => () => {
              ac.abort();
              if (mode === "readwrite") {
                const affectedSubscribers = /* @__PURE__ */ new Set();
                for (const storeName of stores) {
                  const tblCache = cache[`idb://${dbName}/${storeName}`];
                  if (tblCache) {
                    const table = core.table(storeName);
                    const ops = tblCache.optimisticOps.filter((op) => op.trans === idbtrans);
                    if (idbtrans._explicit && wasCommitted && idbtrans.mutatedParts) {
                      for (const entries of Object.values(tblCache.queries.query)) {
                        for (const entry of entries.slice()) {
                          if (obsSetsOverlap(entry.obsSet, idbtrans.mutatedParts)) {
                            delArrayItem(entries, entry);
                            entry.subscribers.forEach((requery) => affectedSubscribers.add(requery));
                          }
                        }
                      }
                    } else if (ops.length > 0) {
                      tblCache.optimisticOps = tblCache.optimisticOps.filter((op) => op.trans !== idbtrans);
                      for (const entries of Object.values(tblCache.queries.query)) {
                        for (const entry of entries.slice()) {
                          if (entry.res != null && idbtrans.mutatedParts) {
                            if (wasCommitted && !entry.dirty) {
                              const freezeResults = Object.isFrozen(entry.res);
                              const modRes = applyOptimisticOps(entry.res, entry.req, ops, table, entry, freezeResults);
                              if (entry.dirty) {
                                delArrayItem(entries, entry);
                                entry.subscribers.forEach((requery) => affectedSubscribers.add(requery));
                              } else if (modRes !== entry.res) {
                                entry.res = modRes;
                                entry.promise = DexiePromise.resolve({ result: modRes });
                              }
                            } else {
                              if (entry.dirty) {
                                delArrayItem(entries, entry);
                              }
                              entry.subscribers.forEach((requery) => affectedSubscribers.add(requery));
                            }
                          }
                        }
                      }
                    }
                  }
                }
                affectedSubscribers.forEach((requery) => requery());
              }
            };
            idbtrans.addEventListener("abort", endTransaction(false), {
              signal
            });
            idbtrans.addEventListener("error", endTransaction(false), {
              signal
            });
            idbtrans.addEventListener("complete", endTransaction(true), {
              signal
            });
          }
          return idbtrans;
        },
        table(tableName) {
          const downTable = core.table(tableName);
          const primKey = downTable.schema.primaryKey;
          const tableMW = {
            ...downTable,
            mutate(req) {
              const trans = PSD.trans;
              if (primKey.outbound || trans.db._options.cache === "disabled" || trans.explicit) {
                return downTable.mutate(req);
              }
              const tblCache = cache[`idb://${dbName}/${tableName}`];
              if (!tblCache)
                return downTable.mutate(req);
              const promise = downTable.mutate(req);
              if ((req.type === "add" || req.type === "put") && (req.values.length >= 50 || getEffectiveKeys(primKey, req).some((key) => key == null))) {
                promise.then((res) => {
                  const reqWithResolvedKeys = {
                    ...req,
                    values: req.values.map((value, i) => {
                      const valueWithKey = primKey.keyPath?.includes(".") ? deepClone(value) : {
                        ...value
                      };
                      setByKeyPath(valueWithKey, primKey.keyPath, res.results[i]);
                      return valueWithKey;
                    })
                  };
                  const adjustedReq = adjustOptimisticFromFailures(tblCache, reqWithResolvedKeys, res);
                  tblCache.optimisticOps.push(adjustedReq);
                  queueMicrotask(() => req.mutatedParts && signalSubscribersLazily(req.mutatedParts));
                });
              } else {
                tblCache.optimisticOps.push(req);
                req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                promise.then((res) => {
                  if (res.numFailures > 0) {
                    delArrayItem(tblCache.optimisticOps, req);
                    const adjustedReq = adjustOptimisticFromFailures(tblCache, req, res);
                    if (adjustedReq) {
                      tblCache.optimisticOps.push(adjustedReq);
                    }
                    req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                  }
                });
                promise.catch(() => {
                  delArrayItem(tblCache.optimisticOps, req);
                  req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                });
              }
              return promise;
            },
            query(req) {
              if (!isCachableContext(PSD, downTable) || !isCachableRequest("query", req))
                return downTable.query(req);
              const freezeResults = PSD.trans?.db._options.cache === "immutable";
              const { requery, signal } = PSD;
              let [cacheEntry, exactMatch, tblCache, container] = findCompatibleQuery(dbName, tableName, "query", req);
              if (cacheEntry && exactMatch) {
                cacheEntry.obsSet = req.obsSet;
              } else {
                const promise = downTable.query(req).then((res) => {
                  const result = res.result;
                  if (cacheEntry)
                    cacheEntry.res = result;
                  if (freezeResults) {
                    for (let i = 0, l = result.length; i < l; ++i) {
                      Object.freeze(result[i]);
                    }
                    Object.freeze(result);
                  } else {
                    res.result = deepClone(result);
                  }
                  return res;
                }).catch((error) => {
                  if (container && cacheEntry)
                    delArrayItem(container, cacheEntry);
                  return Promise.reject(error);
                });
                cacheEntry = {
                  obsSet: req.obsSet,
                  promise,
                  subscribers: /* @__PURE__ */ new Set(),
                  type: "query",
                  req,
                  dirty: false
                };
                if (container) {
                  container.push(cacheEntry);
                } else {
                  container = [cacheEntry];
                  if (!tblCache) {
                    tblCache = cache[`idb://${dbName}/${tableName}`] = {
                      queries: {
                        query: {},
                        count: {}
                      },
                      objs: /* @__PURE__ */ new Map(),
                      optimisticOps: [],
                      unsignaledParts: {}
                    };
                  }
                  tblCache.queries.query[req.query.index.name || ""] = container;
                }
              }
              subscribeToCacheEntry(cacheEntry, container, requery, signal);
              return cacheEntry.promise.then((res) => {
                return {
                  result: applyOptimisticOps(res.result, req, tblCache?.optimisticOps, downTable, cacheEntry, freezeResults)
                };
              });
            }
          };
          return tableMW;
        }
      };
      return coreMW;
    }
  };
  function vipify(target, vipDb) {
    return new Proxy(target, {
      get(target2, prop, receiver) {
        if (prop === "db")
          return vipDb;
        return Reflect.get(target2, prop, receiver);
      }
    });
  }
  var Dexie$1 = class _Dexie$1 {
    constructor(name, options) {
      this._middlewares = {};
      this.verno = 0;
      const deps = _Dexie$1.dependencies;
      this._options = options = {
        addons: _Dexie$1.addons,
        autoOpen: true,
        indexedDB: deps.indexedDB,
        IDBKeyRange: deps.IDBKeyRange,
        cache: "cloned",
        ...options
      };
      this._deps = {
        indexedDB: options.indexedDB,
        IDBKeyRange: options.IDBKeyRange
      };
      const { addons } = options;
      this._dbSchema = {};
      this._versions = [];
      this._storeNames = [];
      this._allTables = {};
      this.idbdb = null;
      this._novip = this;
      const state = {
        dbOpenError: null,
        isBeingOpened: false,
        onReadyBeingFired: null,
        openComplete: false,
        dbReadyResolve: nop,
        dbReadyPromise: null,
        cancelOpen: nop,
        openCanceller: null,
        autoSchema: true,
        PR1398_maxLoop: 3,
        autoOpen: options.autoOpen
      };
      state.dbReadyPromise = new DexiePromise((resolve) => {
        state.dbReadyResolve = resolve;
      });
      state.openCanceller = new DexiePromise((_, reject) => {
        state.cancelOpen = reject;
      });
      this._state = state;
      this.name = name;
      this.on = Events(this, "populate", "blocked", "versionchange", "close", { ready: [promisableChain, nop] });
      this.on.ready.subscribe = override(this.on.ready.subscribe, (subscribe) => {
        return (subscriber, bSticky) => {
          _Dexie$1.vip(() => {
            const state2 = this._state;
            if (state2.openComplete) {
              if (!state2.dbOpenError)
                DexiePromise.resolve().then(subscriber);
              if (bSticky)
                subscribe(subscriber);
            } else if (state2.onReadyBeingFired) {
              state2.onReadyBeingFired.push(subscriber);
              if (bSticky)
                subscribe(subscriber);
            } else {
              subscribe(subscriber);
              const db = this;
              if (!bSticky)
                subscribe(function unsubscribe() {
                  db.on.ready.unsubscribe(subscriber);
                  db.on.ready.unsubscribe(unsubscribe);
                });
            }
          });
        };
      });
      this.Collection = createCollectionConstructor(this);
      this.Table = createTableConstructor(this);
      this.Transaction = createTransactionConstructor(this);
      this.Version = createVersionConstructor(this);
      this.WhereClause = createWhereClauseConstructor(this);
      this.on("versionchange", (ev) => {
        if (ev.newVersion > 0)
          console.warn(`Another connection wants to upgrade database '${this.name}'. Closing db now to resume the upgrade.`);
        else
          console.warn(`Another connection wants to delete database '${this.name}'. Closing db now to resume the delete request.`);
        this.close({ disableAutoOpen: false });
      });
      this.on("blocked", (ev) => {
        if (!ev.newVersion || ev.newVersion < ev.oldVersion)
          console.warn(`Dexie.delete('${this.name}') was blocked`);
        else
          console.warn(`Upgrade '${this.name}' blocked by other connection holding version ${ev.oldVersion / 10}`);
      });
      this._maxKey = getMaxKey(options.IDBKeyRange);
      this._createTransaction = (mode, storeNames, dbschema, parentTransaction) => new this.Transaction(mode, storeNames, dbschema, this._options.chromeTransactionDurability, parentTransaction);
      this._fireOnBlocked = (ev) => {
        this.on("blocked").fire(ev);
        connections.filter((c) => c.name === this.name && c !== this && !c._state.vcFired).map((c) => c.on("versionchange").fire(ev));
      };
      this.use(cacheExistingValuesMiddleware);
      this.use(cacheMiddleware);
      this.use(observabilityMiddleware);
      this.use(virtualIndexMiddleware);
      this.use(hooksMiddleware);
      const vipDB = new Proxy(this, {
        get: (_, prop, receiver) => {
          if (prop === "_vip")
            return true;
          if (prop === "table")
            return (tableName) => vipify(this.table(tableName), vipDB);
          const rv = Reflect.get(_, prop, receiver);
          if (rv instanceof Table)
            return vipify(rv, vipDB);
          if (prop === "tables")
            return rv.map((t) => vipify(t, vipDB));
          if (prop === "_createTransaction")
            return function() {
              const tx = rv.apply(this, arguments);
              return vipify(tx, vipDB);
            };
          return rv;
        }
      });
      this.vip = vipDB;
      addons.forEach((addon) => addon(this));
    }
    version(versionNumber) {
      if (isNaN(versionNumber) || versionNumber < 0.1)
        throw new exceptions.Type(`Given version is not a positive number`);
      versionNumber = Math.round(versionNumber * 10) / 10;
      if (this.idbdb || this._state.isBeingOpened)
        throw new exceptions.Schema("Cannot add version when database is open");
      this.verno = Math.max(this.verno, versionNumber);
      const versions = this._versions;
      var versionInstance = versions.filter((v) => v._cfg.version === versionNumber)[0];
      if (versionInstance)
        return versionInstance;
      versionInstance = new this.Version(versionNumber);
      versions.push(versionInstance);
      versions.sort(lowerVersionFirst);
      versionInstance.stores({});
      this._state.autoSchema = false;
      return versionInstance;
    }
    _whenReady(fn) {
      return this.idbdb && (this._state.openComplete || PSD.letThrough || this._vip) ? fn() : new DexiePromise((resolve, reject) => {
        if (this._state.openComplete) {
          return reject(new exceptions.DatabaseClosed(this._state.dbOpenError));
        }
        if (!this._state.isBeingOpened) {
          if (!this._state.autoOpen) {
            reject(new exceptions.DatabaseClosed());
            return;
          }
          this.open().catch(nop);
        }
        this._state.dbReadyPromise.then(resolve, reject);
      }).then(fn);
    }
    use({ stack, create, level, name }) {
      if (name)
        this.unuse({ stack, name });
      const middlewares = this._middlewares[stack] || (this._middlewares[stack] = []);
      middlewares.push({ stack, create, level: level == null ? 10 : level, name });
      middlewares.sort((a, b) => a.level - b.level);
      return this;
    }
    unuse({ stack, name, create }) {
      if (stack && this._middlewares[stack]) {
        this._middlewares[stack] = this._middlewares[stack].filter((mw) => create ? mw.create !== create : name ? mw.name !== name : false);
      }
      return this;
    }
    open() {
      return usePSD(
        globalPSD,
        () => dexieOpen(this)
      );
    }
    _close() {
      const state = this._state;
      const idx = connections.indexOf(this);
      if (idx >= 0)
        connections.splice(idx, 1);
      if (this.idbdb) {
        try {
          this.idbdb.close();
        } catch (e) {
        }
        this.idbdb = null;
      }
      if (!state.isBeingOpened) {
        state.dbReadyPromise = new DexiePromise((resolve) => {
          state.dbReadyResolve = resolve;
        });
        state.openCanceller = new DexiePromise((_, reject) => {
          state.cancelOpen = reject;
        });
      }
    }
    close({ disableAutoOpen } = { disableAutoOpen: true }) {
      const state = this._state;
      if (disableAutoOpen) {
        if (state.isBeingOpened) {
          state.cancelOpen(new exceptions.DatabaseClosed());
        }
        this._close();
        state.autoOpen = false;
        state.dbOpenError = new exceptions.DatabaseClosed();
      } else {
        this._close();
        state.autoOpen = this._options.autoOpen || state.isBeingOpened;
        state.openComplete = false;
        state.dbOpenError = null;
      }
    }
    delete(closeOptions = { disableAutoOpen: true }) {
      const hasInvalidArguments = arguments.length > 0 && typeof arguments[0] !== "object";
      const state = this._state;
      return new DexiePromise((resolve, reject) => {
        const doDelete = () => {
          this.close(closeOptions);
          var req = this._deps.indexedDB.deleteDatabase(this.name);
          req.onsuccess = wrap(() => {
            _onDatabaseDeleted(this._deps, this.name);
            resolve();
          });
          req.onerror = eventRejectHandler(reject);
          req.onblocked = this._fireOnBlocked;
        };
        if (hasInvalidArguments)
          throw new exceptions.InvalidArgument("Invalid closeOptions argument to db.delete()");
        if (state.isBeingOpened) {
          state.dbReadyPromise.then(doDelete);
        } else {
          doDelete();
        }
      });
    }
    backendDB() {
      return this.idbdb;
    }
    isOpen() {
      return this.idbdb !== null;
    }
    hasBeenClosed() {
      const dbOpenError = this._state.dbOpenError;
      return dbOpenError && dbOpenError.name === "DatabaseClosed";
    }
    hasFailed() {
      return this._state.dbOpenError !== null;
    }
    dynamicallyOpened() {
      return this._state.autoSchema;
    }
    get tables() {
      return keys(this._allTables).map((name) => this._allTables[name]);
    }
    transaction() {
      const args = extractTransactionArgs.apply(this, arguments);
      return this._transaction.apply(this, args);
    }
    _transaction(mode, tables, scopeFunc) {
      let parentTransaction = PSD.trans;
      if (!parentTransaction || parentTransaction.db !== this || mode.indexOf("!") !== -1)
        parentTransaction = null;
      const onlyIfCompatible = mode.indexOf("?") !== -1;
      mode = mode.replace("!", "").replace("?", "");
      let idbMode, storeNames;
      try {
        storeNames = tables.map((table) => {
          var storeName = table instanceof this.Table ? table.name : table;
          if (typeof storeName !== "string")
            throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
          return storeName;
        });
        if (mode == "r" || mode === READONLY)
          idbMode = READONLY;
        else if (mode == "rw" || mode == READWRITE)
          idbMode = READWRITE;
        else
          throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
        if (parentTransaction) {
          if (parentTransaction.mode === READONLY && idbMode === READWRITE) {
            if (onlyIfCompatible) {
              parentTransaction = null;
            } else
              throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
          }
          if (parentTransaction) {
            storeNames.forEach((storeName) => {
              if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
                if (onlyIfCompatible) {
                  parentTransaction = null;
                } else
                  throw new exceptions.SubTransaction("Table " + storeName + " not included in parent transaction.");
              }
            });
          }
          if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
            parentTransaction = null;
          }
        }
      } catch (e) {
        return parentTransaction ? parentTransaction._promise(null, (_, reject) => {
          reject(e);
        }) : rejection(e);
      }
      const enterTransaction = enterTransactionScope.bind(null, this, idbMode, storeNames, parentTransaction, scopeFunc);
      return parentTransaction ? parentTransaction._promise(idbMode, enterTransaction, "lock") : PSD.trans ? usePSD(PSD.transless, () => this._whenReady(enterTransaction)) : this._whenReady(enterTransaction);
    }
    table(tableName) {
      if (!hasOwn(this._allTables, tableName)) {
        throw new exceptions.InvalidTable(`Table ${tableName} does not exist`);
      }
      return this._allTables[tableName];
    }
  };
  var symbolObservable = typeof Symbol !== "undefined" && "observable" in Symbol ? Symbol.observable : "@@observable";
  var Observable = class {
    constructor(subscribe) {
      this._subscribe = subscribe;
    }
    subscribe(x, error, complete) {
      return this._subscribe(!x || typeof x === "function" ? { next: x, error, complete } : x);
    }
    [symbolObservable]() {
      return this;
    }
  };
  var domDeps;
  try {
    domDeps = {
      indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
      IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
    };
  } catch (e) {
    domDeps = { indexedDB: null, IDBKeyRange: null };
  }
  function liveQuery(querier) {
    let hasValue = false;
    let currentValue;
    const observable = new Observable((observer) => {
      const scopeFuncIsAsync = isAsyncFunction(querier);
      function execute(ctx) {
        const wasRootExec = beginMicroTickScope();
        try {
          if (scopeFuncIsAsync) {
            incrementExpectedAwaits();
          }
          let rv = newScope(querier, ctx);
          if (scopeFuncIsAsync) {
            rv = rv.finally(decrementExpectedAwaits);
          }
          return rv;
        } finally {
          wasRootExec && endMicroTickScope();
        }
      }
      let closed = false;
      let abortController;
      let accumMuts = {};
      let currentObs = {};
      const subscription = {
        get closed() {
          return closed;
        },
        unsubscribe: () => {
          if (closed)
            return;
          closed = true;
          if (abortController)
            abortController.abort();
          if (startedListening)
            globalEvents.storagemutated.unsubscribe(mutationListener);
        }
      };
      observer.start && observer.start(subscription);
      let startedListening = false;
      const doQuery = () => execInGlobalContext(_doQuery);
      function shouldNotify() {
        return obsSetsOverlap(currentObs, accumMuts);
      }
      const mutationListener = (parts) => {
        extendObservabilitySet(accumMuts, parts);
        if (shouldNotify()) {
          doQuery();
        }
      };
      const _doQuery = () => {
        if (closed || !domDeps.indexedDB) {
          return;
        }
        accumMuts = {};
        const subscr = {};
        if (abortController)
          abortController.abort();
        abortController = new AbortController();
        const ctx = {
          subscr,
          signal: abortController.signal,
          requery: doQuery,
          querier,
          trans: null
        };
        const ret = execute(ctx);
        Promise.resolve(ret).then((result) => {
          hasValue = true;
          currentValue = result;
          if (closed || ctx.signal.aborted) {
            return;
          }
          accumMuts = {};
          currentObs = subscr;
          if (!objectIsEmpty(currentObs) && !startedListening) {
            globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, mutationListener);
            startedListening = true;
          }
          execInGlobalContext(() => !closed && observer.next && observer.next(result));
        }, (err) => {
          hasValue = false;
          if (!["DatabaseClosedError", "AbortError"].includes(err?.name)) {
            if (!closed)
              execInGlobalContext(() => {
                if (closed)
                  return;
                observer.error && observer.error(err);
              });
          }
        });
      };
      setTimeout(doQuery, 0);
      return subscription;
    });
    observable.hasValue = () => hasValue;
    observable.getValue = () => currentValue;
    return observable;
  }
  var Dexie = Dexie$1;
  props(Dexie, {
    ...fullNameExceptions,
    delete(databaseName) {
      const db = new Dexie(databaseName, { addons: [] });
      return db.delete();
    },
    exists(name) {
      return new Dexie(name, { addons: [] }).open().then((db) => {
        db.close();
        return true;
      }).catch("NoSuchDatabaseError", () => false);
    },
    getDatabaseNames(cb) {
      try {
        return getDatabaseNames(Dexie.dependencies).then(cb);
      } catch {
        return rejection(new exceptions.MissingAPI());
      }
    },
    defineClass() {
      function Class(content) {
        extend(this, content);
      }
      return Class;
    },
    ignoreTransaction(scopeFunc) {
      return PSD.trans ? usePSD(PSD.transless, scopeFunc) : scopeFunc();
    },
    vip,
    async: function(generatorFn) {
      return function() {
        try {
          var rv = awaitIterator(generatorFn.apply(this, arguments));
          if (!rv || typeof rv.then !== "function")
            return DexiePromise.resolve(rv);
          return rv;
        } catch (e) {
          return rejection(e);
        }
      };
    },
    spawn: function(generatorFn, args, thiz) {
      try {
        var rv = awaitIterator(generatorFn.apply(thiz, args || []));
        if (!rv || typeof rv.then !== "function")
          return DexiePromise.resolve(rv);
        return rv;
      } catch (e) {
        return rejection(e);
      }
    },
    currentTransaction: {
      get: () => PSD.trans || null
    },
    waitFor: function(promiseOrFunction, optionalTimeout) {
      const promise = DexiePromise.resolve(typeof promiseOrFunction === "function" ? Dexie.ignoreTransaction(promiseOrFunction) : promiseOrFunction).timeout(optionalTimeout || 6e4);
      return PSD.trans ? PSD.trans.waitFor(promise) : promise;
    },
    Promise: DexiePromise,
    debug: {
      get: () => debug,
      set: (value) => {
        setDebug(value);
      }
    },
    derive,
    extend,
    props,
    override,
    Events,
    on: globalEvents,
    liveQuery,
    extendObservabilitySet,
    getByKeyPath,
    setByKeyPath,
    delByKeyPath,
    shallowClone,
    deepClone,
    getObjectDiff,
    cmp,
    asap: asap$1,
    minKey,
    addons: [],
    connections,
    errnames,
    dependencies: domDeps,
    cache,
    semVer: DEXIE_VERSION,
    version: DEXIE_VERSION.split(".").map((n) => parseInt(n)).reduce((p, c, i) => p + c / Math.pow(10, i * 2))
  });
  Dexie.maxKey = getMaxKey(Dexie.dependencies.IDBKeyRange);
  if (typeof dispatchEvent !== "undefined" && typeof addEventListener !== "undefined") {
    globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, (updatedParts) => {
      if (!propagatingLocally) {
        let event;
        event = new CustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, {
          detail: updatedParts
        });
        propagatingLocally = true;
        dispatchEvent(event);
        propagatingLocally = false;
      }
    });
    addEventListener(STORAGE_MUTATED_DOM_EVENT_NAME, ({ detail }) => {
      if (!propagatingLocally) {
        propagateLocally(detail);
      }
    });
  }
  function propagateLocally(updateParts) {
    let wasMe = propagatingLocally;
    try {
      propagatingLocally = true;
      globalEvents.storagemutated.fire(updateParts);
      signalSubscribersNow(updateParts, true);
    } finally {
      propagatingLocally = wasMe;
    }
  }
  var propagatingLocally = false;
  var bc;
  var createBC = () => {
  };
  if (typeof BroadcastChannel !== "undefined") {
    createBC = () => {
      bc = new BroadcastChannel(STORAGE_MUTATED_DOM_EVENT_NAME);
      bc.onmessage = (ev) => ev.data && propagateLocally(ev.data);
    };
    createBC();
    if (typeof bc.unref === "function") {
      bc.unref();
    }
    globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, (changedParts) => {
      if (!propagatingLocally) {
        bc.postMessage(changedParts);
      }
    });
  }
  if (typeof addEventListener !== "undefined") {
    addEventListener("pagehide", (event) => {
      if (!Dexie$1.disableBfCache && event.persisted) {
        if (debug)
          console.debug("Dexie: handling persisted pagehide");
        bc?.close();
        for (const db of connections) {
          db.close({ disableAutoOpen: false });
        }
      }
    });
    addEventListener("pageshow", (event) => {
      if (!Dexie$1.disableBfCache && event.persisted) {
        if (debug)
          console.debug("Dexie: handling persisted pageshow");
        createBC();
        propagateLocally({ all: new RangeSet(-Infinity, [[]]) });
      }
    });
  }
  DexiePromise.rejectionMapper = mapError;
  setDebug(debug);

  // src/utils/index.ts
  var Option = class _Option {
    constructor(inner) {
      this.inner = inner;
    }
    static Some(value) {
      return new _Option({ some: true, value });
    }
    static None() {
      return new _Option({ some: false });
    }
    match(matcher) {
      if (this.inner.some) {
        return matcher.some(this.inner.value);
      }
      return matcher.none();
    }
    map(fn) {
      return this.match({
        some: (t) => _Option.Some(fn(t)),
        none: () => _Option.None()
      });
    }
    andThen(fn) {
      return this.match({
        some: (t) => fn(t),
        none: () => _Option.None()
      });
    }
  };
  var Result = class _Result {
    constructor(inner) {
      this.inner = inner;
    }
    static Ok(value) {
      return new _Result({ ok: true, value });
    }
    static Err(error) {
      return new _Result({ ok: false, error });
    }
    isOk() {
      return this.inner.ok;
    }
    match(matcher) {
      if (this.inner.ok) {
        return matcher.ok(this.inner.value);
      }
      return matcher.err(this.inner.error);
    }
    map(fn) {
      return this.match({
        ok: (t) => _Result.Ok(fn(t)),
        err: (e) => _Result.Err(e)
      });
    }
    mapErr(fn) {
      return this.match({
        ok: (t) => _Result.Ok(t),
        err: (e) => _Result.Err(fn(e))
      });
    }
    andThen(fn) {
      return this.match({
        ok: (t) => fn(t),
        err: (e) => _Result.Err(e)
      });
    }
    asOk() {
      return this.match({
        ok: (t) => Option.Some(t),
        err: (_) => Option.None()
      });
    }
  };
  var Ok = (value) => {
    return Result.Ok(value);
  };
  var Err = (error) => {
    return Result.Err(error);
  };
  function to(value) {
    return value;
  }

  // src/database/worker.ts
  var createBook = (userId, bookId, cover) => {
    return {
      id: to(userId),
      book: {
        id: to(bookId),
        cover,
        title: "",
        type: 3 /* Paperback */,
        pages: 0,
        description: "",
        published: /* @__PURE__ */ new Date()
      },
      rating: 0,
      purchased: /* @__PURE__ */ new Date()
    };
  };
  var BOOKS = [
    createBook("ybw-djFeWs3vbQf25xECQ", "T62kQhbo_aIOeCpwHrQGi", "./public/0009276845-L.jpg"),
    createBook("LPJ8qsBpZ1y8P_rYIT9Gh", "_GxMZyg9UKMitNaR5Edv9", "./public/0009970034-L.jpg"),
    createBook("xOkcThsOnbJZunwyT7-WQ", "XCOIWR0WVVl3w-xU_7E1C", "./public/0010128852-L.jpg"),
    createBook("Z6DOq8S4Myv_3zARzpKqi", "Vy6o4DHiOD4oLsX0spCkB", "./public/0011865531-L.jpg"),
    createBook("YeastuskxRucUS6LcVGgM", "pCXbm02mtO-nLh4vSDLv7", "./public/0011918737-L.jpg"),
    createBook("5UsM88R9aWmu_99QE_txN", "p9uMVa7JPB8KHww4T23-y", "./public/0011922810-L.jpg"),
    createBook("B4co_lLhlipaaqJIOfd_q", "05R5JdXJnKCPXKXkhQ5kg", "./public/0012791623-L.jpg"),
    createBook("2_ngDyhiju9ICYcj74e9I", "c9Qid8p9zEPqx6F4SF4KE", "./public/0013070958-L.jpg"),
    createBook("77k448mgkXtvNt3ZAatR-", "tJjkqPq-S_Ps9IYBbxpcs", "./public/0013416640-L.jpg"),
    createBook("c_ge0A-VrqeUyAeIYwUUG", "4hauXlVpAPYklHr34ZIca", "./public/3002898-L.jpg"),
    createBook("X1i9K4u6PAQuKNnxPicjH", "k-BhTcS47DH67PC2MM9jB", "./public/4607078-L.jpg"),
    createBook("FaX5sR_EfK5fd6Rxp0r3H", "KiXRSYeIzMbMOAyKp0698", "./public/5654258-L.jpg"),
    createBook("WHHZAfI1iKOT34Bv67Aew", "BNYH3hfbZ6OioHWCjqrJp", "./public/573479-L.jpg"),
    createBook("8DcfoeHezAOv_RxhLiJCR", "UHOjdK4MZp9abgQMO3Evl", "./public/5742496-L.jpg"),
    createBook("B-a26--EClbZb2Q5lqfP7", "5oeIFqpV-5GcnKiBaUQQb", "./public/6136328-L.jpg"),
    createBook("Iv7BJCsfV7IGi_Wd6LGZX", "sut-OS24Emr1K3veiUVKo", "./public/7132786-L.jpg"),
    createBook("STfmfyurEOWITHNZ-WeJt", "3iJzTSfLDMY2_7LSTO2Sj", "./public/7943675-L.jpg")
  ];
  var database = new Dexie$1("sissix");
  database.version(1).stores({
    books: "++id",
    userBooks: "++id",
    bookshelves: "++id"
  });
  var getBookshelves = async () => {
    return Ok([
      {
        id: to("1"),
        name: "Test Bookshelf"
      },
      {
        id: to("2"),
        name: "Test Bookshelf"
      },
      {
        id: to("3"),
        name: "Test Bookshelf"
      },
      {
        id: to("4"),
        name: "Test Bookshelf"
      }
    ]);
  };
  var getBooks = async (id) => {
    if (id === to("1")) {
      return Ok(BOOKS);
    }
    if (id === to("2")) {
      return Ok(BOOKS);
    }
    if (id === to("3")) {
      return Ok(BOOKS);
    }
    if (id === to("4")) {
      return Ok(BOOKS);
    }
    return Err(new Error("Method not implemented."));
  };

  // src/service-worker.ts
  var fetchHandler = (() => {
    const responseApi = (data) => {
      return Response.json({ data }, { status: 200 });
    };
    const responseError = (status, code, message) => {
      return Response.json({ code, message }, { status });
    };
    const responseNotFound = (message) => responseError(404, "NOT_FOUND", message);
    const responseInternal = (message) => responseError(500, "INTERNAL_SERVER_ERROR", message);
    const intoResponse = (result) => result.match({
      ok: (value) => responseApi(value),
      err: (error) => responseInternal(error.message)
    });
    const bookshelves = async (request, _) => {
      if (request.method === "GET") {
        return intoResponse(await getBookshelves());
      }
      return responseNotFound("");
    };
    const bookshelf = async (request, params) => {
      if (params == null) {
        return responseNotFound("");
      }
      if (typeof params.id === "string") {
        if (request.method === "GET") {
          return intoResponse(await getBooks(to(params.id)));
        }
      }
      return responseNotFound("");
    };
    const handlers = [
      [
        new path_default("/api/bookshelves"),
        bookshelves
      ],
      [
        new path_default("/api/bookshelves/:id"),
        bookshelf
      ]
    ];
    return async (request) => {
      const url = new URL(request.url);
      if (url.hostname === self.location.hostname) {
        for (const [path, handler] of handlers) {
          const parsed = path.test(url.pathname);
          if (parsed == null) {
            continue;
          }
          return handler(request, parsed);
        }
      }
      return fetch(request);
    };
  })();
  self.addEventListener("activate", () => {
    self.clients.claim();
  });
  self.addEventListener("fetch", (event) => {
    event.respondWith(fetchHandler(event.request));
  });
  self.addEventListener("install", (_event) => {
    self.skipWaiting();
  });
  self.addEventListener("message", (_event) => {
  });
})();
//# sourceMappingURL=service-worker.js.map
