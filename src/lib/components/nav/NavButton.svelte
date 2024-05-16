<script lang="ts">
    import { Link } from "svelte-routing";

    export let count: number | null = null;
    export let color: "orange" | "red" | "green" | "blue" = "orange";
    export let to;

    let colorClasses: string;
    switch (color) {
        case "orange":
            colorClasses = "bg-orange-500";
            break;
        case "red":
            colorClasses = "bg-red-500";
            break;
        case "green":
            colorClasses = "bg-green-500";
            break;
        case "blue":
            colorClasses = "bg-blue-500";
            break;
    }
</script>

<Link to={to}>
    <div class="flex flex-col space-y-2 rounded-md border border-transparent bg-accent text-accent-foreground hover:bg-transparent hover:border hover:border-input p-2">
        <div class="flex flex-row">
            <div class="flex flex-grow">
                <div class={"rounded-full p-1 " + colorClasses}><slot name="icon"></slot></div>
            </div>
            {#if count != null}<p class="text-sm font-bold leading-none">{count}</p>{/if}
        </div>
        <div class="">
            <p class="text-sm font-bold leading-none"><slot></slot></p>
        </div>
    </div>
</Link>
