"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const ResultsParser_1 = __importDefault(require("../src/ResultsParser"));
test_1.test.describe('CLI Mode Retry Threading Fix', () => {
    (0, test_1.test)('parseTests calculates effective retries correctly for CLI mode flaky tests', async () => {
        const resultsParser = new ResultsParser_1.default();
        // Test data representing a flaky test (failed on retry 0, passed on retry 1)
        const mockSpecs = [
            {
                title: 'Flaky Test',
                tests: [
                    {
                        projectName: 'chrome',
                        results: [
                            {
                                retry: 0,
                                status: 'failed',
                                duration: 1000,
                                startTime: '2023-01-01T00:00:00.000Z',
                                error: {
                                    snippet: 'Flaky test failed on first attempt',
                                    stack: 'Error: Assertion failed\n    at test.js:10:5',
                                },
                            },
                            {
                                retry: 1,
                                status: 'passed',
                                duration: 1000,
                                startTime: '2023-01-01T00:00:01.000Z',
                            },
                        ],
                    },
                ],
            },
        ];
        // Parse with global retries = 1 (simulating CLI mode)
        const testResults = await resultsParser.parseTests('Test Suite', mockSpecs, 1);
        // Verify effective retries are calculated correctly
        (0, test_1.expect)(testResults).toHaveLength(2);
        // Failed attempt should have effective retries = 1 (max of actual retry 1, global 1)
        const failedResult = testResults.find((r) => r.retry === 0);
        (0, test_1.expect)(failedResult).toBeDefined();
        (0, test_1.expect)(failedResult.retries).toBe(1);
        (0, test_1.expect)(failedResult.status).toBe('failed');
        // Passed attempt should also have effective retries = 1
        const passedResult = testResults.find((r) => r.retry === 1);
        (0, test_1.expect)(passedResult).toBeDefined();
        (0, test_1.expect)(passedResult.retries).toBe(1);
        (0, test_1.expect)(passedResult.status).toBe('passed');
        // Now test the integration with parseTestSuite to verify getFailures behavior
        await resultsParser.parseTestSuite({
            title: 'Test Suite',
            specs: mockSpecs,
        }, 1);
        const failures = await resultsParser.getFailures();
        // Flaky test failure should be excluded because retry (0) !== retries (1)
        const flakyFailure = failures.find((f) => f.test === 'Flaky Test');
        (0, test_1.expect)(flakyFailure).toBeUndefined();
    });
    (0, test_1.test)('parseTests identifies test that failed on final retry', async () => {
        const resultsParser = new ResultsParser_1.default();
        // Test data representing a test that failed on its final retry
        const mockSpecs = [
            {
                title: 'Eventually Failed Test',
                tests: [
                    {
                        projectName: 'chrome',
                        results: [
                            {
                                retry: 0,
                                status: 'failed',
                                duration: 1000,
                                startTime: '2023-01-01T00:00:00.000Z',
                                error: {
                                    snippet: 'First failure',
                                    stack: 'Error: First failure',
                                },
                            },
                            {
                                retry: 1,
                                status: 'failed',
                                duration: 1000,
                                startTime: '2023-01-01T00:00:01.000Z',
                                error: {
                                    snippet: 'Final failure',
                                    stack: 'Error: Final failure',
                                },
                            },
                        ],
                    },
                ],
            },
        ];
        await resultsParser.parseTestSuite({
            title: 'Retry Suite',
            specs: mockSpecs,
        }, 1);
        const failures = await resultsParser.getFailures();
        // Should include the test that failed on its final retry (retry 1, retries = 1)
        (0, test_1.expect)(failures).toHaveLength(1);
        (0, test_1.expect)(failures[0].test).toBe('Eventually Failed Test [chrome]');
        (0, test_1.expect)(failures[0].suite).toBe('Retry Suite');
        (0, test_1.expect)(failures[0].failureReason).toContain('Final failure');
    });
    (0, test_1.test)('parseTests uses global retries when higher than actual retries', async () => {
        const resultsParser = new ResultsParser_1.default();
        // Test data with global retries higher than actual attempts
        const mockSpecs = [
            {
                title: 'Test That Passed First Try',
                tests: [
                    {
                        projectName: 'chrome',
                        results: [
                            {
                                retry: 0,
                                status: 'passed',
                                duration: 1000,
                                startTime: '2023-01-01T00:00:00.000Z',
                            },
                        ],
                    },
                ],
            },
        ];
        const testResults = await resultsParser.parseTests('Test Suite', mockSpecs, 3);
        // Should use global retries (3) since it's higher than max retry attempt (0)
        (0, test_1.expect)(testResults).toHaveLength(1);
        (0, test_1.expect)(testResults[0].retries).toBe(3);
        (0, test_1.expect)(testResults[0].retry).toBe(0);
        (0, test_1.expect)(testResults[0].status).toBe('passed');
        // Test with parseTestSuite to verify getFailures behavior
        await resultsParser.parseTestSuite({
            title: 'Test Suite',
            specs: mockSpecs,
        }, 3);
        // Verify no failures (test passed)
        const failures = await resultsParser.getFailures();
        (0, test_1.expect)(failures).toHaveLength(0);
    });
    (0, test_1.test)('parseTests handles empty results array gracefully', async () => {
        const resultsParser = new ResultsParser_1.default();
        // Test data with empty results array
        const mockSpecs = [
            {
                title: 'Test With No Results',
                tests: [
                    {
                        projectName: 'chrome',
                        results: [], // Empty results array
                    },
                ],
            },
        ];
        // This should not throw an error and should handle empty results gracefully
        const testResults = await resultsParser.parseTests('Test Suite', mockSpecs, 1);
        (0, test_1.expect)(testResults).toHaveLength(0); // No test results should be created
        // Test with parseTestSuite as well
        await resultsParser.parseTestSuite({
            title: 'Test Suite',
            specs: mockSpecs,
        }, 1);
        const failures = await resultsParser.getFailures();
        (0, test_1.expect)(failures).toHaveLength(0);
    });
});
//# sourceMappingURL=CLI_RetryThreading.spec.js.map