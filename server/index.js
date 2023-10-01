import Fastify from 'fastify'
import * as DropboxSign from "@dropbox/sign";
import * as multipart from 'fastify-multipart';
import dotenv from 'dotenv';
import pdf from 'pdf-parse';

// cors
import cors from '@fastify/cors'


import fs from 'fs';
import path from 'path';

const config = dotenv.config()

const embeddedApi = new DropboxSign.EmbeddedApi();

const {DROPBOX_KEY, OPENAPI_KEY} = process.env

embeddedApi.username = DROPBOX_KEY
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
    reply.code(500).send({error})
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

fastify.listen({ port: 3001 }, (err, address) => {
  if (err) throw err
  // Server is now listening on ${address}
})