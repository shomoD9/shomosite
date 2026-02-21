/*
 * This file loads shared test assertions and DOM helpers for every Vitest suite.
 * It is separated to keep individual test files focused on behavior rather than boilerplate setup.
 * Vitest imports it once before running tests declared in tests/.
 */
import "@testing-library/jest-dom/vitest";
