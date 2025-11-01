'use client';

import { Search, Filter } from 'lucide-react';

const SearchBar = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="px-3 py-2 bg-white border-b border-slate-100">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar o comenzar un chat"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-12 py-2 bg-slate-50 border-none rounded-lg text-sm outline-none focus:ring-0 placeholder:text-slate-500"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors">
          <Filter className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
