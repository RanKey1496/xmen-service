export function isSetsEqual(a: Set<string>, b: Set<string>) {
    return a.size === b.size && [...a].every(value => b.has(value));
};