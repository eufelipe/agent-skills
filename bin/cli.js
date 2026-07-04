#!/usr/bin/env node
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Command } from 'commander';
import chalk from 'chalk';
import { installCommand } from '../src/commands/install.js';
import { listCommand } from '../src/commands/list.js';
import { infoCommand } from '../src/commands/info.js';
import { doctorCommand } from '../src/commands/doctor.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8')
);

/** @param {unknown} error */
function handleError(error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(chalk.red(`✗ ${message}`));
  process.exitCode = 1;
}

const program = new Command();

program
  .name('eufelipe-agent-skills')
  .description(
    'CLI para instalar skills padronizadas em ferramentas de agentes'
  )
  .version(pkg.version);

program
  .command('install <skill>')
  .description('Instala uma skill em um target específico')
  .option('-t, --target <target>', 'Target (claude-code)')
  .option('-v, --vault <path>', 'Caminho do vault Obsidian')
  .option(
    '--project',
    'Instala no projeto atual (.claude/skills/) em vez de global'
  )
  .option('--force', 'Sobrescreve arquivos existentes sem confirmar')
  .action(async (skill, options) => {
    try {
      await installCommand(skill, options);
    } catch (error) {
      handleError(error);
    }
  });

program
  .command('list')
  .description('Lista skills disponíveis')
  .action(() => {
    try {
      listCommand();
    } catch (error) {
      handleError(error);
    }
  });

program
  .command('info <skill>')
  .description('Exibe informações detalhadas sobre uma skill')
  .action(skill => {
    try {
      infoCommand(skill);
    } catch (error) {
      handleError(error);
    }
  });

program
  .command('doctor')
  .description('Diagnostica problemas de configuração')
  .option('-t, --target <target>', 'Target específico para diagnosticar')
  .action(options => {
    try {
      doctorCommand(options);
    } catch (error) {
      handleError(error);
    }
  });

program.parse();
