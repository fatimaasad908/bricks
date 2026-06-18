import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown } from 'lucide-react';
import { exportToCSV, exportToExcel, exportToPDF } from '../utils/exportUtils';

export default function ExportButton({ filteredData, allData, headers, keys, title = 'Export List', filename = 'export' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (format, type) => {
    setIsOpen(false);
    const dataToExport = type === 'filtered' ? filteredData : allData;
    const currentFilename = `${filename}_${type}`;

    if (format === 'csv') {
      exportToCSV(dataToExport, headers, keys, currentFilename);
    } else if (format === 'excel') {
      exportToExcel(dataToExport, headers, keys, currentFilename);
    } else if (format === 'pdf') {
      exportToPDF(dataToExport, headers, keys, title, currentFilename);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-gray-200 text-brown-900 px-4 py-2 rounded-lg text-sm font-semibold hover:border-terracotta-500 transition-colors shadow-sm cursor-pointer"
      >
        <Download className="w-4 h-4 text-terracotta-600" />
        <span>Export List</span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-gray-100 shadow-xl z-30 overflow-hidden py-1.5 text-xs text-left">
          <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">
            CSV Format
          </div>
          <button
            onClick={() => handleExport('csv', 'filtered')}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 font-medium text-brown-900 flex justify-between"
          >
            <span>CSV (Current Search)</span>
            <span className="text-gray-400">({filteredData.length})</span>
          </button>
          <button
            onClick={() => handleExport('csv', 'all')}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 font-medium text-brown-900 flex justify-between border-b border-gray-50/50"
          >
            <span>CSV (All Records)</span>
            <span className="text-gray-400">({allData.length})</span>
          </button>

          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1 mt-1">
            Excel Format (.xlsx)
          </div>
          <button
            onClick={() => handleExport('excel', 'filtered')}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 font-medium text-brown-900 flex justify-between"
          >
            <span>Excel (Current Search)</span>
            <span className="text-gray-400">({filteredData.length})</span>
          </button>
          <button
            onClick={() => handleExport('excel', 'all')}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 font-medium text-brown-900 flex justify-between border-b border-gray-50/50"
          >
            <span>Excel (All Records)</span>
            <span className="text-gray-400">({allData.length})</span>
          </button>

          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1 mt-1">
            PDF Document
          </div>
          <button
            onClick={() => handleExport('pdf', 'filtered')}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 font-medium text-brown-900 flex justify-between"
          >
            <span>PDF (Current Search)</span>
            <span className="text-gray-400">({filteredData.length})</span>
          </button>
          <button
            onClick={() => handleExport('pdf', 'all')}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 font-medium text-brown-900 flex justify-between"
          >
            <span>PDF (All Records)</span>
            <span className="text-gray-400">({allData.length})</span>
          </button>
        </div>
      )}
    </div>
  );
}
