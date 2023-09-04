import Fastify from 'fastify'
import * as DropboxSign from "@dropbox/sign";
import * as multipart from 'fastify-multipart';
import PdfParse from 'pdf-parse/lib/pdf-parse.js'
import dotenv from 'dotenv';

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

fastify.get('/', async (request, reply) => {
  reply.type('application/json').code(200)
  return { hello: 'world' }
})

fastify.register(multipart);

fastify.post('/extract-pdf-content', async (request, reply) => {
  try {
    const { pdf } = request.files;
    const { fromPage, toPage } = request.body;

    if (!pdf || !fromPage || !toPage) {
      reply.code(400).send({ error: 'Missing required parameters.' });
      return;
    }

    const pdfPath = path.join(__dirname, 'uploads', pdf.name);
    await pdf.mv(pdfPath);

    const pdfData = await fs.promises.readFile(pdfPath);

    const pdfParser = new PdfParse(pdfData);

    pdfParser.on('pdfParser_dataError', errData => console.error(errData.parserError));
    pdfParser.on('pdfParser_dataReady', async pdfData => {
      const { numpages } = pdfData;
      if (fromPage < 1 || toPage > numpages || fromPage > toPage) {
        reply.code(400).send({ error: 'Invalid page range.' });
        return;
      }

      let extractedText = '';

      for (let i = fromPage - 1; i < toPage; i++) {
        extractedText += pdfData.formImage.Pages[i].Texts.map(textObj => {
          return Buffer.from(textObj.R[0].T, 'hex').toString('utf-8');
        }).join(' ');
      }

      console.log('text', extractedText)
      
      const summary = await summarize(extractedText)
      reply.type('application/json').code(200)
      return { summary }
    });

    pdfParser.parseBuffer();
  } catch (err) {
    console.error(err);
    reply.code(500).send({ error: 'An error occurred.' });
  }
});

fastify.get('/embed/:signatureId', async (request, reply) => {
  const { signatureId } = request.params
  let result
  try {
    result = await embeddedApi.embeddedSignUrl(signatureId);
  } catch (e) {
    console.error('error', e)
  }
  console.log('result', result)
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