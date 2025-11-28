/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ROOT_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_MOVIEDB_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
