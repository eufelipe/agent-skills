import * as claudeCode from './claude-code.js';

/**
 * Registry de adapters por target.
 * v1.1: adicionar `cursor` aqui (gera .cursor/rules/<skill>.mdc).
 */
export const adapters = {
  'claude-code': claudeCode,
};

export const DEFAULT_TARGET = 'claude-code';

/** @param {string} target */
export function getAdapter(target) {
  return adapters[/** @type {keyof typeof adapters} */ (target)] ?? null;
}

export function listTargets() {
  return Object.keys(adapters);
}
