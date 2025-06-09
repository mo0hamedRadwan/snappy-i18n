// I will removed utils functions from here and add them in single package in the future
export function isObject(value: any): boolean {
  return value && typeof value === "object" && !Array.isArray(value);
}
export function isString(value: any): boolean {
  return value && typeof value === "string";
}

export function isNumber(value: any): boolean {
  return value && typeof value === "number" && !Number.isNaN(value);
}

export function isBoolean(value: any): boolean {
  return value === true || value === false;
}

export function isFunction(value: any): boolean {
  return value && typeof value === "function";
}

export function isArray(value: any): boolean {
  return value && Array.isArray(value);
}

export function isEmpty(value: any): boolean {
  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }
  if (isArray(value)) {
    return value.length === 0;
  }
  return !value && value !== 0 && value !== false;
}

export function isDefined(value: any): boolean {
  return value !== undefined && value !== null;
}

export function isUndefined(value: any): boolean {
  return value === undefined;
}

export function isNull(value: any): boolean {
  return value === null;
}

export function isNullOrUndefined(value: any): boolean {
  return isUndefined(value) || isNull(value);
}

/////////////////////////////////////////////////////////////////////////////////////////////
export function shallowMerge<T extends object, U extends object>(target: T, source: U): T & U {
  return { ...target, ...source };
}

export function deepMerge<T extends object, U extends object>(target: T, source: U): T & U {
  const result = { ...target } as Record<string, any>;

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const targetValue = result[key];
      const sourceValue = (source as Record<string, any>)[key];

      if (typeof targetValue === "object" && typeof sourceValue === "object") {
        if (Array.isArray(targetValue) || Array.isArray(sourceValue)) {
          result[key] = Array.isArray(targetValue) ? [...targetValue] : [];
          if (Array.isArray(sourceValue)) {
            result[key].push(...sourceValue);
          }
        } else if (targetValue === null || sourceValue === null) {
          result[key] = targetValue === null ? sourceValue : targetValue;
        } else {
          result[key] = deepMerge(targetValue, sourceValue);
        }
      } else {
        result[key] = sourceValue;
      }
    }
  }

  return result as T & U;
}

export function merge<T extends object, U extends object>(target: T, source: U, strategy: "shallow" | "deep" = "shallow"): T & U {
  if (strategy === "deep") {
    return deepMerge(target, source);
  }
  return shallowMerge(target, source);
}

export function mergeArray<T>(target: T[], source: T[]): T[] {
  const result = [...target];
  source.forEach((item) => {
    if (!result.includes(item)) {
      result.push(item);
    }
  });
  return result;
}
