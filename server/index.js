import Fastify from 'fastify'
import * as DropboxSign from "@dropbox/sign";
import * as multipart from 'fastify-multipart';
import 'dotenv/config'

// cors
import cors from '@fastify/cors'
import { generateEmail } from './utils/aihelper.js';

const embeddedApi = new DropboxSign.EmbeddedApi();
const signatureApi = new DropboxSign.SignatureRequestApi();
const accountApi = new DropboxSign.AccountApi();

const DROPBOX_KEY = process.env.DROPBOX_KEY

const accountIdMap = {}

embeddedApi.username = DROPBOX_KEY
signatureApi.username = DROPBOX_KEY
accountApi.username = DROPBOX_KEY
console.log('username', DROPBOX_KEY)

const fastify = Fastify({
  logger: true
})

fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})

fastify.get('/', async (request, reply) => {
  reply.type('application/json').code(200)
  return { hello: 'world' }
})

fastify.register(multipart);
fastify.post('/upload', async (request, reply) => {
  try {
    const data = await request.file();

    if (!data || !data.mimetype || data.mimetype !== 'application/pdf') {
      return reply
        .code(400)
        .send({ error: 'Invalid file format. Please upload a PDF file.' });
    }

    // Parse the PDF
    const pdfText = await pdf(await data.toBuffer());

    // Extract text from the parsed PDF
    const text = pdfText.text;

    // Return the extracted text
    return { text };
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
});


fastify.get('/embed/:signatureId', async (request, reply) => {
  const { signatureId } = request.params
  let result
  try {
    result = await embeddedApi.embeddedSignUrl(signatureId);
  } catch (e) {
    console.error('error', e)
    const error = e.response.data
    reply.code(500).send({ error })
    return;
  }
  console.log('result', signatureId, result)
  reply.send(result.response.data);
})



fastify.post('/summarize', async (request, reply) => {
  const { text } = request.body
  const summary = await summarize(text)
  reply.type('application/json').code(200)
  return { summary }
})

// https://github.com/hellosign/dropbox-sign-node/blob/main/docs/api/SignatureRequestApi.md#signaturerequestlist
fastify.get('/requests', async (request, reply) => {
  // get email from query param
  const { email, page } = request.query
  let accountId = accountIdMap[email]
  try {
    if (!accountId) {
      const response = await accountApi.accountGet(undefined, email);
      accountId = response.body.account.accountId;
      console.log('accountId', accountId, email)
      accountIdMap[email] = accountId
    }
    const response = await signatureApi.signatureRequestList(accountId, page || 1, 10);
    console.log('response', response.body)
    const {body} = response
    const requests = body.signatureRequests;
    const numResults = body.listInfo?.numResults || requests.length;
    return {
      requests,
      numResults
    }
  } catch (e) {
    console.error('error', e)
    const error = e.response.data
    reply.code(500).send({ error })
  }
});


fastify.post('/generate/email', async (request, reply) => {
  // Get post body params from request
  const { requestId, signers, documentContent, context } = request.body

  const text = await generateEmail(documentContent, requestId, signers, context)
  return {
    text
  }

})

fastify.listen({ port: 3001 }, (err, address) => {
  if (err) throw err
  // Server is now listening on ${address}
})