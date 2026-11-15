import { NextResponse } from 'next/server';
import { MOCK_LISTINGS } from '@/lib/mock-data';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('categoria');
  const city = searchParams.get('cidade');
  const query = searchParams.get('q');

  let results = [...MOCK_LISTINGS];

  if (category) {
    results = results.filter((l) => l.category_slug === category);
  }

  if (city) {
    results = results.filter((l) => l.city.toLowerCase().includes(city.toLowerCase()));
  }

  if (query) {
    const q = query.toLowerCase();
    results = results.filter((l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
  }

  return NextResponse.json({
    success: true,
    total: results.length,
    data: results,
  });
}
