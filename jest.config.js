module.exports = {
   preset: 'ts-jest',
   testEnvironment: 'node',
   testTimeout: 60000,
   moduleNameMapper: {
      '@root/(.*)': '<rootDir>/src/$1',
      '@user-module/(.*)': '<rootDir>/src/module/user/$1',
      '@utils/(.*)': '<rootDir>/src/utils/$1',
   },
};
