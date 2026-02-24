/*
 * This file loads shared test assertions and DOM helpers for every Vitest suite.
 * It is separated to keep individual test files focused on behavior rather than boilerplate setup.
 * Vitest imports it once before running tests declared in tests/.
 */
import "@testing-library/jest-dom/vitest";

// GSAP ScrollTrigger calls window.matchMedia at module scope.
// JSDOM doesn't implement it, so we polyfill a no-op version.
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
    }))
});
