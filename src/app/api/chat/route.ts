import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import type { NextApiRequest, NextApiResponse } from 'next'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    
    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid request body:', messages)
      return new Response('Invalid request body', { status: 400 })
    }

    const response = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      stream: true,
      messages
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API error:', errorData)
      return new Response('Error from OpenAI API', { status: response.status })
    }

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response('An unexpected error occurred', { status: 500 })
  }
}

// For compatibility with Pages Router
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const response = await POST(req as unknown as Request)
    const data = await response.text() // Change this from json() to text()
    res.status(response.status).send(data) // Use send() instead of json()
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}