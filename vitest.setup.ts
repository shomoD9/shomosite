/*
 * This file installs the small browser-like shims that our tests rely on.
 * It is isolated so environment setup happens once instead of being repeated in every suite.
 * Vitest loads it before the actual assertions in `tests/unit` and `tests/integration`.
 */

import "@testing-library/jest-dom/vitest";

class IntersectionObserverMock {
  observe(): void {
    // The reveal components only need the observer API to exist during tests.
  }

  unobserve(): void {
    // We keep the mock minimal because the tests assert rendered structure, not scrolling physics.
  }

  disconnect(): void {
    // Disconnect is part of the browser contract, so the mock exposes it for cleanup paths.
  }
}

Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  value: IntersectionObserverMock
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false
  })
});
