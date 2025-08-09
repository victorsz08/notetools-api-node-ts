export default {
    preset: "ts-jest",
    roots: ["<rootDir>/src"],
    collectCoverageFrom: [
        "<rootDir>/src/**/*.ts",
        "!<rootDir>/src/**/*.spec.ts",
    ],
    testEnvironment: "./prisma/prisma-test-environment.ts",
    coverageDirectory: "coverage",
    transform: {
        ".+\\.spec.ts$": "ts-jest",
    },
    moduleNameMapper: {
        "@/(.*)$": "<rootDir>/src/$1",
    },
}
