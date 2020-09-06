namespace MapUtility {
  export function ToPlainObject<TValue>(map: Map<string, TValue>): { [key: string]: TValue };
  export function ToPlainObject<TKey, TValue>(map: Map<TKey, TValue>, keySelector: (key: TKey) => string): { [key: string]: TValue };
  export function ToPlainObject<TKey, TValue, TProperty>(map: Map<TKey, TValue>, keySelector: (key: TKey) => string, valueSelector: (value: TValue) => TProperty): { [key: string]: TProperty };
  export function ToPlainObject<TKey, TValue, TProperty>(map: Map<TKey, TValue>, keySelector?: (key: TKey) => string, valueSelector?: (value: TValue) => TProperty): { [key: string]: TProperty } {
    const obj: { [_key: string]: TProperty } = {};

    for (const ety of map.entries()) {
      const srcKey = ety[0];
      const destKey: string = keySelector ? keySelector(srcKey) : (srcKey as unknown as string);

      const srcVal = ety[1];
      const destVal: TProperty = valueSelector ? valueSelector(srcVal) : (srcVal as unknown as TProperty);

      obj[destKey] = destVal;
    }

    return obj;
  }
}

export default MapUtility;
