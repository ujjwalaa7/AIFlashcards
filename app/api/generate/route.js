import { NextResponse } from 'next/server';
import axios from 'axios';

const systemPrompt = `
You are a flashcard creator. Your task is to generate a specific number of flashcards from the provided text. 
Each flashcard should consist of a front and a back, with each side being exactly one sentence long. 

Please ensure the following:
1. Create the exact number of flashcards requested.
2. The content on the front should represent a question, term, or prompt about the given topic.
3. The content on the back should provide the answer, definition, or explanation about the given topic.

Return the output in the following JSON format:
{
  "flashcards": [
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;

async function generateFlashcards(data, numToGenerate) {
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Generate ${numToGenerate} flashcards from the following text: ${data}` }
  ];

  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      messages: messages,
      model: 'llama3-8b-8192',
      max_tokens: 3000, 
      temperature: 1,
      stop: null
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
      },
    }
  )

  const completion = response.data.choices[0].message;

  if (completion.content) {
    const jsonStart = completion.content.indexOf('{');
    const jsonEnd = completion.content.lastIndexOf('}') + 1;
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = completion.content.slice(jsonStart, jsonEnd);
      return JSON.parse(jsonString).flashcards;
    }
  }
  throw new Error('JSON format not found in the response');
}

export async function POST(req) {
  try {
    const { text, numToGenerate, existingFlashcards } = await req.json();
    let flashcards;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        flashcards = await generateFlashcards(text, numToGenerate);
        if (flashcards.length === numToGenerate) break;  
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed: ${error.message}`);
      }
    }

    if (flashcards && flashcards.length === numToGenerate) {
      return NextResponse.json(flashcards);
    } else {
      throw new Error(`Failed to generate exactly ${numToGenerate} flashcards after 3 attempts`);
    }

  } catch (error) {
    console.error('Error querying LLaMA API:', error.message);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request data:', error.request);
    }
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}