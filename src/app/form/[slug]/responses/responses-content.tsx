'use client';

import { useState } from 'react';
import { Table } from "./table";
import { Chatbot } from "~~/components/chatbot";
import { ExportToCsv } from "~~/app/form/[slug]/responses/export-to-csv";

export function ResponsesContent({ initialResponses, schema }) {
  const [filter, setFilter] = useState('');
  const [filteredResponses, setFilteredResponses] = useState(initialResponses);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const applyFilter = async () => {
    if (filter.trim() === '') {
      setFilteredResponses(initialResponses);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/filter-responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses: initialResponses,
          filter: filter,
        }),
      });

      if (response.ok) {
        const filteredData = await response.json();
        setFilteredResponses(filteredData);
      } else {
        console.error('Failed to filter responses');
        setFilteredResponses(initialResponses);
      }
    } catch (error) {
      console.error('Error filtering responses:', error);
      setFilteredResponses(initialResponses);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex h-screen">
      <div className="w-2/3 pr-4 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Responses for: {schema.title}</h1>
          <ExportToCsv responses={filteredResponses} schema={schema} />
        </div>
        <div className="mb-4 flex">
          <input
            type="text"
            placeholder="Enter Magic Filter condition..."
            value={filter}
            onChange={handleFilterChange}
            className="flex-grow p-2 border border-gray-300 rounded-l"
          />
          <button
            onClick={applyFilter}
            disabled={isLoading}
            className={`px-4 py-2 bg-[#505F5A] text-white rounded-r ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#505F5A]'}`}
          >
            {isLoading ? 'Filtering...' : 'Apply Filter'}
          </button>
        </div>
        <div className="flex-grow overflow-auto">
          <Table responses={filteredResponses} schema={schema} />
        </div>
      </div>
      <div className="w-1/3 pl-4 flex flex-col">
        <div className="flex justify-center">
          <h2 className="text-2xl font-bold mb-4">RYO AI</h2>
        </div>
        <div className="flex-grow overflow-auto rounded-lg border border-gray-300 p-4 bg-white shadow-md">
          <Chatbot responses={filteredResponses} schema={schema} />
        </div>
      </div>
    </div>
  );
}