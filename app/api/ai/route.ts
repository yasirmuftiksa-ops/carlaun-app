import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

const SERVICES = [
  'Home Cleaning',
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Gardening',
  'Caregiving',
  'Driver',
  'Laundry',
]

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error: 'Gemini API key is not configured.',
        },
        { status: 500 },
      )
    }

    const body = await request.json()

    const message =
      typeof body?.message === 'string'
        ? body.message.trim()
        : ''

    const language =
      typeof body?.language === 'string'
        ? body.language
        : 'en'

    if (!message) {
      return NextResponse.json(
        {
          error: 'Please enter a message.',
        },
        { status: 400 },
      )
    }

    const languageName =
      language === 'ta'
        ? 'Tamil'
        : language === 'hi'
          ? 'Hindi'
          : 'English'

    const prompt = `
You are the AI assistant inside NeXa Link.

NeXa Link is a cooperative platform for household and community services.
Customers can use it to find and book verified cooperative service providers.

Available services:
${SERVICES.map((service, index) => `${index}: ${service}`).join('\n')}

Customer message:
"${message}"

The customer's selected language is ${languageName}.

Your task:
1. Understand what service the customer needs.
2. Select the most appropriate service from the available services.
3. Detect whether the request is urgent or an emergency.
4. Give a short, simple explanation for why this service is appropriate.
5. Do not invent a service that is not in the available list.

Return ONLY valid JSON.
Do not use markdown.
Do not add text before or after the JSON.

Use exactly this structure:

{
  "serviceIndex": 0,
  "urgent": false,
  "reason": "Short explanation"
}

Rules:
- serviceIndex must be a number from 0 to 8.
- urgent must be true only when the customer clearly needs immediate/emergency help.
- reason should be short and useful.
- If the message is unclear, choose the closest service based on the available services.
`

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    })

    const text = response.text?.trim() || ''

    if (!text) {
      throw new Error('Gemini returned an empty response.')
    }

    let result: {
      serviceIndex: number
      urgent: boolean
      reason: string
    }

    try {
      result = JSON.parse(text)
    } catch {
      console.error('Gemini returned invalid JSON:', text)

      throw new Error(
        'Gemini returned an invalid response.',
      )
    }

    const serviceIndex = Number(result.serviceIndex)

    if (
      !Number.isInteger(serviceIndex) ||
      serviceIndex < 0 ||
      serviceIndex >= SERVICES.length
    ) {
      throw new Error(
        'Gemini returned an invalid service.',
      )
    }

    const urgent = Boolean(result.urgent)

    const reason =
      typeof result.reason === 'string' &&
      result.reason.trim()
        ? result.reason.trim()
        : `NeXa Link recommends ${SERVICES[serviceIndex]} based on your request.`

    return NextResponse.json({
      success: true,
      result: {
        serviceIndex,
        service: SERVICES[serviceIndex],
        urgent,
        reason,
      },
    })
  } catch (error) {
    console.error('NeXa Link Gemini API error:', error)

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unable to connect to Gemini.',
      },
      { status: 500 },
    )
  }
}