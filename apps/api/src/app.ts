import { Elysia } from 'elysia'
import { createIdentityModule } from './modules/identity/transport/http'

export const buildApp = () => {
  const identityModule = createIdentityModule()

  const app = new Elysia()
    .group('/api', (app) => app
      .use(identityModule)
    )
    .get('/health', () => ({ status: "ok", timestamp: new Date() }))
    .listen(3000)


  return app
}
