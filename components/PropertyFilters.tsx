'use client';

import { PropertyFilters as FilterType } from '@/types/property';
import { useState } from 'react';

interface PropertyFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
  onReset: () => void;
}

const PROPERTY_TYPES = [
  'Residential Condo & Other',
  'Residential',
  'Commercial',
  'Farm',
  'Land',
];

const MLS_STATUSES = [
  'Sold',
  'Active',
  'Pending',
  'Expired',
  'Withdrawn',
  'Cancelled',
  'Hold',
  'New',
];

const PROVINCES = [
  'ON',
  'BC',
  'AB',
  'QC',
  'NS',
  'NB',
  'MB',
  'PE',
  'SK',
  'NL',
  'YT',
  'NT',
  'NU',
];

export default function PropertyFilters({
  filters,
  onFilterChange,
  onReset,
}: PropertyFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterType>(filters);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleChange = (key: keyof FilterType, value: any) => {
    const newFilters = { ...localFilters, [key]: value || undefined };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const emptyFilters: FilterType = {};
    setLocalFilters(emptyFilters);
    onReset();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">Filters</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 text-sm font-medium text-black hover:text-gray-700 transition-colors duration-200 cursor-pointer"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
          <button
            onClick={handleReset}
            className="px-5 py-2 text-sm font-medium bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-sm cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* City - Most Important */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              City *
            </label>
            <input
              type="text"
              value={localFilters.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="e.g., Brampton"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-400 transition-all duration-200 bg-white"
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Min Price (≥)
            </label>
            <input
              type="number"
              value={localFilters.priceMin || ''}
              onChange={(e) =>
                handleChange(
                  'priceMin',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              placeholder="Minimum price"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-400 transition-all duration-200 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Max Price (≤)
            </label>
            <input
              type="number"
              value={localFilters.priceMax || ''}
              onChange={(e) =>
                handleChange(
                  'priceMax',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              placeholder="Maximum price"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-400 transition-all duration-200 bg-white"
            />
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Bedrooms
            </label>
            <input
              type="number"
              min="0"
              value={localFilters.bedrooms || ''}
              onChange={(e) =>
                handleChange(
                  'bedrooms',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              placeholder="Number of bedrooms"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-400 transition-all duration-200 bg-white"
            />
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Property Type
            </label>
            <select
              value={localFilters.propertyType || ''}
              onChange={(e) => handleChange('propertyType', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white transition-all duration-200"
            >
              <option value="" className="text-gray-400">
                All Types
              </option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type} className="text-black">
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* MLS Status */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              MLS Status
            </label>
            <select
              value={localFilters.mlsStatus || ''}
              onChange={(e) => handleChange('mlsStatus', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white transition-all duration-200"
            >
              <option value="" className="text-gray-400">
                All Statuses
              </option>
              {MLS_STATUSES.map((status) => (
                <option key={status} value={status} className="text-black">
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Province */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Province
            </label>
            <select
              value={localFilters.stateOrProvince || ''}
              onChange={(e) => handleChange('stateOrProvince', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white transition-all duration-200"
            >
              <option value="" className="text-gray-400">
                All Provinces
              </option>
              {PROVINCES.map((province) => (
                <option key={province} value={province} className="text-black">
                  {province}
                </option>
              ))}
            </select>
          </div>

          {/* Results Limit */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Results Limit
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={localFilters.top || 50}
              onChange={(e) =>
                handleChange(
                  'top',
                  e.target.value ? Number(e.target.value) : 50
                )
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-400 transition-all duration-200 bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}
