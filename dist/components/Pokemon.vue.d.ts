export interface PokemonProps {
    name: string;
    hp: number;
}
declare const _default: import("vue").DefineComponent<{
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
    state: import("vue").ComputedRef<"alive" | "dead">;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    name: string;
    hp: number;
} & {}>, {
    hp: number;
}>;
export default _default;
