import { FastifyPluginAsync } from 'fastify'
import { ImmichWebhookData } from '../../types/immich/webhook'
import { getUTCOffset, immichRequest, toTZOffsetString } from '../../utils/immich'
import { formatInTimeZone } from 'date-fns-tz'
import { parseDateFromFilename } from '../../utils/dates'

const webhooks: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  /**
   * Request for when theres no timezone but theres a date
   */
  fastify.post('/immich/noTimezone', async function (request, reply) {
    const userAgent = request.headers['user-agent'] || ''

    if (!userAgent.startsWith('immich-server/')) {
      return reply.code(403).send({ error: 'not from immich' })
    }

    const immichData = request.body as ImmichWebhookData;
    const currentTimeZone = immichData?.data?.asset?.exifInfo?.timeZone;


    if (immichData?.trigger !== "AssetMetadataExtraction") return reply.code(400).send({ triggerAllowed: false });
    if (!immichData?.data?.asset?.id) return reply.code(400).send({ code: 'noImageUUID' });
    if (currentTimeZone !== null && currentTimeZone !== 'UTC') return reply.code(400).send({ code: 'timezoneExists' });

    const imageData = immichData?.data?.asset;

    const imageDate = imageData?.exifInfo?.dateTimeOriginal ?? imageData?.localDateTime; // iso strings

    if (!imageDate) return reply.code(400).send({ code: 'noImageRawDate' });

    const expectedOffset = formatInTimeZone(new Date(imageDate), process.env.TZ as string, 'xxx')

    if (expectedOffset === '+00:00') {
      //  if timezone is 0 offset no need to change time info, eg when uk goes to GMT, because immich regardless if u set it to GMT will still say UTC in the client
      return reply.code(304).send({ code: 'sameOffsetAsUTC' });
    }


    const properDate = toTZOffsetString(imageDate as string);

    const immichReq = await immichRequest(`/assets/${imageData?.id}`, {
      method: 'PUT',
      body: {
        dateTimeOriginal: properDate,
        timeZone: process.env.TZ as string
      }
    });


    if (immichReq?.exifInfo?.timeZone === getUTCOffset(properDate as string)) return reply.code(200).send({ success: true })


    return reply.code(500).send({ success: false })
  });


  /**
   * Request for when theres No DATE, but filename has a date. EG date meta says 1970 but filename is like 20260807_120635.mp4
   */
  fastify.post('/immich/noDate', async function (request, reply) {
    const userAgent = request.headers['user-agent'] || ''

    if (!userAgent.startsWith('immich-server/')) {
      return reply.code(403).send({ error: 'not from immich' })
    }

    const immichData = request.body as ImmichWebhookData;


    if (immichData?.trigger !== "AssetMetadataExtraction") return reply.code(400).send({ triggerAllowed: false });
    if (!immichData?.data?.asset?.id) return reply.code(400).send({ code: 'noImageUUID' });

    const imageData = immichData?.data?.asset;

    const imageDate = imageData?.exifInfo?.dateTimeOriginal ?? imageData?.localDateTime; // iso strings

    if (!imageDate) return reply.code(400).send({ code: 'noImageRawDate' });
    if(!imageDate.startsWith("1970-01-01T")) return reply.code(400).send({ code: 'hasDate' });

    const properDate = parseDateFromFilename(immichData?.data?.asset?.originalFileName as string);

    if (!properDate) return reply.code(500).send({ code: 'noDateFound' });
    
    fastify.log.info(properDate)

    const immichReq = await immichRequest(`/assets/${imageData?.id}`, {
      method: 'PUT',
      body: {
        dateTimeOriginal: properDate,
        timeZone: process.env.TZ as string
      }
    });

    if (immichReq?.exifInfo?.timeZone === getUTCOffset(properDate as string)) return reply.code(200).send({ success: true })


    return reply.code(500).send({ success: false })
  });
}

export default webhooks