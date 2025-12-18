import { NextRequest, NextResponse } from 'next/server';
import { fetchProperties } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters = {
      city: searchParams.get('city') || undefined,
      stateOrProvince: searchParams.get('stateOrProvince') || undefined,
      priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
      priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
      bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
      propertyType: searchParams.get('propertyType') || undefined,
      mlsStatus: searchParams.get('mlsStatus') || undefined,
      top: searchParams.get('top') ? Number(searchParams.get('top')) : 50,
    };

    const response = await fetchProperties(filters);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
