import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanMarkdown(content: string): string {
  // Remove Markdown code block syntax
  return content.replace(/^```json\n?|\n?```$/g, '').trim();
}

export async function POST(req: NextRequest) {
  try {
    const { responses, filter } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: "You are a helpful assistant that filters survey responses based on given criteria. Always respond with a JSON array of filtered responses, without any additional formatting or explanation." },
        { role: "user", content: `Filter the following responses based on this criteria: "${filter}". Respond ONLY with a JSON array of filtered responses, nothing else. Do not use markdown formatting. Responses: ${JSON.stringify(responses)}` },
      ],
    });

    const content = completion.choices[0].message.content || '[]';
    console.log('Raw GPT response:', content);
    
    const cleanedContent = cleanMarkdown(content);
    console.log('Cleaned content:', cleanedContent);

    let filteredResponses;
    try {
      filteredResponses = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Error parsing GPT response:', parseError);
      // Fallback: return all responses if parsing fails
      filteredResponses = responses;
    }

    // Ensure the result is an array
    if (!Array.isArray(filteredResponses)) {
      console.error('GPT response is not an array:', filteredResponses);
      filteredResponses = responses;
    }
    
    return NextResponse.json(filteredResponses);
  } catch (error) {
    console.error('Error filtering responses:', error);
    return NextResponse.json({ error: 'Error filtering responses' }, { status: 500 });
  }
}