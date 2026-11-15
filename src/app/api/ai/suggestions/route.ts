import { NextResponse } from 'next/server';
import { generateCivilTechAISuggestions } from '@/lib/ai-assistant';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const suggestions = generateCivilTechAISuggestions(body);
    return NextResponse.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar sugestões de IA' },
      { status: 500 }
    );
  }
}
