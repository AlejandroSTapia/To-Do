interface ImportMetaEnv {
  VITE_N8N_WEBHOOK_URL: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
