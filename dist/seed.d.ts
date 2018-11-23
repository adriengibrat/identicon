export declare type Shape = {
    [key: string]: number | [number, number] | [number, number, (x: any) => number];
};
declare type Seed<S> = {
    [key in keyof S]: number;
};
export declare const seed: <S = Shape>(shape: S, { hash, scale }?: {
    hash?: (string: any, init?: number) => number;
    scale?: (n: any, rangemax: any, rangemin?: number) => number;
}) => (source: string) => Seed<S>;
export {};
