---
created_at: 2026-03-28
created_by: atlas
type: reference
domain: produto
status: active
project: "[[eufelipe-agent-skills]]"
subject: [prd, cli, agent-skills]
---

# PRD: eufelipe-agent-skills (MVP)

## Visão Geral

### Problema

Desenvolvedores que usam agentes de IA (Claude Code, Cursor, OpenClaw) precisam configurar instruções específicas para cada ferramenta quando querem que o agente interaja com sistemas externos como Obsidian vaults, convenções de projeto, ou fluxos de trabalho.

**Dores:**
- Cada ferramenta tem formato diferente (`.cursor/rules/`, `CLAUDE.md`, `~/.openclaw/skills/`)
- Copiar/colar instruções manualmente é tedioso e propenso a erro
- Não existe padrão para compartilhar "skills" entre projetos e ferramentas
- Atualizar instruções em múltiplos projetos é trabalhoso

### Solução

CLI que instala skills padronizadas em qualquer ferramenta de agente, adaptando automaticamente o formato.

### Proposta de Valor

> "Instale uma vez, use em qualquer agente."

Um comando transforma uma skill genérica em configuração específica para Cursor, Claude Code ou OpenClaw.

---

## Público-Alvo

### Persona Principal

**Dev que usa agentes de código**
- Usa Cursor, Claude Code, ou ambos
- Tem vault Obsidian ou quer ter
- Valoriza automação e padronização
- Quer que agentes sigam convenções consistentes

### Jobs to Be Done

1. **Quando** configuro um novo projeto com agente, **quero** instalar minhas skills padrão rapidamente, **para** não perder tempo copiando arquivos manualmente.

2. **Quando** atualizo uma skill, **quero** aplicar a atualização em todos os projetos, **para** manter consistência.

3. **Quando** descubro uma skill útil, **quero** instalá-la com um comando, **para** não precisar entender o formato interno de cada ferramenta.

---

## Escopo MVP

### In Scope ✓

| Feature | Descrição |
|---------|-----------|
| CLI completo | Comandos `install`, `list`, `info`, `doctor` |
| Skill: second-brain | Instruções + MCP + validação |
| Target: cursor | Gera `.cursor/rules/` + configura MCP |
| Target: claude-code | Gera `CLAUDE.md` + configura MCP |
| Setup MCP automático | Detecta plugin, pede API key, configura |
| Validação de pré-requisitos | Verifica Obsidian, plugin, vault |
| Config interativa | Wizard guiado passo a passo |
| npx support | Funciona sem instalação global |
| Comando `doctor` | Diagnostica problemas de setup |

### Out of Scope (v2+)

| Feature | Por que não agora |
|---------|-------------------|
| Target: openclaw | Já tem sistema de skills próprio |
| Skill: github-flow | Focar em uma skill primeiro |
| Update automático | Complexidade de tracking |
| Registry remoto | Não precisa pra MVP |
| GUI/TUI | CLI é suficiente |

---

## Requisitos Funcionais

### RF01: Comando `install`

```bash
npx eufelipe-agent-skills install <skill> --target <target> [--vault <path>] [--api-key <key>]
```

**Comportamento:**
1. Valida se skill existe
2. Valida se target é suportado
3. Executa wizard interativo:
   - Pergunta vault path (se não informado)
   - Valida se vault existe e tem `.obsidian/`
   - Detecta se plugin Local REST API está instalado
   - Se não: instrui a instalar e pausa
   - Se sim: pede API key (ou detecta se já configurado)
   - Testa conexão com a API
4. Gera arquivos:
   - Skill (instruções pro agente)
   - Config MCP (acesso ao vault)
5. Exibe resumo e próximos passos

**Exemplo:**
```bash
$ npx eufelipe-agent-skills install second-brain --target cursor

🔍 Verificando pré-requisitos...

? Qual o caminho do seu vault Obsidian? ~/Documents/SecondBrain
✓ Vault encontrado

? O plugin "Local REST API" está instalado no Obsidian? Sim
? Cole a API Key do plugin: ****************************
✓ Conexão com API OK

📦 Instalando skill 'second-brain' para Cursor...

✓ Criado .cursor/rules/second-brain.mdc
✓ Configurado MCP server em .cursor/mcp.json

🎉 Setup completo!

Próximos passos:
1. Reinicie o Cursor para carregar o MCP
2. No chat, diga: "Salva no segundo cérebro: [conteúdo]"
```

