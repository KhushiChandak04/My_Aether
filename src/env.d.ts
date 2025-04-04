/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MODULE_ADDRESS: string
  readonly VITE_APTOS_NODE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
