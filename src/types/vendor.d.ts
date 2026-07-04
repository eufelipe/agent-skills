// Declarações mínimas para dependências sem types próprios,
// evitando instalar @types/* — apenas o que o projeto usa.

declare module 'mustache' {
  interface MustacheRenderConfig {
    escape?: (value: unknown) => string;
  }
  const Mustache: {
    render(
      template: string,
      view: unknown,
      partials?: unknown,
      config?: MustacheRenderConfig
    ): string;
  };
  export default Mustache;
}

declare module 'inquirer' {
  interface InquirerQuestion {
    type: string;
    name: string;
    message: string;
    default?: unknown;
    validate?: (input: string) => boolean | string | Promise<boolean | string>;
  }
  const inquirer: {
    prompt(
      questions: InquirerQuestion[]
    ): Promise<Record<string, unknown>>;
  };
  export default inquirer;
}
