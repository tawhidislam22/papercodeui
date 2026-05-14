import { NextRequest, NextResponse } from 'next/server';

const JUDGE0_URL = 'https://ce.judge0.com/submissions?wait=true';

interface Judge0Response {
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  status?: { description: string };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      code?: string;
      languageId?: number;
      stdin?: string;
    };
    const { code, languageId = 109, stdin = '' } = body; // 109 = Python 3 on ce.judge0.com

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    const judge0Res = await fetch(JUDGE0_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin,
      }),
    });

    if (!judge0Res.ok) {
      const text = await judge0Res.text();
      console.error('[execute-code] Judge0 error:', judge0Res.status, text);
      return NextResponse.json(
        { error: `Judge0 returned ${judge0Res.status}: ${text}` },
        { status: 502 }
      );
    }

    const data: Judge0Response = await judge0Res.json();

    const output =
      data.stdout?.trim() ||
      data.stderr?.trim() ||
      data.compile_output?.trim() ||
      data.message?.trim() ||
      'No output';

    return NextResponse.json({
      output,
      status: data.status?.description ?? 'Unknown',
    });
  } catch (error) {
    console.error('[execute-code] Error:', error);
    return NextResponse.json(
      { error: 'Failed to execute code' },
      { status: 500 }
    );
  }
}
