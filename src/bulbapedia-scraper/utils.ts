export function processNum(num: string): number {
    const s = num.trim().substring(1); // chop off the `#`
    return Number.parseInt(s);
}
