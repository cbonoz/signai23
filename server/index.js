import Fastify from 'fastify'

const fastify = Fastify({
  logger: true
})

fastify.get('/', async (request, reply) => {
  reply.type('application/json').code(200)
  return { hello: 'world' }
})

const fs = require('fs');
const path = require('path');
const PDFParser = require('pdf-parse');

fastify.register(require('fastify-multipart'));

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
    const pdfParser = new PDFParser(pdfData);

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


fastify.post('/summarize', async (request, reply) => {
    const { text } = request.body
    const summary = await summarize(text)
    reply.type('application/json').code(200)
    return { summary }
})

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  // Server is now listening on ${address}
})