import { describe, it } from 'mocha';
import { expect } from 'chai';
import { getConfig, DEFAULT_CONFIG } from '../config';

describe('config', () => {
    describe('getConfig', () => {
        it('should return default configuration when no overrides provided', () => {
            const config = getConfig();
            expect(config).to.deep.equal(DEFAULT_CONFIG);
        });

        it('should override generation settings', () => {
            const config = getConfig({
                generation: {
                    defaultSize: { rows: 10, cols: 10 },
                    pathLength: 8,
                    maxGridSize: 50
                }
            });

            expect(config.generation.defaultSize.rows).to.equal(10);
            expect(config.generation.defaultSize.cols).to.equal(10);
            expect(config.generation.pathLength).to.equal(8);
            expect(config.generation.maxGridSize).to.equal(50);
            // Other settings should remain default
            expect(config.rendering).to.deep.equal(DEFAULT_CONFIG.rendering);
            expect(config.output).to.deep.equal(DEFAULT_CONFIG.output);
        });

        it('should override rendering settings', () => {
            const config = getConfig({
                rendering: {
                    cellSize: 100,
                    strokeWidth: 4,
                    strokeColor: 'blue',
                    fontSize: 32,
                    fontFamily: 'Arial'
                }
            });

            expect(config.rendering.cellSize).to.equal(100);
            expect(config.rendering.strokeColor).to.equal('blue');
            // Other sections should remain default
            expect(config.generation).to.deep.equal(DEFAULT_CONFIG.generation);
            expect(config.output).to.deep.equal(DEFAULT_CONFIG.output);
        });

        it('should override output settings', () => {
            const config = getConfig({
                output: {
                    defaultFilename: 'test.svg',
                    format: 'json' as const
                }
            });

            expect(config.output.defaultFilename).to.equal('test.svg');
            expect(config.output.format).to.equal('json');
            // Other sections should remain default
            expect(config.generation).to.deep.equal(DEFAULT_CONFIG.generation);
            expect(config.rendering).to.deep.equal(DEFAULT_CONFIG.rendering);
        });

        it('should handle partial overrides within sections', () => {
            const config = getConfig({
                generation: {
                    ...DEFAULT_CONFIG.generation,
                    pathLength: 10
                }
            });

            expect(config.generation.pathLength).to.equal(10);
            // Other generation settings should remain default
            expect(config.generation.defaultSize).to.deep.equal(DEFAULT_CONFIG.generation.defaultSize);
            expect(config.generation.maxGridSize).to.equal(DEFAULT_CONFIG.generation.maxGridSize);
        });
    });

    describe('DEFAULT_CONFIG', () => {
        it('should have reasonable default values', () => {
            expect(DEFAULT_CONFIG.generation.defaultSize.rows).to.be.greaterThan(0);
            expect(DEFAULT_CONFIG.generation.defaultSize.cols).to.be.greaterThan(0);
            expect(DEFAULT_CONFIG.generation.pathLength).to.be.greaterThan(0);
            expect(DEFAULT_CONFIG.generation.maxGridSize).to.be.greaterThan(DEFAULT_CONFIG.generation.defaultSize.rows);
            
            expect(DEFAULT_CONFIG.rendering.cellSize).to.be.greaterThan(0);
            expect(DEFAULT_CONFIG.rendering.strokeWidth).to.be.greaterThan(0);
            expect(DEFAULT_CONFIG.rendering.fontSize).to.be.greaterThan(0);
            expect(DEFAULT_CONFIG.rendering.strokeColor).to.be.a('string').that.is.not.empty;
            expect(DEFAULT_CONFIG.rendering.fontFamily).to.be.a('string').that.is.not.empty;
            
            expect(DEFAULT_CONFIG.output.defaultFilename).to.be.a('string').that.is.not.empty;
            expect(['svg', 'json']).to.include(DEFAULT_CONFIG.output.format);
        });
    });
});