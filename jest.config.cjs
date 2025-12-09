module.exports = {
  	preset: 'ts-jest/presets/default-esm',
  	testEnvironment: 'node',

  	transform: {
  	  '^.+\\.ts$': [
  	    'ts-jest',
  	    {
  	      useESM: true,
  	    },
  	  ],
  	},

  	extensionsToTreatAsEsm: ['.ts'],

  	moduleFileExtensions: ['ts', 'js', 'json', 'node'],

  	moduleNameMapper: {
		"^@/root/(.*)\\.js$": "<rootDir>/$1.ts",
		"^@/src/(.*)\\.js$": "<rootDir>/src/$1.ts",
		"^@/dtos/(.*)\\.js$": "<rootDir>/src/dtos/$1.ts",
		"^@/middlewares/(.*)\\.js$": "<rootDir>/src/middleware/$1.ts",
		"^@/errors/(.*)\\.js$": "<rootDir>/src/errors/$1.ts",
		"^@/controllers/(.*)\\.js$": "<rootDir>/src/controllers/$1.ts",
		"^@/services/(.*)\\.js$": "<rootDir>/src/services/$1.ts",
		"^@/utils/(.*)\\.js$": "<rootDir>/src/utils/$1.ts",
		"^@/types/(.*)\\.js$": "<rootDir>/src/types/$1.ts"
	},

	testPathIgnorePatterns: ["/node_modules/", "/.next/", "/dist/"],
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts", "<rootDir>/singleton.ts"],
};
