module.exports = {
    preset: "ts-jest",
    roots: ["<rootDir>/src"],
    collectCoverageFrom: [
        "<rootDir>/src/**/*.ts",
        "!<rootDir>/src/**/*.spec.ts",
    ],
    coverageDirectory: "coverage",
    testEnvironment: "node",
    transform: {
        ".+\\.spec.ts$": "ts-jest",
    },
    moduleNameMapper: {
        "@/(.*)$": "<rootDir>/src/$1",
    },
}
