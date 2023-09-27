// app/api/completion/route.ts
 
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'
 
export const runtime = 'edge'
 
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
})
 
export async function POST(req) {
  // Extract the `prompt` from the body of the request
  const { prompt } = await req.json()
 
  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    // a precise prompt is important for the AI to reply with the correct tokens
    messages: [
      {
        role: 'user',
        content: `Given the following text, write a tweet , this tweet should be nice and formal is directed to my local representatives, dont let space for [name] or similar, all of this in 200 or less characters, 
this is the text:
${prompt}
        
Output:\n`
      }
    ],
    max_tokens: 200,
    temperature: 0, // you want absolute certainty for spell check
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1
  })
 
  const stream = OpenAIStream(response)
 
  return new StreamingTextResponse(stream)
}