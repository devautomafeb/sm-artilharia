declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

// CSS global
declare module '*.css' {
  const css: string;
  export default css;
}

// CSS Modules (se você usar *.module.css)
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// (Opcional) Tipos para imagens que você já importa
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.svg' {
  const src: string;
  export default src;
}

