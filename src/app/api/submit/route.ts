import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { providerName, website, modelName, inputPrice, outputPrice, userEmail } = body;

    // Validation
    if (!providerName || !website) {
      return NextResponse.json(
        { error: 'Provider name and website are required' },
        { status: 400 }
      );
    }

    // Insert into submissions table
    const stmt = db.prepare(`
      INSERT INTO submissions (provider_name, website, model_name, input_price, output_price, user_email)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      providerName,
      website,
      modelName || null,
      inputPrice ? parseFloat(inputPrice) : null,
      outputPrice ? parseFloat(outputPrice) : null,
      userEmail || null
    );

    // TODO: Trigger email notification to admin
    // TODO: Queue for verification

    return NextResponse.json(
      {
        success: true,
        message: 'Submission received! It will be reviewed and published soon.',
        submissionId: result.lastInsertRowid
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}