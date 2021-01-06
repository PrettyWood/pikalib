export interface PokemonProps {
    name: string;
    hp: number;
}
declare const _default: import("vue").ComponentOptions<import("vue").default, import("@vue/composition-api").ShallowUnwrapRef<{
    state: import("@vue/composition-api").ComputedRef<"alive" | "dead">;
}> & {
    [key: string]: unknown;
}, {}, {}, {
    name: {
        type: StringConstructor;
        required: true;
    };
    hp: {
        type: NumberConstructor;
        default: number;
        validator: (hp: number) => boolean;
    };
}, {
    name: string;
    hp: number;
} & {}> & import("vue").VueConstructor<import("vue").default> & (new (...args: any[]) => import("@vue/composition-api").ComponentRenderProxy<{
    name: string;
    hp: number;
} & {}, import("@vue/composition-api").ShallowUnwrapRef<{
    state: import("@vue/composition-api").ComputedRef<"alive" | "dead">;
}>, {
    [key: string]: unknown;
}, {}, {}, {
    name: string;
    hp: number;
} & {}, {
    hp: number;
}, true>);
export default _default;
