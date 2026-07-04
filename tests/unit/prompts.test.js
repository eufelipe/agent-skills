import fs from 'fs';
import os from 'os';
import path from 'path';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('inquirer', () => ({
  default: { prompt: vi.fn() },
}));

import inquirer from 'inquirer';
import {
  promptVaultPath,
  confirmOverwrite,
  isInteractive,
} from '../../src/utils/prompts.js';

const promptMock = vi.mocked(inquirer.prompt);

/** @type {string} */
let fakeVault;

beforeEach(() => {
  promptMock.mockReset();
  fakeVault = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-skills-vault-'));
  fs.mkdirSync(path.join(fakeVault, '.obsidian'));
});

afterEach(() => {
  fs.rmSync(fakeVault, { recursive: true, force: true });
});

describe('promptVaultPath', () => {
  it('retorna o caminho resolvido quando a resposta é um vault válido', async () => {
    promptMock.mockResolvedValue({ vaultPath: fakeVault });
    await expect(promptVaultPath()).resolves.toBe(fakeVault);
  });

  it('lança quando a resposta não é um vault válido', async () => {
    promptMock.mockResolvedValue({ vaultPath: '/nao/existe' });
    await expect(promptVaultPath()).rejects.toThrow();
  });

  it('registra validate que aceita vault válido e devolve mensagem para inválido', async () => {
    promptMock.mockResolvedValue({ vaultPath: fakeVault });
    await promptVaultPath();

    const questions = promptMock.mock.calls[0][0];
    const validate = questions[0].validate;
    expect(validate).toBeTypeOf('function');
    expect(validate(fakeVault)).toBe(true);
    expect(validate('/nao/existe')).toBe('Diretório não existe');
  });
});

describe('confirmOverwrite', () => {
  it('retorna a resposta booleana do prompt', async () => {
    promptMock.mockResolvedValue({ overwrite: true });
    await expect(confirmOverwrite('/x/SKILL.md')).resolves.toBe(true);

    promptMock.mockResolvedValue({ overwrite: false });
    await expect(confirmOverwrite('/x/SKILL.md')).resolves.toBe(false);
  });

  it('pergunta citando o arquivo em conflito', async () => {
    promptMock.mockResolvedValue({ overwrite: false });
    await confirmOverwrite('/x/SKILL.md');
    const questions = promptMock.mock.calls[0][0];
    expect(questions[0].message).toContain('/x/SKILL.md');
    expect(questions[0].default).toBe(false);
  });
});

describe('isInteractive', () => {
  it('retorna um booleano derivado do TTY do processo', () => {
    expect(typeof isInteractive()).toBe('boolean');
  });
});
