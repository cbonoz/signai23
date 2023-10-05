// Open ai api model
import OpenAI from 'openai';

// Load your key from an environment variable or secret management service.
const OPENAI_API_KEY = process.env.OPENAI_KEY;
console.log('OPENAI_API_KEY', OPENAI_API_KEY.slice(0,6))

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

const responseCache = {}



const generatePrompt = (documentContent, signer, context, sender) => {
    return `${documentContent}. The previous text is from a document sent to ${signer} from ${sender}. ${context}. How would you write an email that maximizes the chance of ${signer} signing this document? Keep at most to 3 paragraphs.`
}

const createCacheKey = (signer, context, sender) => {
    return `${signer}-${context}-${sender}`
}

export const generateEmail = async (documentContent, signer, context, sender) => {
    // Basic clear (could use LRU)
    if (Object.keys(responseCache).length > 100) {
        responseCache = {}
    }

    const content = generatePrompt(documentContent, signer, context, sender)
    const cacheKey = createCacheKey(signer, context, sender)

    if (responseCache[cacheKey]) {
        console.log('matched', cacheKey)
        return responseCache[cacheKey]
    }

    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content }],
        model: 'gpt-3.5-turbo',
    });

    console.log('chatCompletion', chatCompletion, chatCompletion.choices.map(c => c.message))

    const result = chatCompletion.choices[0].message.content;
    if (!result) {
        throw new Error('No result')
    }
    responseCache[cacheKey] = result
    return result;
}


export const summarize = async (text) => {
    return text
}