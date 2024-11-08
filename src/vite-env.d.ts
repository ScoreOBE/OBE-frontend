/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.xlsx' {
  const value: string;
  export default value;
}