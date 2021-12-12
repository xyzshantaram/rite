declare module 'macrolight/dist/macrolight.esm' {
    export const HL_KEYWORDS: Record<string, string[]>;
    export function highlight(src: Element | string, config?: Record<string, any>): string;
}