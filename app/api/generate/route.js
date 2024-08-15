import { NextResponse } from 'next/server';
import axios from 'axios';

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 12 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;

export async function POST(req) {
  try {
    const data = await req.text();
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: data }
    ];

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        messages: messages,
        model: 'llama3-8b-8192',
        max_tokens: 1024,
        temperature: 0.7,
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
      // Extract the JSON string from the content
      const jsonStart = completion.content.indexOf('{');
      const jsonEnd = completion.content.lastIndexOf('}') + 1;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = completion.content.slice(jsonStart, jsonEnd);
        try {
          const flashcards = JSON.parse(jsonString);
          return NextResponse.json(flashcards.flashcards);
        } catch (jsonError) {
          throw new Error('Failed to parse JSON response from LLaMA API');
        }
      } else {
        throw new Error('JSON format not found in the response');
      }
    } else {
      throw new Error('Unexpected response format');
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