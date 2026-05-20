import React from 'react';
import { EventCategory } from '../types';
import { cn } from '../utils/cn';
import { Filter, SlidersHorizontal } from 'lucide-react';

interface FiltersProps {
  selectedCategory: EventCategory | 'All';
  setSelectedCategory: (category: EventCategory | 'All') => void;
  categories: (EventCategory | 'All')[];
}

const Filters: React.FC<FiltersProps> = ({ selectedCategory, setSelectedCategory, categories }) => {
  return (
    <div className="flex flex-col gap-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Explore Events</h2>
        </div>
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-indigo-50 transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
          <span>More Filters</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              selectedCategory === category
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filters;
