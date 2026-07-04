import inquirer from 'inquirer';
import { existsAndIsObsidianVault } from './validate.js';

/**
 * Prompts interativos exigem TTY — inquirer trava/quebra em pipes e CI.
 */
export function isInteractive() {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

/**
 * Pergunta o caminho do vault Obsidian e valida antes de aceitar.
 * Retorna o caminho já resolvido (~ expandido, absoluto).
 */
export async function promptVaultPath() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'vaultPath',
      message: 'Qual o caminho do seu vault Obsidian?',
      /** @param {string} input */
      validate: input => {
        const result = existsAndIsObsidianVault(input);
        return result.valid ? true : (result.message ?? 'Caminho inválido');
      },
    },
  ]);
  const result = existsAndIsObsidianVault(String(answers.vaultPath));
  if (!result.valid || !result.path) {
    throw new Error(result.message ?? 'Vault inválido');
  }
  return result.path;
}

/**
 * Confirmação de sobrescrita de arquivo existente (default: não).
 *
 * @param {string} filePath
 */
export async function confirmOverwrite(filePath) {
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'overwrite',
      message: `Já existe ${filePath}. Sobrescrever?`,
      default: false,
    },
  ]);
  return Boolean(answers.overwrite);
}
