"use client";

import React from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const visiblePages = 3; // Number of visible pagination items
  const halfVisible = Math.floor(visiblePages / 2);

  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, currentPage + halfVisible);

  if (currentPage <= halfVisible + 1) {
    endPage = Math.min(totalPages, visiblePages);
  } else if (currentPage + halfVisible >= totalPages) {
    startPage = Math.max(1, totalPages - visiblePages + 1);
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageButtonClass = (page: number) => {
    const baseClass =
      "relative inline-flex cursor-pointer  items-center justify-center border border-gray-300  px-4 py-2.5 text-sm font-semibold";
    const activeClass =
      "z-10 bg-[#129D93] hover:bg-[#129D93]/80 text-white border-muted-3";
    const inactiveClass =
      "bg-transparent border-muted-3 text-text hover:text-heading";

    return `${baseClass} ${currentPage === page ? activeClass : inactiveClass}`;
  };

  const renderPageNumbers = () => {
    const pages: React.ReactNode[] = [];

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          type="button"
          onClick={() => onPageChange(1)}
          className={getPageButtonClass(1)}
          aria-label="Go to first page"
        >
          1
        </button>
      );

      if (startPage > 2) {
        pages.push(
          <span
            key="ellipsis-start"
            className="px-2 text-gray-800 "
            aria-hidden="true"
          >
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          type="button"
          onClick={() => onPageChange(i)}
          className={getPageButtonClass(i)}
          aria-label={`Go to page ${i}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span
            key="ellipsis-end"
            className="px-2 text-gray-800 "
            aria-hidden="true"
          >
            ...
          </span>
        );
      }

      pages.push(
        <button
          key={totalPages}
          type="button"
          onClick={() => onPageChange(totalPages)}
          className={getPageButtonClass(totalPages)}
          aria-label="Go to last page"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex w-full items-center justify-center">
      <nav className="flex items-center mt-4" aria-label="Pagination">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="relative inline-flex cursor-pointer  items-center justify-center rounded-l-xl border border-gray-300  bg-transparent px-4 py-2.5 text-sm font-semibold text-text shadow-sm hover:text-heading"
          aria-label="Previous page"
        >
          <span className="sr-only">Previous</span>
          <MdKeyboardArrowLeft className="h-5 w-5" />
        </button>
        {renderPageNumbers()}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="relative  inline-flex cursor-pointer  items-center justify-center rounded-r-xl border border-gray-300  bg-transparent px-4 py-2.5 text-sm font-semibold text-text shadow-sm hover:text-heading"
          aria-label="Next page"
        >
          <span className="sr-only">Next</span>
          <MdKeyboardArrowRight className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
