import {
  PropertyResponse,
  PropertyFilters,
  HistoryTransactionalResponse,
} from '@/types/property';

const API_BASE_URL = 'https://query.ampre.ca/odata';
const BEARER_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ2ZW5kb3IvdHJyZWIvMjgzNiIsImF1ZCI6IkFtcFVzZXJzUHJkIiwicm9sZXMiOlsiQW1wVmVuZG9yIl0sImlzcyI6InByb2QuYW1wcmUuY2EiLCJleHAiOjI1MzQwMjMwMDc5OSwiaWF0IjoxNzY0OTkzMjcwLCJzdWJqZWN0VHlwZSI6InZlbmRvciIsInN1YmplY3RLZXkiOiIyODM2IiwianRpIjoiYWMyZmE2YWZmMjk2ZWFhOSIsImN1c3RvbWVyTmFtZSI6InRycmViIn0.nlOCYD-OSO67UJkHE-1gcmvyaWFfbpXMLxdtH-xV_CM';

function buildODataFilter(filters: PropertyFilters): string {
  const filterParts: string[] = [];

  // Helper to escape single quotes in OData string values
  const escapeODataString = (value: string): string => {
    return value.replace(/'/g, "''");
  };

  if (filters.city) {
    // API doesn't support tolower(), contains(), or substringof()
    // Use multiple OR conditions for common case variations
    const city = filters.city;
    const cityLower = city.toLowerCase();
    const cityUpper = city.toUpperCase();
    const cityTitle =
      city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

    const cityVariations = [city, cityLower, cityUpper, cityTitle]
      .filter((v, i, arr) => arr.indexOf(v) === i) // Remove duplicates
      .map((v) => `City eq '${escapeODataString(v)}'`)
      .join(' or ');

    filterParts.push(`(${cityVariations})`);
  }

  if (filters.stateOrProvince) {
    filterParts.push(
      `StateOrProvince eq '${escapeODataString(filters.stateOrProvince)}'`
    );
  }

  if (filters.priceMin !== undefined) {
    filterParts.push(`ListPrice ge ${filters.priceMin}`);
  }

  if (filters.priceMax !== undefined) {
    filterParts.push(`ListPrice le ${filters.priceMax}`);
  }

  if (filters.bedrooms !== undefined) {
    filterParts.push(`BedroomsTotal eq ${filters.bedrooms}`);
  }

  if (filters.propertyType) {
    filterParts.push(
      `PropertyType eq '${escapeODataString(filters.propertyType)}'`
    );
  }

  if (filters.mlsStatus) {
    filterParts.push(`MlsStatus eq '${escapeODataString(filters.mlsStatus)}'`);
  }

  return filterParts.length > 0 ? `$filter=${filterParts.join(' and ')}` : '';
}

export async function fetchProperties(
  filters: PropertyFilters = {}
): Promise<PropertyResponse> {
  const filterString = buildODataFilter(filters);
  const top = filters.top || 50;

  // Build query parameters with proper URL encoding
  const queryParams: string[] = [];

  if (filterString) {
    // Extract the filter value (everything after $filter=) and encode it
    const filterValue = filterString.replace('$filter=', '');
    queryParams.push(`$filter=${encodeURIComponent(filterValue)}`);
  }
  queryParams.push(`$top=${top}`);
  queryParams.push(
    `$orderby=${encodeURIComponent('ModificationTimestamp desc')}`
  );

  const url = `${API_BASE_URL}/Property?${queryParams.join('&')}`;

  console.log('Fetching properties from:', url);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store', // Don't cache API responses
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      url: url,
      errorText,
    });
    throw new Error(
      `Failed to fetch properties: ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  console.log('API Response received:', { count: data.value?.length || 0 });
  return data;
}

export async function fetchHistoryTransactional(
  listingKey: string
): Promise<HistoryTransactionalResponse> {
  const filterString = encodeURIComponent(`ListingKey eq '${listingKey}'`);
  const url = `${API_BASE_URL}/HistoryTransactional?$filter=${filterString}&$orderby=ModificationTimestamp desc`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store', // Don't cache API responses
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch history: ${response.statusText}`);
  }

  return response.json();
}
