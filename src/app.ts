import { join } from 'node:path'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify'

export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> { }

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {

  const reqENV = ['API_KEY', 'IMMICH_API_URL', 'IMMICH_API_KEY', 'TZ']

  const missingENV = reqENV.filter((key) => !process.env[key])

  if (missingENV.length > 0) {
    fastify.log.error(`Please fill out the ENV for: ${missingENV.join(', ')}`)
    process.exit(1)
  }


  fastify.addHook('onRequest', async (request, reply) => {

    const authHeader = request.headers['x-api-key']

    if (authHeader !== process.env.API_KEY) {
      return reply.code(401).send({ error: 'Unauthorised' })
    }
  })

  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts
  })
}


export default app
export { app }
