import { buildApp } from "src/app";

async function bootstrap() {

  try {
    const app = buildApp();
    const port = process.env.PORT || 3000;

    app.listen(port)
    console.log(`server running at ${app.server?.hostname}:${app.server?.port}`)

    const shutdown = () => {
      console.log('shutdown signal received. shutting down gracefully...')
      app.stop()
      process.exit(0)
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
  } catch (e) {
    console.error("failed to start server", e)
    process.exit(1)
  }
}

bootstrap()
