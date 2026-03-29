import fs from 'fs';
import path from 'path';
import { homedir } from 'os';

/** @param {string} pathStr */
export function expandPath(pathStr) {
  if (pathStr == null || String(pathStr).trim() === '') {
    throw new Error('Path inválido: vazio');
  }
  const s = String(pathStr);
  if (s === '~') {
    return homedir();
  }
  if (s.startsWith('~/')) {
    return path.join(homedir(), s.slice(2));
  }
  return path.resolve(s);
}

/** @param {string} vaultPath */
export function existsAndIsObsidianVault(vaultPath) {
  if (vaultPath == null || String(vaultPath).trim() === '') {
    return { valid: false, message: 'Caminho do vault não informado' };
  }

  let resolved;
  try {
    resolved = expandPath(String(vaultPath));
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Path inválido';
    return { valid: false, message: msg };
  }

  try {
    if (!fs.existsSync(resolved)) {
      return { valid: false, message: 'Diretório não existe' };
    }
    const st = fs.statSync(resolved);
    if (!st.isDirectory()) {
      return { valid: false, message: 'Caminho não é um diretório' };
    }
  } catch (e) {
    if (e && typeof e === 'object' && 'code' in e && e.code === 'EACCES') {
      return { valid: false, message: 'Sem permissão para acessar o caminho' };
    }
    return { valid: false, message: 'Erro ao acessar o caminho' };
  }

  const hasObsidianDir = fs.existsSync(path.join(resolved, '.obsidian'));
  const hasConventions = fs.existsSync(path.join(resolved, 'CONVENTIONS.md'));

  if (!hasObsidianDir && !hasConventions) {
    return {
      valid: false,
      message:
        'Diretório não parece ser um vault Obsidian (falta .obsidian/ ou CONVENTIONS.md)',
    };
  }

  return { valid: true, path: resolved };
}
