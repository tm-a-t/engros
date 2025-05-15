import { NextRequest, NextResponse } from 'next/server';
import { buildPool } from '@/lib/rss-utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  try {
    const posts = await buildPool(offset, limit);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching RSS posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}