### RF02: Comando `list`

```bash
npx eufelipe-agent-skills list
```

**Output:**
```
Skills disponíveis:

  second-brain    Escrever notas no vault Obsidian
  
Use 'npx eufelipe-agent-skills info <skill>' para detalhes.
```

### RF03: Comando `info`

```bash
npx eufelipe-agent-skills info second-brain
```

**Output:**
```
second-brain
============

Descrição: Setup completo para agentes escreverem no vault Obsidian

O que instala:
  - Skill com instruções (onde criar, frontmatter, naming)
  - Configuração MCP (acesso ao vault via API)

Pré-requisitos:
  - Obsidian instalado
  - Plugin "Local REST API" ativo
  - API Key do plugin

Targets suportados:
  - cursor (.cursor/rules/ + .cursor/mcp.json)
  - claude-code (CLAUDE.md + .mcp.json)

Uso:
  npx eufelipe-agent-skills install second-brain --target cursor
```

### RF04: Comando `doctor`

```bash
npx eufelipe-agent-skills doctor [--target <target>]
```

**Comportamento:**
1. Detecta skills instaladas no projeto
2. Verifica cada pré-requisito
3. Testa conexões (MCP, API)
4. Sugere correções

**Output:**
```
$ npx eufelipe-agent-skills doctor

🔍 Diagnosticando setup...

Skills instaladas:
  - second-brain (cursor)

Verificações:
  ✓ Vault path válido: ~/Documents/SecondBrain
  ✓ Plugin Local REST API detectado
  ✓ API Key configurada
  ✗ Conexão com API falhou (Obsidian fechado?)
  ✓ Skill file existe: .cursor/rules/second-brain.mdc
  ✓ MCP configurado: .cursor/mcp.json

Problemas encontrados:
  1. API não responde - Abra o Obsidian e tente novamente

Comando para testar:
  curl http://127.0.0.1:27123/ -H "Authorization: Bearer API_KEY"
```

### RF04: Detecção de Conflito

Se já existe configuração no target, perguntar:
```
? Já existe .cursor/rules/second-brain.md. Sobrescrever? (y/N)
```

### RF05: Validação de Vault

Se skill é `second-brain`, validar que o path existe e contém `CONVENTIONS.md` ou `.obsidian/`.

---

## Requisitos Não-Funcionais

| Requisito | Critério |
|-----------|----------|
| **Performance** | Instalação < 2s |
| **Compatibilidade** | Node 18+ |
| **Zero config** | Funciona com npx sem instalação |
| **Offline** | Não depende de rede após download |
| **Tamanho** | Bundle < 500KB |

---

## Arquitetura

### Estrutura de Diretórios

```
eufelipe-agent-skills/
├── package.json
├── bin/
│   └── cli.js              # Entry point
├── src/
│   ├── commands/
│   │   ├── install.js
│   │   ├── list.js
│   │   └── info.js
│   ├── adapters/
│   │   ├── cursor.js       # Gera .cursor/rules/
│   │   └── claude-code.js  # Gera CLAUDE.md
│   ├── skills/
│   │   └── second-brain/
│   │       ├── skill.yaml  # Metadata
│   │       └── template.md # Instruções
│   └── utils/
│       ├── prompts.js      # Inquirer wrappers
│       └── validate.js     # Validações
├── README.md
└── LICENSE
```

### Formato skill.yaml

```yaml
name: second-brain
description: Instruções para agentes escreverem no vault Obsidian
version: 1.0.0
author: eufelipe

targets:
  - cursor
  - claude-code

config:
  vault_path:
    type: string
    required: true
    prompt: "Qual o caminho do seu vault Obsidian?"
    validate: "existsAndIsObsidianVault"

files:
  - template: template.md
    target_cursor: .cursor/rules/second-brain.md
    target_claude: CLAUDE.md
    mode: append  # ou 'replace'
```

### Formato template.md

```markdown
# Second Brain — Instruções para Agentes

## Vault Path

{{vault_path}}

## Convenções

Ao criar notas no vault:

1. **Sempre criar em `inbox/`** (exceto se for Atlas)
2. **Frontmatter obrigatório:**
   ```yaml
   created_by: cursor  # ou claude-code
   created_at: {{date}}
   type: note
   domain: eng
   ```
3. **Naming:** sem espaços, kebab-case
4. **Não mover** notas para outras pastas — Atlas processa

## Comandos

- "Salva no segundo cérebro: [conteúdo]" → cria nota em inbox/
- "Isso é um method/claim/bug" → adiciona hint no frontmatter

## Leia Mais

Ver `{{vault_path}}/CONVENTIONS.md` para regras completas.
```

