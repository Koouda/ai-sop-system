import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { operationId, documentType } = body

    if (!operationId || !documentType) {
      return NextResponse.json(
        { error: 'operationId and documentType are required' },
        { status: 400 }
      )
    }

    const { data: operation, error: operationError } = await supabaseAdmin
      .from('operations')
      .select('*')
      .eq('id', operationId)
      .single()

    if (operationError || !operation) {
      return NextResponse.json(
        { error: 'Operation not found' },
        { status: 404 }
      )
    }

    const { data: template, error: templateError } = await supabaseAdmin
      .from('document_templates')
      .select('*')
      .eq('template_type', documentType)
      .maybeSingle()

    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Document template not found' },
        { status: 404 }
      )
    }

    const sections = template.template_content?.sections || []
    const isChecklist = documentType === 'Action Checklist'

    const prompt = `
أنت مساعد متخصص في إعداد الوثائق التشغيلية الرسمية باللغة العربية.

نوع المستند:
${documentType}

اسم القالب:
${template.name}

وصف القالب:
${template.description || ''}

الأقسام المطلوبة من القالب:
${JSON.stringify(sections, null, 2)}

بيانات العملية:
${JSON.stringify(operation, null, 2)}

اكتب باللغة العربية فقط.
أعد النتيجة بصيغة JSON فقط بدون Markdown وبدون أي شرح خارج JSON.

يجب استخدام أقسام القالب كما هي، وعدم تغيير أسمائها.

${
  isChecklist
    ? `
المطلوب هنا نموذج إجراءات تنفيذي مباشر لحل المشكلة، وليس تقريرًا عامًا.

يجب أن تكون الخطوات عملية وواضحة وقابلة للتنفيذ.
تجنب العبارات العامة مثل: "يجب إعداد خطة".
اكتب ماذا يفعل الفريق خطوة بخطوة.

في قسم "خطوات التنفيذ التفصيلية":
اكتب 10 إلى 15 خطوة مرقمة.
كل خطوة يجب أن تبدأ بفعل تنفيذي واضح مثل:
تحقق، افحص، قارن، وثق، أعد، اعتمد، أبلغ، نفذ، راجع.

في قسم "نقاط التحقق أثناء التنفيذ":
اكتب نقاط تحقق عملية.

في قسم "معايير قبول اكتمال الإجراء":
اكتب شروط واضحة تؤكد أن المشكلة حُلت.

في قسم "مسار التصعيد عند التعثر":
حدد متى يتم التصعيد، ولمن، وما البيانات التي ترفق.

`
    : `
المطلوب إنشاء مستند تشغيلي مفصل واحترافي.
اجعل كل قسم مفصلًا وليس مختصرًا.
كل قسم يجب أن يحتوي على 5 إلى 8 أسطر على الأقل.
استخدم صياغة رسمية مناسبة للجهات التشغيلية والعسكرية والفنية.
`
}

أعد JSON بهذا الشكل فقط:
{
  "title": "",
  "document_type": "${documentType}",
  "template_id": "${template.id}",
  "sections": [
    {
      "heading": "",
      "content": ""
    }
  ],
  "recommendations": [],
  "required_actions": [],
  "approval_notes": ""
}

يجب أن تكون جميع الأقسام الموجودة في template sections ممثلة داخل sections بنفس الترتيب.
التوصيات يجب ألا تقل عن 5.
الإجراءات المطلوبة يجب ألا تقل عن 5.
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content:
            'أنت مولّد وثائق تشغيلية رسمي. تكتب باللغة العربية فقط وتعيد JSON صالح فقط بدون Markdown.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
    })

    const content = completion.choices[0]?.message?.content || '{}'

    const cleanedContent = content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    const parsed = JSON.parse(cleanedContent)

    const { data: savedDocument, error: saveError } = await supabaseAdmin
      .from('generated_documents')
      .insert([
        {
          operation_id: operationId,
          template_id: template.id,
          title: parsed.title || documentType,
          document_type: parsed.document_type || documentType,
          generated_content: parsed,
          status: 'generated',
        },
      ])
      .select()
      .single()

    if (saveError) {
      return NextResponse.json(
        { error: saveError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      document: savedDocument,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Document generation failed' },
      { status: 500 }
    )
  }
}