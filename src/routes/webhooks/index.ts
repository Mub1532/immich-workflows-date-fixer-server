import { FastifyPluginAsync } from 'fastify'
import { ImmichWebhookData } from '../../types/immich/webhook'
import { getUTCOffset, immichRequest, toTZOffsetString } from '../../utils/immich'

const webhooks: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/immich/noTimezone', async function (request, reply) {
    const userAgent = request.headers['user-agent'] || ''

    if (!userAgent.startsWith('immich-server/')) {
      return reply.code(403).send({ error: 'not from immich' })
    }

    const immichData = request.body as ImmichWebhookData;


    if (immichData?.trigger !== "AssetMetadataExtraction") return reply.code(400).send({ triggerAllowed: false });
    if (!immichData?.data?.asset?.id) return reply.code(400).send({ code: 'noImageUUID' });
    if (immichData?.data?.asset?.exifInfo?.timeZone !== null && immichData?.data?.asset?.exifInfo?.timeZone !== 'UTC') return reply.code(400).send({ code: 'timezoneExists' });

    const imageData = immichData?.data?.asset;

    fastify.log.info(imageData);

    const imageDate = imageData?.exifInfo?.dateTimeOriginal ?? imageData?.localDateTime; // iso strings

    if (!imageData) return reply.code(400).send({ code: 'noImageRawDate' });

    const properDate = toTZOffsetString(imageDate as string);

    const immichReq = await immichRequest(`/assets/${imageData?.id}`, {
      method: 'PUT',
      body: {
        dateTimeOriginal: properDate,
        timeZone: process.env.TZ as string
      }
    });


    if(immichReq?.exifInfo?.timeZone === getUTCOffset(properDate as string)) return reply.code(200).send({ success: true })


    return reply.code(200).send({ success: false })
  })
}

export default webhooks