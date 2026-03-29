# Dev Log — 2026-03-28

## Tarefa #21 — Infraestrutura completa de QA e qualidade de código

**Status:** Concluída  
**Prioridade:** Alta  
**Dependências:** Tasks #1, #19

---

### Contexto

Configuração do ambiente de QA para o projeto `@eufelipe/agent-skills`, um CLI para instalação de skills padronizadas em ferramentas de agentes de IA (Cursor, Claude Code, Obsidian, MCP). O projeto usa ES Modules (`"type": "module"`), Node.js >= 18 e está em fase inicial de implementação.

---

### Subtarefa 21.1 — Framework de testes automatizados (Vitest)

**Commit:** `0232cd4`

**O que foi feito:**
- Instaladas dependências: `vitest`, `@vitest/ui`, `@vitest/coverage-v8`, `@types/node`
- Criado `vitest.config.js` com ambiente `node`, `globals: true` e cobertura via `v8`
- Criada estrutura de diretórios: `tests/unit/`, `tests/integration/`, `tests/e2e/`
- Criado `tests/unit/example.test.js` como teste de validação do setup
- Adicionados scripts ao `package.json`: `test`, `test:unit`, `test:integration`, `test:e2e`, `test:coverage`, `test:watch`, `test:ui`

**Resultado:** `npm run test:unit` — 2 testes passando ✅

---

### Subtarefa 21.2 — Prettier para formatação de código

**Commit:** `5bb7678`

**O que foi feito:**
- Instalado `prettier` como devDependency
- Criado `.prettierrc`:
  ```json
  { "semi": true, "trailingComma": "es5", "singleQuote": true, "printWidth": 80, "tabWidth": 2, "useTabs": false, "arrowParens": "avoid" }
  ```
- Criado `.prettierignore` excluindo: `node_modules`, `dist`, `build`, `coverage`, `*.md`, `package-lock.json`, `.git`, `.taskmaster`
- Scripts `format` e `format:check` já incluídos no `package.json`

**Resultado:** `npm run format:check` — sem erros de formatação ✅

---

### Subtarefa 21.3 — TypeScript strict type checking

**Commit:** `0f6699d`

**O que foi feito:**
- Instalado `typescript` (v6.0.2) como devDependency
- Criado `tsconfig.json` com:
  - `allowJs: true`, `checkJs: true` — valida JavaScript existente
  - `strict: true` — modo estrito
  - `noEmit: true` — apenas validação, sem transpilação
  - `moduleResolution: bundler` — compatível com TypeScript 6
  - `include: ["src/**/*", "bin/**/*"]`
- Criado `src/index.js` como placeholder para que o tsc tenha inputs
- Script `type-check` usa flag `--project tsconfig.json` explicitamente

**Observação:** TypeScript 6 mudou o comportamento padrão de `moduleResolution`. Usar `bundler` é o modo recomendado para projetos com bundlers ou Node moderno com ES Modules.

**Resultado:** `npm run type-check` — sem erros de tipo ✅

---

### Subtarefa 21.4 — ESLint + Husky + lint-staged

**Commit:** `f21e829`

**O que foi feito:**
- Instaladas dependências: `eslint` (v10), `eslint-config-prettier`, `eslint-plugin-prettier`, `husky`, `lint-staged`
- Criado `eslint.config.js` usando **flat config** (formato obrigatório no ESLint 10):
  - Regras aplicadas em `src/**/*.js` e `bin/**/*.js`
  - Integração com Prettier via `eslint-config-prettier` + `eslint-plugin-prettier`
  - `no-unused-vars` com `argsIgnorePattern: ^_`
  - Globals Node.js declarados explicitamente
- Husky inicializado com `npx husky init`
- Hook `.husky/pre-commit` executando `npm run pre-commit` (lint-staged)
- Configuração `lint-staged` no `package.json`:
  - `*.js` → eslint --fix + prettier --write
  - `*.{json,md}` → prettier --write
- Flag `--no-error-on-unmatched-pattern` nos scripts de lint para compatibilidade com diretórios vazios em fase inicial

**Observação:** ESLint 10 usa flat config (`eslint.config.js`) e não suporta mais `.eslintrc.json`. A integração com Prettier foi feita via `eslint-config-prettier` (desativa regras conflitantes) + `eslint-plugin-prettier` (reporta diferenças como erros de lint).

**Resultado:** Hook pre-commit rodou automaticamente no commit — lint-staged passou em todos os arquivos ✅

---

### Validação final

```bash
npm run validate
# → npm run lint        ✅
# → npm run type-check  ✅
# → npm run test:coverage ✅ (2 testes, cobertura gerada em ./coverage/)
```

---

### Decisões técnicas relevantes

| Decisão | Motivo |
|---|---|
| Vitest em vez de Jest | Suporte nativo a ES Modules, mais rápido, sem configuração extra para `"type": "module"` |
| ESLint flat config | ESLint 10 removeu suporte a `.eslintrc`; flat config é o formato atual |
| `moduleResolution: bundler` no tsconfig | TypeScript 6 exige uma resolução explícita; `bundler` é a escolha certa para projetos ES Module modernos |
| `--no-error-on-unmatched-pattern` no lint | `src/` e `bin/` ainda estão em construção; evita falha no CI por diretórios vazios |

---

### Arquivos criados/modificados

```
vitest.config.js          — configuração do Vitest
tsconfig.json             — configuração do TypeScript
eslint.config.js          — configuração do ESLint (flat config)
.prettierrc               — configuração do Prettier
.prettierignore           — arquivos ignorados pelo Prettier
.husky/pre-commit         — hook de pre-commit
src/index.js              — placeholder de entrada (para type-check)
tests/unit/example.test.js — teste de validação do setup
package.json              — scripts e devDependencies atualizados
```
