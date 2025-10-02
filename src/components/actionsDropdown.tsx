"use client";

import React, { useEffect, useRef } from "react";
import { FaEllipsisV } from "react-icons/fa";
import Link from "next/link";

interface ActionItem {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void; 
  href?: string; 
  className?: string;
}

interface ActionsDropdownProps {
  actions: ActionItem[];
}

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({ actions }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // For 1-2 actions, render inline buttons
  if (actions.length <= 2) {
    return (
      <div className="flex space-x-2">
        {actions.map((action, index) =>
          action.href ? (
            <Link
              key={index}
              href={action.href}
              className={`py-2 px-2 inline-flex items-center gap-x-2 text-xs font-medium rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white dark:hover:bg-neutral-700 ${
                action.className || ""
              }`}
            >
              {action.icon}
              {action.label}
            </Link>
          ) : (
            <button
              key={index}
              onClick={() => action.onClick?.()}
              className={`py-2 px-2 inline-flex items-center gap-x-2 text-xs font-medium rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white dark:hover:bg-neutral-700 ${
                action.className || ""
              }`}
            >
              {action.icon}
              {action.label}
            </button>
          )
        )}
      </div>
    );
  }

  // For 3+ actions, render dropdown
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaEllipsisV className="h-4 w-4" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right z-50 absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-neutral-700 ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {actions.map((action, index) =>
              action.href ? (
                <Link
                  key={index}
                  href={action.href}
                  className={`px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 w-full text-left flex items-center ${
                    action.className || ""
                  }`}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-2">{action.icon}</span>
                  {action.label}
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick?.();
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 w-full text-left flex items-center ${
                    action.className || ""
                  }`}
                  role="menuitem"
                >
                  <span className="mr-2">{action.icon}</span>
                  {action.label}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionsDropdown;
