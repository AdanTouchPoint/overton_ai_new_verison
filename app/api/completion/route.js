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
  const separateObjects = JSON.parse(prompt)
  console.log(separateObjects)
  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    // a precise prompt is important for the AI to reply with the correct tokens
    messages: [
      {role: "system", content:separateObjects.promptBase},
      {
        role: 'user',
        content: `${separateObjects.prompt}`
      },
      {role: "system", content:"the answer must be in JSON object like this {{subject:},{message:}}"}
    ],
    response_format: { type: "json_object" },
    max_tokens: 200,
    temperature: 0, // you want absolute certainty for spell check
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1
  })
 
  const stream = OpenAIStream(response)
 
  return new StreamingTextResponse(stream)
}