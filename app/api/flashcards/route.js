import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'flashcards.json');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Flashcards file not found' }, { status: 404 });
    }

    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const flashcards = JSON.parse(fileContents);

    return NextResponse.json(flashcards, { status: 200 });
  } catch (error) {
    console.error('Error reading flashcards file:', error.message);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
