/**
 * Configuration settings for the puzzle generator
 */

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
 * Get configuration with optional overrides
 * @param overrides - Partial configuration to override defaults
 */
export function getConfig(overrides?: Partial<PuzzleConfig>): PuzzleConfig {
  return {
    generation: {
      ...DEFAULT_CONFIG.generation,
      ...overrides?.generation,
    },
    rendering: {
      ...DEFAULT_CONFIG.rendering,
      ...overrides?.rendering,
    },
    output: {
      ...DEFAULT_CONFIG.output,
      ...overrides?.output,
    },
  };
}