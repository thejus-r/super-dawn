import {Elysia }from "elysia"
import { describe, it, expect } from "vitest";

describe("testing test", async () => {
  it('returns a response', async () => {
          const app = new Elysia().get('/', () => 'hi')

          const response = await app
              .handle(new Request('http://localhost/'))
              .then((res) => res.text())

          expect(response).toBe('hi')
      })
})
