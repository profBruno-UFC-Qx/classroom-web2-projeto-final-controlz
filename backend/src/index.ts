import { createApp } from "./app";
import { config } from "./config";
import { AppDataSource } from "./data-source";

// Bootstrap da API: conecta ao banco e sobe o servidor HTTP
async function main() {
  await AppDataSource.initialize();

  const app = createApp();
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API rodando em http://localhost:${config.port}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
