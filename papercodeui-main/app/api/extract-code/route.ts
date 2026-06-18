import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Convert file to base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = (imageFile.type || 'image/jpeg') as
      | 'image/jpeg'
      | 'image/png'
      | 'image/gif'
      | 'image/webp';

    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? '' });

    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
            {
              text: `You are a precise code extraction engine.

Your task: Extract all programming code visible in this image exactly as written.

Rules:
- Output ONLY the raw code. No explanations, no markdown, no backticks, no language labels.
- Preserve every indentation character (spaces or tabs) exactly as shown.
- Preserve all line breaks as shown in the image.
- If there are multiple code snippets, concatenate them in order.
- Do NOT add any commentary before or after the code.
- Do NOT wrap in triple backticks or any code fences.
- If no code is visible, output exactly: # No code found`,
            },
          ],
        },
      ],
    });

    let code = result.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // Strip any accidental markdown fences the model might still produce
    code = code.replace(/^```[\w]*\n?/gm, '').replace(/```$/gm, '').trim();

    return NextResponse.json({ code });
  } catch (error) {
    console.error('[extract-code] Error:', error);
    return NextResponse.json(
      { error: 'Failed to extract code from image' },
      { status: 500 }
    );
  }
}
