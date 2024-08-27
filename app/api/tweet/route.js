// app/api/completion/route.ts
import { createOpenAI } from '@ai-sdk/openai';
import { generateText, convertToCoreMessages } from 'ai';
 
const openai = createOpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  compatibility: 'strict',
});
 
export async function POST(req) {
  try {
    // Extraer el prompt de la solicitud
    const { prompt } = await req.json();
    const separateObjects = prompt;
    console.log(prompt)
    // Llamada a generateText sin stream
    const response = await generateText({
      model: openai('gpt-3.5-turbo'),  // Especifica el modelo directamente
      system: "write a tweet , this tweet should be nice and formal is directed to my local representatives, dont let space for [name] or similar, all of this in 200 or less characters",
      prompt: prompt,
      max_tokens: 200,
      temperature: 0,
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 1
    });
  
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

