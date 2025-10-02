"use client";

import React from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import Pagination from "./pagination";

interface DataTableProps<T extends object> {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  isLoading?: boolean;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
}

const DataTableBody = <T extends object>({
  columns,
  data,
  isLoading,
  totalPages = 1,
  currentPage,
  showPagination = false,
  onPageChange,
}: DataTableProps<T>) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col">
        <div className="-m-2 overflow-x-auto relative">
          <div className="p-2 min-w-full inline-block align-middle">
            <div className="bg-white border border-neutral-300 rounded-b-xl dark:bg-neutral-800 dark:border-neutral-600">
              <table className="min-w-full divide-y bg-white divide-neutral-200 dark:bg-neutral-800 dark:divide-neutral-600">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <th
                            key={header.id}
                            colSpan={header.colSpan}
                            className="px-6 py-3 text-start"
                          >
                            {header.isPlaceholder ? null : (
                              <div
                                {...{
                                  className: header.column.getCanSort()
                                    ? "cursor-pointer select-none flex items-center gap-x-2"
                                    : "flex items-center gap-x-2",
                                  onClick:
                                    header.column.getToggleSortingHandler(),
                                }}
                              >
                                <span className="text-sm font-normal text-neutral-600 dark:text-neutral-200">
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                </span>
                                <span>
                                  {{
                                    asc: (
                                      <FaSortUp className="w-4 h-4 text-neutral-400" />
                                    ),
                                    desc: (
                                      <FaSortDown className="w-4 h-4 text-neutral-400" />
                                    ),
                                  }[header.column.getIsSorted() as string] ?? (
                                    <FaSort className="w-4 h-4 text-neutral-400" />
                                  )}
                                </span>
                              </div>
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-neutral-300 dark:divide-neutral-600">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index} className="animate-pulse">
                        {columns.map((_, colIndex) => (
                          <td
                            key={colIndex}
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            <div className="h-4 bg-neutral-200 rounded"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-6 py-4 whitespace-normal text-wrap max-w-xs"
                          >
                            <span className="block text-sm font-normal text-neutral-800 dark:text-neutral-100">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="text-center py-5 font-bold"
                      >
                        No data records
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {showPagination && (
          <Pagination
            currentPage={currentPage || 0}
            totalPages={totalPages}
            onPageChange={onPageChange!}
          />
        )}
      </div>
    </div>
  );
};

export default DataTableBody;
