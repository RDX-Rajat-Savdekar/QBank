/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module "katex" {
  const katex: {
    renderToString: (tex: string, opts?: Record<string, unknown>) => string;
  };
  export default katex;
}

declare module "*.md?raw" {
  const content: string;
  export default content;
}
