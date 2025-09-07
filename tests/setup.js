/**
 * Jest setup file (minimal, to satisfy setupFilesAfterEnv path)
 * Keep lightweight to avoid introducing extra dependencies or side-effects.
 */
import { jest } from '@jest/globals';

jest.setTimeout(10000);

// Optionally expose a very basic fetch mock if any tests call it.
// Commented out by default to avoid masking real usage.
// global.fetch = async () => ({ ok: true, json: async () => ({}) });