---

## Fluxo de Instalação

```
┌─────────────────────────────────────────────────────────┐
│  npx eufelipe-agent-skills install second-brain        │
│                        --target cursor                  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
                   ┌────────────────┐
                   │ Skill existe?  │
                   └────────────────┘
                      │         │
                    Não        Sim
                      │         │
                      ▼         ▼
               ┌─────────┐  ┌────────────────┐
               │  Erro   │  │ Target válido? │
               └─────────┘  └────────────────┘
                               │         │
                             Não        Sim
                               │         │
                               ▼         ▼
                        ┌─────────┐  ┌─────────────────┐
                        │  Erro   │  │ Precisa config? │
                        └─────────┘  └─────────────────┘
                                        │         │
                                      Sim        Não
                                        │         │
                                        ▼         │
                                 ┌────────────┐   │
                                 │  Prompt    │   │
                                 │ vault_path │   │
                                 └────────────┘   │
                                        │         │
                                        ▼         ▼
                                 ┌─────────────────────┐
                                 │  Validar vault      │
                                 └─────────────────────┘
                                           │
                                           ▼
                                 ┌─────────────────────┐
                                 │  Carregar adapter   │
                                 │  (cursor.js)        │
                                 └─────────────────────┘
                                           │
                                           ▼
                                 ┌─────────────────────┐
                                 │  Renderizar template│
                                 │  com config         │
                                 └─────────────────────┘
                                           │
                                           ▼
                                 ┌─────────────────────┐
                                 │  Escrever arquivo   │
                                 │  .cursor/rules/...  │
                                 └─────────────────────┘
                                           │
                                           ▼
                                 ┌─────────────────────┐
                                 │  Exibir sucesso     │
                                 └─────────────────────┘
```

---

## Skill: second-brain (Detalhamento)

### Propósito

Permitir que agentes de código (Cursor, Claude Code) escrevam notas no vault Obsidian seguindo as convenções definidas em `CONVENTIONS.md`.

### Instruções Geradas

O template renderizado ensina o agente a:

1. **Onde escrever:** sempre `inbox/`
2. **Formato:** frontmatter YAML + Markdown
3. **Campos obrigatórios:** `created_by`, `created_at`, `type`, `domain`
4. **Naming:** kebab-case, sem espaços
5. **Comportamento:** não classificar, não mover — deixar pra Atlas

### Variáveis

| Variável | Fonte | Exemplo |
|----------|-------|---------|
| `{{vault_path}}` | Prompt ou --vault | `~/Documents/SecondBrain` |
| `{{date}}` | Runtime | `2026-03-28` |
| `{{agent}}` | --target | `cursor` |

### Validação de Vault

```javascript
function isObsidianVault(path) {
  return fs.existsSync(path) && (
    fs.existsSync(join(path, '.obsidian')) ||
    fs.existsSync(join(path, 'CONVENTIONS.md'))
  );
}
```

---

## Adapters

### Cursor Adapter

**Opção 1: Project Rules (recomendado)**

**Output:** `.cursor/rules/second-brain.mdc`

```markdown
---
description: "Instruções para salvar notas no vault Obsidian"
globs: 
alwaysApply: true
---

# Second Brain

[conteúdo do template renderizado]
```

**Comportamento:**
- Cria `.cursor/rules/` se não existir
- Usa formato `.mdc` com frontmatter
- `alwaysApply: true` para estar sempre ativo

**Opção 2: AGENTS.md (alternativa simples)**

**Output:** `AGENTS.md` (append section)

```markdown
## Second Brain

[conteúdo do template]
```

**Comportamento:**
- Se `AGENTS.md` existe, adiciona seção
- Se não existe, cria novo
- Suporta AGENTS.md em subdirs também

### Claude Code Adapter

**Output:** `CLAUDE.md` (project root) ou `~/.claude/CLAUDE.md` (global)

```markdown
## Second Brain

[conteúdo do template renderizado]
```

**Comportamento:**
- Flag `--global` usa `~/.claude/CLAUDE.md`
- Sem flag, usa `CLAUDE.md` na raiz do projeto
- Se arquivo existe, adiciona seção (não sobrescreve)
- Recomendação oficial: < 200 linhas por arquivo

