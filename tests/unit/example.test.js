import { describe, it, expect } from 'vitest';

describe('Exemplo de teste unitário', () => {
  it('deve executar teste básico', () => {
    expect(true).toBe(true);
  });

  it('deve realizar operações matemáticas simples', () => {
    expect(1 + 1).toBe(2);
  });
});
