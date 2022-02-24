export function setReadOnlyProperty<
O extends Record<string, any>,
P extends keyof O,
V extends any
>(object: O, property: P, value: V) {
    Object.defineProperty(object, property, {
        value,
        configurable: true
    })
}