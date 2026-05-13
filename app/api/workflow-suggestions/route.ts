import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { operationId } = await req.json()

    if (!operationId) {
      return NextResponse.json(
        { error: 'operationId is required' },
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

    const { data: rules, error: rulesError } = await supabaseAdmin
      .from('workflow_rules')
      .select('*')
      .eq('is_active', true)

    if (rulesError) {
      return NextResponse.json(
        { error: rulesError.message },
        { status: 500 }
      )
    }

    const operationText = `
      ${operation.title || ''}
      ${operation.description || ''}
      ${operation.ai_summary || ''}
      ${operation.ai_category || ''}
    `.toLowerCase()

    const matchedRules: any[] = []

    for (const rule of rules || []) {
      const keywords = rule.trigger_keywords || []

      const matchedKeyword = keywords.find((keyword: string) =>
        operationText.includes(keyword.toLowerCase())
      )

      if (matchedKeyword) {
        matchedRules.push({
          rule_id: rule.id,
          rule_name: rule.name,
          matched_keyword: matchedKeyword,
          priority: rule.priority,
          suggested_documents: rule.suggested_documents || [],
        })
      }
    }

    const suggestedDocuments = Array.from(
      new Set(
        matchedRules.flatMap(
          (rule) => rule.suggested_documents || []
        )
      )
    )

    const priorityOrder: any = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    }

    const workflowPriority =
      matchedRules
        .map((rule) => rule.priority)
        .filter(Boolean)
        .sort(
          (a, b) =>
            (priorityOrder[b] || 0) - (priorityOrder[a] || 0)
        )[0] || 'normal'

    const aiPrompt = `
أنت محلل عمليات وتشغيل متخصص.

حلل العملية التالية:

${JSON.stringify(operation, null, 2)}

أعد JSON فقط بهذا الشكل:

{
  "severity_score": 0,
  "mission_impact": "",
  "escalation_level": "",
  "resolution_complexity": "",
  "ai_priority_reason": ""
}

القواعد:

severity_score:
من 1 إلى 100

mission_impact:
Low
Medium
High
Critical

escalation_level:
None
Supervisor
Management
Command

resolution_complexity:
Simple
Moderate
Complex
Critical

ai_priority_reason:
اشرح بالعربية سبب تقييم الأولوية.
`

    const aiCompletion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content:
            'أنت محلل عمليات احترافي. أعد JSON صالح فقط.',
        },
        {
          role: 'user',
          content: aiPrompt,
        },
      ],
      temperature: 0.2,
    })

    const aiContent =
      aiCompletion.choices[0]?.message?.content || '{}'

    const cleanedAIContent = aiContent
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    const aiAnalysis = JSON.parse(cleanedAIContent)

    const { data: savedWorkflow, error: saveError } =
      await supabaseAdmin
        .from('operation_workflows')
        .upsert(
          {
            operation_id: operationId,

            matched_rules: matchedRules,

            suggested_documents: suggestedDocuments,

            workflow_priority: workflowPriority,

            severity_score:
              aiAnalysis.severity_score || 0,

            mission_impact:
              aiAnalysis.mission_impact || 'Medium',

            escalation_level:
              aiAnalysis.escalation_level || 'Supervisor',

            resolution_complexity:
              aiAnalysis.resolution_complexity || 'Moderate',

            ai_priority_reason:
              aiAnalysis.ai_priority_reason || '',

            status:
              suggestedDocuments.length > 0
                ? 'suggested'
                : 'none',

            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'operation_id',
          }
        )
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

      operation: {
        id: operation.id,
        title: operation.title,
      },

      matched_rules: matchedRules,

      suggested_documents: suggestedDocuments,

      workflow_priority: workflowPriority,

      ai_analysis: aiAnalysis,

      workflow: savedWorkflow,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.message ||
          'Workflow prioritization engine failed',
      },
      { status: 500 }
    )
  }
}