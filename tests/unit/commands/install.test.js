import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../../../src/utils/skills.js', async importOriginal => {
  /** @type {Record<string, unknown>} */
  const original = await importOriginal();
  return { ...original, getSkill: vi.fn() };
});

import { getSkill } from '../../../src/utils/skills.js';
import { installCommand } from '../../../src/commands/install.js';

const getSkillMock = vi.mocked(getSkill);

/** @type {number | undefined} */
let savedExitCode;

beforeEach(() => {
  getSkillMock.mockReset();
  savedExitCode = process.exitCode;
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  process.exitCode = savedExitCode;
  vi.restoreAllMocks();
});

describe('installCommand', () => {
  it('propaga o throw de validateSkill quando o skill.yaml está incompleto', async () => {
    // skill existe mas sem campos obrigatórios (description/version/targets)
    getSkillMock.mockReturnValue({ name: 'quebrada' });
    await expect(installCommand('quebrada', {})).rejects.toThrow(
      "Skill inválida: campo 'description' obrigatório"
    );
  });

  it('skill inexistente seta exitCode 1 sem lançar', async () => {
    getSkillMock.mockReturnValue(null);
    await expect(installCommand('nao-existe', {})).resolves.toBeUndefined();
    expect(process.exitCode).toBe(1);
  });
});
