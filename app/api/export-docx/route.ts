import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
} from 'docx'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { documentId } = await req.json()

    if (!documentId) {
      return NextResponse.json(
        { error: 'documentId is required' },
        { status: 400 }
      )
    }

    const { data: generatedDocument, error } = await supabaseAdmin
      .from('generated_documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (error || !generatedDocument) {
      return NextResponse.json(
        { error: 'Generated document not found' },
        { status: 404 }
      )
    }

    const content = generatedDocument.generated_content || {}

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: generatedDocument.title || 'Generated Document',
              heading: HeadingLevel.TITLE,
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Document Type: ${generatedDocument.document_type}`,
                  bold: true,
                }),
              ],
            }),

            new Paragraph({ text: '' }),

            ...(content.sections || []).flatMap((section: any) => [
              new Paragraph({
                text: section.heading || 'Section',
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                text: section.content || '',
              }),
            ]),

            new Paragraph({
              text: 'Recommendations',
              heading: HeadingLevel.HEADING_1,
            }),

            ...(content.recommendations || []).map(
              (item: string) =>
                new Paragraph({
                  text: `• ${item}`,
                })
            ),

            new Paragraph({
              text: 'Required Actions',
              heading: HeadingLevel.HEADING_1,
            }),

            ...(content.required_actions || []).map(
              (item: string) =>
                new Paragraph({
                  text: `• ${item}`,
                })
            ),

            new Paragraph({
              text: 'Approval Notes',
              heading: HeadingLevel.HEADING_1,
            }),

            new Paragraph({
              text: content.approval_notes || '',
            }),
          ],
        },
      ],
    })

    const buffer = await Packer.toBuffer(doc)

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${generatedDocument.document_type}.docx"`,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'DOCX export failed' },
      { status: 500 }
    )
  }
}