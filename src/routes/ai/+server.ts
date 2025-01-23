import { json } from '@sveltejs/kit'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { API_KEY } from '$env/static/private'

const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function GET() {
  const prompt = 'Explain how AI works'

  const result = await model.generateContent(prompt)

  return json(result.response.text())
}

export async function POST({ request }) {
  const { data, mimeType } = await request.json()
  const result = await model.generateContent([
    {
      inlineData: {
        data,
        mimeType
      }
    },
    'Your job is to sort waste. You must only include a single word: "ORGANIC" or "RECYCLABLE" or "LANDFILL" in your response to sort the waste presented in the image or "ERROR" if the image supplied is irrelevant.'
  ])
  return json(result.response.text())
}