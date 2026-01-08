import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', () => 'Hello Elysia Hot Relaod')
	.listen(3000)

console.log(
	`🦊 Elysia 2 is running at ${app.server?.hostname}:${app.server?.port}`
)
