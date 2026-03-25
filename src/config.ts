/**
 * Configuration settings for the puzzle generator
 */

/**
 * Recursively makes all properties optional, including nested objects.
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/**
 * Deep-merges `override` into `base`, recursively merging nested objects.
 */
function deepMerge<T extends object>(base: T, override: DeepPartial<T>): T {
  const result = { ...base } as T;
  for (const key of Object.keys(override) as Array<keyof T>) {
    const overrideVal = override[key];
    const baseVal = base[key];
    if (
      overrideVal !== undefined &&
      overrideVal !== null &&
      typeof overrideVal === 'object' &&
      !Array.isArray(overrideVal) &&
      typeof baseVal === 'object' &&
      baseVal !== null
    ) {
      result[key] = deepMerge(baseVal as object, overrideVal as DeepPartial<object>) as T[keyof T];
    } else if (overrideVal !== undefined) {
      result[key] = overrideVal as T[keyof T];
    }
  }
  return result;
}

export interface PuzzleConfig {
  generation: {
    defaultSize: {
      rows: number;
      cols: number;
    };
    pathLength: number;
    maxGridSize: number;
  };
  rendering: {
    cellSize: number;
    strokeWidth: number;
    strokeColor: string;
    fontSize: number;
    fontFamily: string;
  };
  output: {
    defaultFilename: string;
    format: 'svg' | 'json';
  };
}

export const DEFAULT_CONFIG: PuzzleConfig = {
  generation: {
    defaultSize: {
      rows: 4,
      cols: 4,
    },
    pathLength: 6,
    maxGridSize: 100, // Prevent resource exhaustion
  },
  rendering: {
    cellSize: 50,
    strokeWidth: 2,
    strokeColor: 'black',
    fontSize: 24,
    fontFamily: 'sans-serif',
  },
  output: {
    defaultFilename: 'complete.svg',
    format: 'svg',
  },
};

/**
 * Get configuration with optional deep-partial overrides.
 * Nested objects are merged recursively, so partial overrides
 * (e.g. only `defaultSize.rows`) preserve sibling values.
 * @param overrides - Deep-partial configuration to override defaults
 */
export function getConfig(overrides?: DeepPartial<PuzzleConfig>): PuzzleConfig {
  if (!overrides) {
    return { ...DEFAULT_CONFIG, generation: { ...DEFAULT_CONFIG.generation, defaultSize: { ...DEFAULT_CONFIG.generation.defaultSize } } };
  }
  return deepMerge(DEFAULT_CONFIG, overrides);
}