---

## Casos de Teste

### CT01: Instalação básica

```bash
$ npx eufelipe-agent-skills install second-brain --target cursor --vault ~/SecondBrain
✓ Criado .cursor/rules/second-brain.mdc
```

**Verificar:**
- Arquivo existe
- Contém vault path correto
- Frontmatter válido

### CT02: Vault inválido

```bash
$ npx eufelipe-agent-skills install second-brain --target cursor --vault ~/naoexiste
✗ Erro: Diretório não existe ou não é um vault Obsidian
```

### CT03: Skill não existe

```bash
$ npx eufelipe-agent-skills install foo --target cursor
✗ Erro: Skill 'foo' não encontrada. Use 'list' para ver disponíveis.
```

### CT04: Target não suportado

```bash
$ npx eufelipe-agent-skills install second-brain --target vscode
✗ Erro: Target 'vscode' não suportado. Use: cursor, claude-code
```

### CT05: Prompt interativo

```bash
$ npx eufelipe-agent-skills install second-brain --target cursor
? Qual o caminho do seu vault Obsidian? ~/Documents/SecondBrain
✓ Criado .cursor/rules/second-brain.md
```

### CT06: Conflito

```bash
$ npx eufelipe-agent-skills install second-brain --target cursor
? Já existe .cursor/rules/second-brain.mdc. Sobrescrever? No
✗ Instalação cancelada
```

### CT07: Instalação global Claude Code

```bash
$ npx eufelipe-agent-skills install second-brain --target claude-code --global
✓ Atualizado ~/.claude/CLAUDE.md (seção Second Brain adicionada)
```

---

## Dependências

```json
{
  "dependencies": {
    "commander": "^12.0.0",
    "inquirer": "^9.0.0",
    "chalk": "^5.0.0",
    "mustache": "^4.0.0",
    "yaml": "^2.0.0",
    "ora": "^8.0.0",
    "node-fetch": "^3.0.0"
  }
}
```

| Pacote | Propósito |
|--------|-----------|
| commander | Parsing de CLI |
| inquirer | Prompts interativos (wizard) |
| chalk | Output colorido |
| mustache | Template rendering |
| yaml | Parse skill.yaml |
| ora | Spinners para feedback visual |
| node-fetch | Testar conexão com API |

---

## Cronograma Sugerido

| Fase | Tarefas | Tempo |
|------|---------|-------|
| **Setup** | Repo, package.json, estrutura | 30min |
| **CLI base** | Commander, comandos vazios | 30min |
| **list/info** | Implementar comandos simples | 30min |
| **Wizard install** | Prompts interativos, validações | 1h |
| **MCP config** | Gerar configs, testar conexão | 1h |
| **Adapters** | cursor.js, claude-code.js | 1h |
| **Skill** | second-brain completa | 30min |
| **Doctor** | Diagnóstico e troubleshooting | 45min |
| **Testes** | Casos manuais | 30min |
| **Docs** | README, exemplos | 30min |

**Total estimado:** ~7h

---

## Métricas de Sucesso

| Métrica | Target MVP |
|---------|------------|
| Funciona com npx | ✓ |
| Instala em < 2s | ✓ |
| Zero erros em happy path | ✓ |
| README claro | ✓ |

---

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Formato Cursor muda | Baixa | Médio | Adapter isolado, fácil atualizar |
| Claude Code muda estrutura | Baixa | Médio | Adapter isolado |
| Usuário não tem Node 18+ | Média | Baixo | Documentar requisito |

---

## Decisões em Aberto

1. **Cursor: .mdc (Project Rules) vs AGENTS.md?**
   - Proposta: Usar `.mdc` por padrão, flag `--agents-md` para alternativa

2. **Nome do pacote npm?**
   - Opções: `eufelipe-agent-skills`, `@eufelipe/agent-skills`

3. **Suportar nested AGENTS.md?**
   - Cursor suporta AGENTS.md em subdirs
   - Proposta: v2

---

## Integração MCP (Complementar às Skills)

### Contexto

As skills ensinam o agente **como** escrever no vault. Mas o agente precisa de **acesso** ao vault.

**Problema:** Cursor/Claude Code rodam em projetos diferentes do vault.

**Solução:** MCP Server que expõe o vault via API.

### Stack Recomendada

