/**
 * Permite comparar dos Sets para ver si contienen los mismos elementos
 * @param a Primer Set
 * @param b Segundo Set
 */
export function isSetsEqual(a: Set<string>, b: Set<string>) {
    return a.size === b.size && [...a].every(value => b.has(value));
}