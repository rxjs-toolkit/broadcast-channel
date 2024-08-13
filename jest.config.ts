import type { JestConfigWithTsJest } from 'ts-jest/dist/types';

const config: JestConfigWithTsJest = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	setupFiles: ['<rootDir>/jest.setup.ts', '<rootDir>/mocks/index.ts'],
	watchPlugins: [
		'jest-watch-typeahead/filename',
		'jest-watch-typeahead/testname',
	],
	globals: {
		'ts-jest': {
			diagnostics: Boolean(process.env.CI),
			babelConfig: false,
			tsconfig: '<rootDir>/tests/tsconfig.json',
		},
	},
};

export default config;
