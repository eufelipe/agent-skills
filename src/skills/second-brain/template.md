<!--
Variáveis (substituídas na instalação):
- {{vault_path}}: caminho do vault Obsidian (ex.: ~/Documents/SecondBrain)
- {{agent}}: agente alvo (cursor ou claude-code)
- {{date}}: data em YYYY-MM-DD gerada em runtime
- {{skill_name}}: nome da skill (second-brain)

Exemplo de frontmatter após render:
  created_by: cursor
  created_at: 2026-03-28
  type: note
  domain: eng
-->

# Second Brain — Instruções para Agentes

## Vault Path

{{vault_path}}

## Convenções

Ao criar notas no vault:

1. **Sempre criar em `inbox/`** (exceto se for Atlas)
2. **Frontmatter obrigatório:**
   ```yaml
   created_by: {{agent}}
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
