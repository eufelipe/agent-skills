#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .name('eufelipe-agent-skills')
  .description(
    'CLI para instalar skills padronizadas em ferramentas de agentes'
  )
  .version('1.0.0');

program
  .command('install <skill>')
  .description('Instala uma skill em um target específico')
  .option('-t, --target <target>', 'Target (cursor, claude-code)')
  .option('-v, --vault <path>', 'Caminho do vault Obsidian')
  .option('-k, --api-key <key>', 'API Key do plugin Local REST API')
  .option('--with-mcp', 'Configurar MCP junto com a skill')
  .option('--global', 'Instalar globalmente (apenas claude-code)')
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
