'use client';

import { Property, HistoryTransactional } from '@/types/property';
import React, { useState } from 'react';

interface PropertyTableProps {
  properties: Property[];
}

export default function PropertyTable({ properties }: PropertyTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<
    Record<string, HistoryTransactional[]>
  >({});
  const [loadingHistory, setLoadingHistory] = useState<string | null>(null);

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-CA');
  };

  const handleRowClick = async (listingKey: string) => {
    if (expandedRow === listingKey) {
      setExpandedRow(null);
      return;
    }

    setExpandedRow(listingKey);

    // Fetch history if not already loaded
    if (!historyData[listingKey]) {
      setLoadingHistory(listingKey);
      try {
        const response = await fetch(
          `/api/history?listingKey=${encodeURIComponent(listingKey)}`
        );
        if (!response.ok) throw new Error('Failed to fetch history');
        const data = await response.json();
        setHistoryData({ ...historyData, [listingKey]: data.value });
      } catch (error) {
        console.error('Error fetching history:', error);
        setHistoryData({ ...historyData, [listingKey]: [] });
      } finally {
        setLoadingHistory(null);
      }
    }
  };

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 text-lg">
          No properties found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                List Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                Close Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                Bed/Bath
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                Area (sq ft)
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                Days on Market
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((property) => {
              const isExpanded = expandedRow === property.ListingKey;
              const history = historyData[property.ListingKey] || [];
              const isLoadingHistory = loadingHistory === property.ListingKey;

              return (
                <React.Fragment key={property.ListingKey}>
                  <tr
                    onClick={() => handleRowClick(property.ListingKey)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {property.StreetNumber} {property.StreetName}{' '}
                        {property.StreetSuffix}
                        {property.UnitNumber && ` #${property.UnitNumber}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {property.PostalCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {property.City}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(property.ListPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(property.ClosePrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{property.PropertyType}</div>
                      <div className="text-xs text-gray-500">
                        {property.PropertySubType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {property.BedroomsTotal} bed /{' '}
                      {property.BathroomsTotalInteger} bath
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {property.BuildingAreaTotal?.toLocaleString()}{' '}
                      {property.BuildingAreaUnits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          property.MlsStatus === 'Sold'
                            ? 'bg-green-100 text-green-800'
                            : property.MlsStatus === 'Active'
                            ? 'bg-blue-100 text-blue-800'
                            : property.MlsStatus === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {property.MlsStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {property.DaysOnMarket || 0}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={9} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-4">
                          {/* Property Details */}
                          <div>
                            <h4 className="font-semibold text-black mb-3">
                              Property Details
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-700 font-medium">
                                  Listing Key:
                                </span>
                                <span className="ml-2 font-semibold text-black">
                                  {property.ListingKey}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-700 font-medium">
                                  Year Built:
                                </span>
                                <span className="ml-2 font-semibold text-black">
                                  {property.YearBuilt ||
                                    property.ApproximateAge ||
                                    'N/A'}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-700 font-medium">
                                  Parking:
                                </span>
                                <span className="ml-2 font-semibold text-black">
                                  {property.ParkingTotal || 0}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-700 font-medium">
                                  Tax Assessed:
                                </span>
                                <span className="ml-2 font-semibold text-black">
                                  {formatCurrency(property.TaxAssessedValue)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-700 font-medium">
                                  Listing Date:
                                </span>
                                <span className="ml-2 font-semibold text-black">
                                  {formatDate(property.ListingContractDate)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-700 font-medium">
                                  Close Date:
                                </span>
                                <span className="ml-2 font-semibold text-black">
                                  {formatDate(property.CloseDate || null)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-700 font-medium">
                                  Original List Price:
                                </span>
                                <span className="ml-2 font-semibold text-black">
                                  {formatCurrency(property.OriginalListPrice)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-700 font-medium">
                                  Association Fee:
                                </span>
                                <span className="ml-2 font-semibold text-black">
                                  {formatCurrency(property.AssociationFee)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Public Remarks */}
                          {property.PublicRemarks && (
                            <div>
                              <h4 className="font-semibold text-black mb-3">
                                Description
                              </h4>
                              <p className="text-sm text-black leading-relaxed">
                                {property.PublicRemarks}
                              </p>
                            </div>
                          )}

                          {/* Virtual Tour */}
                          {property.VirtualTourURLUnbranded && (
                            <div>
                              <h4 className="font-semibold text-black mb-3">
                                Virtual Tour
                              </h4>
                              <a
                                href={property.VirtualTourURLUnbranded}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer hover:underline"
                              >
                                View Virtual Tour →
                              </a>
                            </div>
                          )}

                          {/* History Transactional */}
                          <div>
                            <h4 className="font-semibold text-black mb-3">
                              History Transactional
                            </h4>
                            {isLoadingHistory ? (
                              <div className="text-sm text-black">
                                Loading history...
                              </div>
                            ) : history.length > 0 ? (
                              <div className="max-h-64 overflow-y-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-black">
                                        Field Name
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-black">
                                        Old Value
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-black">
                                        New Value
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-black">
                                        Modified
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {history.map((hist, idx) => (
                                      <tr key={idx}>
                                        <td className="px-4 py-2 font-medium text-black">
                                          {hist.FieldName}
                                        </td>
                                        <td className="px-4 py-2 text-black">
                                          {hist.OldValue || '-'}
                                        </td>
                                        <td className="px-4 py-2 font-semibold text-black">
                                          {hist.NewValue || '-'}
                                        </td>
                                        <td className="px-4 py-2 text-black">
                                          {formatDate(
                                            hist.ModificationTimestamp
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-sm text-black">
                                No history available
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
