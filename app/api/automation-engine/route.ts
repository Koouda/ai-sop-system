import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function POST(req: Request) {
  try {
    const { operationId } = await req.json()

    if (!operationId) {
      return NextResponse.json(
        { error: 'operationId is required' },
        { status: 400 }
      )
    }

    const { data: operation, error: operationError } = await supabase
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

    const { data: rules, error: rulesError } = await supabase
      .from('automation_rules')
      .select('*')
      .eq('is_active', true)

    if (rulesError) {
      return NextResponse.json(
        { error: rulesError.message },
        { status: 500 }
      )
    }

    const today = new Date().toISOString().split('T')[0]
    const matchedActions: any[] = []

    for (const rule of rules || []) {
      const condition = rule.trigger_condition || {}
      let matched = true

      if (condition.priority) {
        const priority = operation.priority || operation.ai_urgency
        matched = matched && condition.priority.includes(priority)
      }

      if ('assigned_to' in condition) {
        matched =
          matched &&
          (condition.assigned_to === null
            ? !operation.assigned_to
            : operation.assigned_to === condition.assigned_to)
      }

      if (condition.due_status === 'overdue') {
        matched =
          matched &&
          operation.due_date &&
          operation.due_date < today &&
          operation.status !== 'completed' &&
          operation.status !== 'cancelled'
      }

      if (!matched) continue

      matchedActions.push({
        rule_id: rule.id,
        rule_name: rule.rule_name,
        action_type: rule.action_type,
        action_payload: rule.action_payload,
      })

      if (rule.action_type === 'mark_for_escalation') {
        await supabase.from('operation_workflows').upsert(
          {
            operation_id: operation.id,
            workflow_priority: 'High',
            escalation_level:
              rule.action_payload?.escalation_level || 'Command',
            mission_impact: 'Critical',
            severity_score: 90,
            resolution_complexity: 'Critical',
            matched_rules: [
              {
                rule_name: rule.rule_name,
                matched_keyword:
                  rule.action_payload?.reason || 'Automation rule matched',
              },
            ],
            suggested_documents: ['Incident Report', 'Risk Assessment'],
          },
          { onConflict: 'operation_id' }
        )
      }

      if (rule.action_type === 'generate_document') {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/generate-document`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            operationId: operation.id,
            documentType:
              rule.action_payload?.document_type || 'Incident Report',
          }),
        }).catch(() => null)
      }

      if (rule.action_type === 'create_alert') {
        await supabase.from('operation_logs').insert([
          {
            operation_id: operation.id,
            action: 'automation_alert',
            old_value: null,
            new_value: rule.action_payload?.alert_type || 'Alert',
            note:
              rule.action_payload?.severity ||
              'Automation alert generated',
          },
        ])
      }
    }

    return NextResponse.json({
      success: true,
      operationId,
      matchedActions,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Automation engine failed' },
      { status: 500 }
    )
  }
}