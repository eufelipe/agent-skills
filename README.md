# @eufelipe/agent-skills

CLI para instalar skills padronizadas em ferramentas de agentes de IA.

> **"Instale uma vez, use em qualquer agente."**

A primeira skill é a **atlas-brain**: ela ensina o agente (Claude Code) a salvar notas no seu vault Obsidian seguindo as convenções do vault — transformando o vault em uma fonte de verdade que pode ser consumida por outras estruturas (Atlas, OpenClaw, Hermes, etc.).

## Quickstart

```bash
npx @eufelipe/agent-skills install atlas-brain
```

O wizard pergunta o caminho do seu vault Obsidian, valida (precisa de `.obsidian/` ou `CONVENTIONS.md`) e instala a skill em `~/.claude/skills/atlas-brain/SKILL.md`.

Depois, em **qualquer projeto** com Claude Code:

```
/atlas-brain
```

ou simplesmente peça: _"Salva no segundo cérebro: [conteúdo]"_ — o agente cria uma nota bem-formada em `inbox/` do vault, com frontmatter (`created_by`, `created_at`, `type`, `domain`) e naming kebab-case.

## Comandos

| Comando | Descrição |
|---------|-----------|
| `install <skill>` | Instala uma skill (wizard interativo ou flags) |
| `list` | Lista skills disponíveis |
| `info <skill>` | Detalhes de uma skill |
| `doctor` | Diagnostica o setup (skill instalada, vault válido) |

### Flags do `install`

| Flag | Descrição |
|------|-----------|
| `-t, --target <target>` | Target da instalação (default: `claude-code`) |
| `-v, --vault <path>` | Caminho do vault Obsidian (pula o prompt) |
| `--project` | Instala em `<projeto>/.claude/skills/` em vez de global |
| `--force` | Sobrescreve arquivo existente sem confirmar |

Exemplo não-interativo:

```bash
npx @eufelipe/agent-skills install atlas-brain --vault "~/Documents/Obsidian Vault" --force
```

## Como funciona

1. Cada skill é um template ([Mustache](https://mustache.github.io/)) + metadata (`skill.yaml`).
2. O `install` renderiza o template com a sua configuração (ex.: caminho do vault) e grava no formato nativo do target — para Claude Code, um `SKILL.md` no padrão [Agent Skills](https://code.claude.com/docs/en/skills).
3. O agente passa a ter as **regras de escrita** (onde criar, frontmatter, naming) com o caminho do seu vault embutido. Sem MCP, sem plugin, sem API key — o Claude Code escreve direto no filesystem.

O processamento posterior das notas (classificação, dedupe, movimentação de `inbox/` para as pastas finais) é responsabilidade do seu pipeline (ex.: Atlas) — o agente só deposita no `inbox/`.

## Requisitos

- Node.js >= 18
- Um vault Obsidian (diretório com `.obsidian/` ou `CONVENTIONS.md`)

## Desenvolvimento

```bash
npm install
npm run qa        # lint + type-check + testes + cobertura
npm run cli -- list
```

## Roadmap

- **v0.1** — skill `atlas-brain` para Claude Code (SKILL.md nativo) ✅
- **v1.1** — target `cursor` (`.cursor/rules/*.mdc`) via registry de adapters
- **v2** — mais skills (github-flow, etc.), update automático de skills instaladas

## Licença

[ISC](./LICENSE)
