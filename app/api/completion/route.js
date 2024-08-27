// app/api/completion/route.ts
 
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
const openai = createOpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  compatibility: 'strict',
});
/*export async function POST(req) {
  // Extract the messages from the body of the request
  //console.log(await req.json())
  const { prompt } = await req.json();
  const separateObjects = JSON.parse(prompt)
  console.log(separateObjects)
  const response = await generateText({
    model: openai('gpt-3.5-turbo'),
    stream: false,
    system: separateObjects.promptBase + "the answer must be in JSON object like this {{subject:},{message:}}" ,
    prompt: separateObjects.prompt,
    max_tokens: 500,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });
  const txt = await response.text
  console.log(txt.text)
  // Respond with the stream
  // Devolver el texto generado
  return txt.text
}*/

 /*
export const runtime = 'edge'
 
const openai = new createOpenAI({
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
*/
export async function POST(req) {
  try {
    // Extraer el prompt de la solicitud
    const { prompt } = await req.json();
    const separateObjects = prompt;
    console.log(prompt)
    // Llamada a generateText sin stream
    const response = await generateText({
      model: openai('gpt-3.5-turbo'),  // Especifica el modelo directamente
      system: separateObjects.promptBase + "the answer must be in JSON object like this {{subject:},{message:}}",
      prompt: separateObjects.prompt,
      max_tokens: 200,
      temperature: 0,
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 1
    });
    // Acceso directo a la respuesta completa
    //const finalText = response.text
    console.log(response.text)
    // Devolver el texto generado
    return Response.json(response.text)
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}