```
┌─────────────────────────────────────────────────────┐
│  Cursor / Claude Code                               │
│  ┌───────────────────┐  ┌────────────────────────┐  │
│  │ Skill instalada   │  │ MCP Client             │  │
│  │ (regras de como)  │  │ (acesso ao vault)      │  │
│  └───────────────────┘  └────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────┐
│  obsidian-mcp-server (npx)                          │
│  - obsidian_read_note                               │
│  - obsidian_update_note                             │
│  - obsidian_global_search                           │
│  - obsidian_manage_frontmatter                      │
└─────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────┐
│  Obsidian + Local REST API Plugin                   │
│  http://127.0.0.1:27123                             │
└─────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────┐
│  Vault (SecondBrain/)                               │
│  Sync via Obsidian Sync                             │
└─────────────────────────────────────────────────────┘
```

### Pré-requisitos

1. **Obsidian** com plugin "Local REST API" instalado e ativo
2. **API Key** gerada no plugin
3. **Obsidian rodando** (necessário para a API funcionar)

### Configuração Cursor

**Settings → MCP** (ou `Cmd+Shift+J`):

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "npx",
      "args": ["obsidian-mcp-server"],
      "env": {
        "OBSIDIAN_API_KEY": "API_KEY_DO_PLUGIN",
        "OBSIDIAN_BASE_URL": "http://127.0.0.1:27123",
        "OBSIDIAN_VERIFY_SSL": "false",
        "OBSIDIAN_ENABLE_CACHE": "true"
      }
    }
  }
}
```

### Configuração Claude Code

**~/.claude.json** ou **.mcp.json** no projeto:

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "npx",
      "args": ["obsidian-mcp-server"],
      "env": {
        "OBSIDIAN_API_KEY": "API_KEY_DO_PLUGIN",
        "OBSIDIAN_BASE_URL": "http://127.0.0.1:27123",
        "OBSIDIAN_VERIFY_SSL": "false"
      }
    }
  }
}
```

### Tools Disponíveis

| Tool | Descrição | Uso na skill |
|------|-----------|--------------|
| `obsidian_read_note` | Lê conteúdo de nota | Verificar se nota existe |
| `obsidian_update_note` | Cria/atualiza nota | Salvar no inbox |
| `obsidian_global_search` | Busca no vault | Evitar duplicação |
| `obsidian_manage_frontmatter` | Edita YAML | Adicionar metadata |
| `obsidian_manage_tags` | Gerencia tags | Categorizar |
| `obsidian_list_notes` | Lista diretório | Navegar vault |

### Fluxo Completo

```
Usuário: "Salva no segundo cérebro: descobri que useEffect 
         com array vazio só roda uma vez"

         │
         ▼
┌─────────────────────────────────────────────────────┐
│  1. Skill lê instruções (.cursor/rules/second-brain.mdc)
│     - Criar em inbox/
│     - Frontmatter obrigatório
│     - Naming kebab-case
└─────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│  2. MCP chama obsidian_update_note
│     - path: inbox/useeffect-array-vazio-roda-uma-vez.md
│     - content: frontmatter + conteúdo
└─────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│  3. Nota criada no vault local
│     → Obsidian Sync
│     → VPS recebe
│     → Atlas processa
└─────────────────────────────────────────────────────┘
```

### Escopo do CLI

O CLI `eufelipe-agent-skills` pode opcionalmente:

1. **Detectar se MCP está configurado** e avisar se não
2. **Gerar config de MCP** junto com a skill (`--with-mcp`)
3. **Validar API Key** se fornecida

**Exemplo:**

```bash
$ npx eufelipe-agent-skills install second-brain --target cursor --with-mcp

? Qual o caminho do seu vault Obsidian? ~/Documents/SecondBrain
? API Key do plugin Local REST API: ****

✓ Criado .cursor/rules/second-brain.mdc
✓ Adicionado MCP server 'obsidian' em .cursor/mcp.json
```

### Limitação Importante

⚠️ **Obsidian precisa estar aberto** para o MCP funcionar.

Se Obsidian estiver fechado, as chamadas MCP falham. A skill deve instruir o agente a avisar o usuário nesse caso.

## Referências

- [[eufelipe-agent-skills]] — Projeto pai
- [[CONVENTIONS]] — Convenções do vault
- [obsidian-mcp-server](https://github.com/cyanheads/obsidian-mcp-server) — MCP Server
- [Local REST API Plugin](https://github.com/coddingtonbear/obsidian-local-rest-api) — Plugin Obsidian

---

**Última atualização:** 2026-03-28
