# Puzzle Generator

A TypeScript-based puzzle generator that creates grid-based number puzzles with directional arrows, output as SVG.

## Features

- Generate customizable grid puzzles with configurable dimensions
- SVG output format for scalable graphics
- Type-safe TypeScript implementation
- Comprehensive test coverage
- Input validation and error handling
- Configurable puzzle parameters

## Installation

```bash
npm install
```

## Usage

### Basic Usage

```bash
# Build the project
npm run prestart

# Generate a puzzle with default size (4x4)
npm start

# Generate a puzzle with custom dimensions
node built/app.js 10 10
```

### Command Line Options

```bash
node built/app.js [rows] [cols]
```

- `rows`: Number of rows (3-100, default: 4)
- `cols`: Number of columns (3-100, default: 4)

### Examples

```bash
# Generate 4x4 puzzle (default)
node built/app.js

# Generate 8x8 puzzle  
node built/app.js 8 8

# Generate 10x5 puzzle
node built/app.js 10 5
```

## Development

### Running Tests

```bash
npm test
```

### Building

```bash
npm run prestart
```

### Configuration

The puzzle generator uses a configuration system that allows customization of generation parameters, rendering settings, and output options. See `src/config.ts` for available options.

## Project Structure

```
src/
├── app.ts          # Main CLI application
├── config.ts       # Configuration management
├── puzzle.ts       # Core puzzle generation logic
├── grid.ts         # Grid data structures and utilities
├── draw.ts         # SVG rendering
├── util.ts         # Utility functions
└── test/          # Test suite
    ├── config.test.ts
    ├── grid.test.ts
    └── puzzle.test.ts
```

## Architecture

This project follows a layered architecture with clear separation of concerns:

- **Core Logic**: Puzzle generation algorithms (`puzzle.ts`)
- **Data Model**: Grid structures and operations (`grid.ts`) 
- **Presentation**: SVG rendering (`draw.ts`)
- **Configuration**: Centralized settings management (`config.ts`)
- **Interface**: CLI application wrapper (`app.ts`)

For detailed architecture analysis and improvement recommendations, see [ARCHITECTURE_ASSESSMENT.md](./ARCHITECTURE_ASSESSMENT.md).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Ensure all tests pass (`npm test`)
5. Submit a pull request

## License

This project is open source and available under the MIT License.
