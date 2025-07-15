import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const Table = ({ columns, data, onSort, sortKey, sortDirection }) => {
  const handleSort = (key) => {
    if (!onSort) return;

    const newDirection =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    onSort(key, newDirection);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                }`}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && (
                    <div className="flex flex-col">
                      <ChevronUp
                        className={`w-3 h-3 ${
                          sortKey === column.key && sortDirection === "asc"
                            ? "text-blue-500"
                            : "text-gray-300"
                        }`}
                      />
                      <ChevronDown
                        className={`w-3 h-3 -mt-1 ${
                          sortKey === column.key && sortDirection === "desc"
                            ? "text-blue-500"
                            : "text-gray-300"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.render
                    ? column.render(item[column.key], item)
                    : item[column.key] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="text-center py-12 text-gray-500">No data available</div>
      )}
    </div>
  );
};

export default Table;
