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

    const { data: operation } = await supabase
      .from('operations')
      .select('*')
      .eq('id', operationId)
      .single()

    if (!operation) {
      return NextResponse.json(
        { error: 'Operation not found' },
        { status: 404 }
      )
    }

    const { data: members } = await supabase
      .from('operation_team_members')
      .select('*')
      .eq('is_available', true)

    if (!members || members.length === 0) {
      return NextResponse.json(
        { error: 'No available team members' },
        { status: 400 }
      )
    }

    const scoredMembers = await Promise.all(
      members.map(async (member) => {
        const { count } = await supabase
          .from('operations')
          .select('*', {
            count: 'exact',
            head: true,
          })
          .eq('assigned_to', member.full_name)
          .neq('status', 'completed')
          .neq('status', 'cancelled')

        let score = 100

        const workload = count || 0

        score -= workload * 10

        if (
          operation.ai_category === member.specialization
        ) {
          score += 40
        }

        if (
          operation.priority === 'critical'
        ) {
          score += 15
        }

        if (
          workload >= member.max_active_operations
        ) {
          score -= 50
        }

        return {
          ...member,
          workload,
          score,
        }
      })
    )

    scoredMembers.sort((a, b) => b.score - a.score)

    const bestMatch = scoredMembers[0]

    await supabase
      .from('operations')
      .update({
        assigned_to: bestMatch.full_name,
      })
      .eq('id', operation.id)

    await supabase
      .from('operation_logs')
      .insert([
        {
          operation_id: operation.id,
          action: 'smart_assignment',
          old_value: null,
          new_value: bestMatch.full_name,
          note: `AI assigned operation to ${bestMatch.full_name}`,
        },
      ])

    return NextResponse.json({
      success: true,
      assigned_to: bestMatch.full_name,
      specialization: bestMatch.specialization,
      workload: bestMatch.workload,
      score: bestMatch.score,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.message || 'Smart assignment failed',
      },
      { status: 500 }
    )
  }
}