'use client';

import { useState, useEffect } from 'react';
import { Property, PropertyFilters } from '@/types/property';
import PropertyFiltersComponent from '@/components/PropertyFilters';
import PropertyTable from '@/components/PropertyTable';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilters>({
    city: 'Brampton',
    mlsStatus: 'New',
    top: 50,
  });

  const loadProperties = async (currentFilters: PropertyFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (currentFilters.city) params.append('city', currentFilters.city);
      if (currentFilters.stateOrProvince)
        params.append('stateOrProvince', currentFilters.stateOrProvince);
      if (currentFilters.priceMin !== undefined)
        params.append('priceMin', currentFilters.priceMin.toString());
      if (currentFilters.priceMax !== undefined)
        params.append('priceMax', currentFilters.priceMax.toString());
      if (currentFilters.bedrooms !== undefined)
        params.append('bedrooms', currentFilters.bedrooms.toString());
      if (currentFilters.propertyType)
        params.append('propertyType', currentFilters.propertyType);
      if (currentFilters.mlsStatus)
        params.append('mlsStatus', currentFilters.mlsStatus);
      if (currentFilters.top)
        params.append('top', currentFilters.top.toString());

      const response = await fetch(`/api/properties?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.error || `Failed to fetch properties (${response.status})`;
        throw new Error(errorMessage);
      }

      if (!data || !data.value) {
        console.warn('Unexpected response format:', data);
        setProperties([]);
      } else {
        setProperties(data.value || []);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load properties';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 text-white shadow-2xl">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-6 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="text-2xl font-bold">AMPRE Property Search</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
              Find Your Dream Property
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-blue-100 font-light">
              Search and discover premium real estate listings with advanced
              filtering
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm md:text-base">
              <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-lg">
                <span className="font-semibold">✓</span> Real-time MLS Data
              </div>
              <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-lg">
                <span className="font-semibold">✓</span> Advanced Filters
              </div>
              <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-lg">
                <span className="font-semibold">✓</span> Instant Results
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Client Testimonial Quote */}
        <div className="max-w-4xl mx-auto mb-8 bg-white rounded-2xl shadow-xl p-8 border-l-4 border-cyan-500">
          <div className="flex items-start gap-4">
            <svg
              className="w-12 h-12 text-cyan-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 32 32"
            >
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            <div>
              <p className="text-lg md:text-xl text-gray-700 italic mb-4 leading-relaxed">
                &ldquo;This platform revolutionized how we search for
                properties. The intuitive interface and powerful filters save us
                hours of work every single day. It&apos;s simply the best real
                estate search tool we&apos;ve ever used.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  SK
                </div>
                <div>
                  <p className="font-bold text-gray-900">Sarah Kaur</p>
                  <p className="text-sm text-gray-600">
                    Senior Real Estate Broker, Toronto
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <PropertyFiltersComponent
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent"></div>
            <p className="mt-6 text-gray-600 text-lg font-medium">
              Searching for your perfect property...
            </p>
            <p className="mt-2 text-gray-500 text-sm">
              Analyzing thousands of listings
            </p>
          </div>
        )}

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl p-6 mb-6 shadow-lg">
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-900 font-medium">Error: {error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-6 flex items-center justify-between bg-white rounded-xl shadow-md p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                  {properties.length}
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide">
                    Properties Found
                  </p>
                  <p className="font-semibold text-gray-900">
                    {filters.city && `in ${filters.city}`}
                    {filters.mlsStatus && ` • ${filters.mlsStatus} Listings`}
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>Real-time data</span>
              </div>
            </div>
            <PropertyTable properties={properties} />
          </>
        )}

        {/* Bottom Inspirational Section */}
        {!loading && properties.length > 0 && (
          <div className="mt-12 max-w-3xl mx-auto text-center bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 text-white rounded-2xl shadow-2xl p-10">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Find Your Next Investment?
            </h3>
            <p className="text-lg text-blue-100 mb-6">
              Join thousands of successful real estate professionals who trust
              our platform for property discovery
            </p>
            <div className="flex flex-wrap gap-8 justify-center text-center">
              <div>
                <div className="text-4xl font-bold mb-1">10K+</div>
                <div className="text-sm text-blue-200">Active Listings</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">500+</div>
                <div className="text-sm text-blue-200">Happy Brokers</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">24/7</div>
                <div className="text-sm text-blue-200">Live Updates</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
