module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 60000,
  moduleNameMapper: {
    '@utils/(.*)': '<rootDir>/src/utils/$1',
    '@user-module/(.*)': '<rootDir>/src/module/user/$1',
    '@chat-module/(.*)': '<rootDir>/src/module/chat/$1',
    '@root/(.*)': '<rootDir>/src/$1',
  },
};
