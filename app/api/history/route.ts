import { NextRequest, NextResponse } from 'next/server';
import { fetchHistoryTransactional } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const listingKey = searchParams.get('listingKey');

    if (!listingKey) {
      return NextResponse.json(
        { error: 'ListingKey is required' },
        { status: 400 }
      );
    }

    const response = await fetchHistoryTransactional(listingKey);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
