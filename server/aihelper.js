// Open ai api model
import OpenAI from 'openai';

// Load your key from an environment variable or secret management service
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

const generatePrompt = (documentContent, signer, context, sender) => {
    return `${documentContent}. The previous text is from a document sent to ${signer} from ${sender}. ${context}. How would you write an email that maximizes the chance of ${signer} signing this document?`
}

export const generateEmail = async (documentContent, signer, context, sender) => {
    const content = generatePrompt(documentContent, signer, context, sender)

    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content }],
        model: 'gpt-3.5-turbo',
    });

    console.log('chatCompletion', chatCompletion)

    return chatCompletion.choices[0];
}


export const summarize = async (text) => {
    return text
}