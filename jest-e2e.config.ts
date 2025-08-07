import jestConfig from "./jest.config.ts"

export default {
    ...jestConfig,
    testEnvironment: "./prisma/prisma-test-environment.ts",
    testRegex: ".e2e.spec.ts$",
}
