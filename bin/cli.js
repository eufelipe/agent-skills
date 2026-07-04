#!/usr/bin/env node
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Command } from 'commander';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8')
);

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
  .action(_skill => {
    console.log(chalk.yellow('Comando install em desenvolvimento...'));
  });

program
  .command('list')
  .description('Lista skills disponíveis')
  .action(() => {
    console.log(chalk.yellow('Comando list em desenvolvimento...'));
  });

program
  .command('info <skill>')
  .description('Exibe informações detalhadas sobre uma skill')
  .action(_skill => {
    console.log(chalk.yellow('Comando info em desenvolvimento...'));
  });

program
  .command('doctor')
  .description('Diagnostica problemas de configuração')
  .option('-t, --target <target>', 'Target específico para diagnosticar')
  .action(() => {
    console.log(chalk.yellow('Comando doctor em desenvolvimento...'));
  });

program.parse();
