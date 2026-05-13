import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request) {
  try {
    const body = await request.json()

    const { title, description } = body

    const response = await client.chat.completions.create({
      model: 'gpt-4.1-mini',

      response_format: {
        type: 'json_object',
      },

      messages: [
        {
          role: 'system',
          content: `
You are an operations analysis AI.

Return valid JSON only.

Required format:
{
  "summary": "",
  "category": "",
  "urgency": "",
  "suggested_action": ""
}
`,
        },
        {
          role: 'user',
          content: `
Title: ${title}

Description:
${description}
`,
        },
      ],
    })

    const result = response.choices[0].message.content

    return Response.json({
      result,
    })

  } catch (error) {
    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    )
  }
}