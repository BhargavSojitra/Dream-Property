'use client';

import { useState, useEffect } from 'react';
import { Property, PropertyFilters, PropertyResponse } from '@/types/property';
import PropertyFiltersComponent from '@/components/PropertyFilters';
import PropertyTable from '@/components/PropertyTable';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilters>({
    city: 'Toronto',
    top: 50,
  });

  const loadProperties = async (currentFilters: PropertyFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (currentFilters.city) params.append('city', currentFilters.city);
      if (currentFilters.stateOrProvince) params.append('stateOrProvince', currentFilters.stateOrProvince);
      if (currentFilters.priceMin !== undefined) params.append('priceMin', currentFilters.priceMin.toString());
      if (currentFilters.priceMax !== undefined) params.append('priceMax', currentFilters.priceMax.toString());
      if (currentFilters.bedrooms !== undefined) params.append('bedrooms', currentFilters.bedrooms.toString());
      if (currentFilters.propertyType) params.append('propertyType', currentFilters.propertyType);
      if (currentFilters.mlsStatus) params.append('mlsStatus', currentFilters.mlsStatus);
      if (currentFilters.top) params.append('top', currentFilters.top.toString());

      const response = await fetch(`/api/properties?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.error || `Failed to fetch properties (${response.status})`;
        throw new Error(errorMessage);
      }
      
      if (!data || !data.value) {
        console.warn('Unexpected response format:', data);
        setProperties([]);
      } else {
        setProperties(data.value || []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load properties';
      setError(errorMessage);
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties(filters);
  }, []);

  const handleFilterChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    loadProperties(newFilters);
  };

  const handleResetFilters = () => {
    const defaultFilters: PropertyFilters = { top: 50 };
    setFilters(defaultFilters);
    loadProperties(defaultFilters);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Property Search</h1>
          <p className="text-gray-600">Search and filter property listings with detailed information</p>
        </header>

        <PropertyFiltersComponent
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {properties.length} {properties.length === 1 ? 'property' : 'properties'}
              {filters.city && ` in ${filters.city}`}
            </div>
            <PropertyTable properties={properties} />
          </>
        )}
      </div>
    </div>
  );
}