"use client";

import { HiMiniBars4, HiMagnifyingGlass } from "react-icons/hi2";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import DarkModeToggle from "./darkModeToggle";
import { useAuth } from "../utils/authContext";
import { useGlobalState } from "../utils/globalStateContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FullScreen from "./fullScreen";

const userNavigation = [
  { name: "Profile", url: "/profile" },
  { name: "Change password", url: "/change-password" },
  { name: "Sign out", url: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Header = ({ setSidebarOpen }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { setSearchQuery } = useGlobalState();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <div>
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b border-neutral-200 dark:border-neutral-700 gap-x-4 bg-white dark:bg-neutral-800 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 dark:text-white lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <HiMiniBars4 className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Separator */}
        <div
          className="h-6 w-px bg-gray-900/10 dark:bg-white/10 lg:hidden"
          aria-hidden="true"
        />

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          {/* <SearchTable /> */}

          <div className="flex-1 hidden max-w-xs m-auto sm:block">
            <label htmlFor="" className="sr-only">
              {" "}
              Search{" "}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <HiMagnifyingGlass
                  className="w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>

              <input
                type="search"
                name="search"
                onChange={handleSearchChange}
                className="block w-full py-2 pl-10 border dark:text-gray-300 dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                placeholder="Type to search"
              />
            </div>
          </div>

          {/* Separator */}

          <div className="flex flex-1 justify-end items-center gap-x-4 lg:gap-x-6">
            <div
              className="h-6 w-px bg-gray-900/10 dark:bg-white/10 lg:hidden"
              aria-hidden="true"
            />
            <FullScreen />

            {/* Separator */}
            <div
              className="h-6 w-px bg-gray-900/10 dark:bg-white/10 lg:hidden"
              aria-hidden="true"
            />

            <DarkModeToggle />

            {/* Separator */}
            <div
              className="h-6 w-px bg-gray-900/10 dark:bg-white/10 lg:hidden"
              aria-hidden="true"
            />

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <MenuButton className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>
                <Image
                  className="h-8 w-8 rounded-full bg-gray-50"
                  src={`https://ui-avatars.com/api/?name=${user?.fullname}&background=random&size=40`}
                  alt=""
                  width={40}
                  height={40}
                />
              </MenuButton>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems className="absolute right-0 z-10 mt-2.5 w-56 origin-top-right rounded-md bg-white dark:bg-neutral-800 py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <div className="py-3 px-5 bg-gray-100 rounded-t-lg dark:bg-neutral-700">
                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                      Signed in as
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-neutral-200">
                      {user?.roles?.length ? user.roles.join(", ") : "role"}
                    </p>
                  </div>
                  {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                      {({ active }) =>
                        item.name === "Sign out" ? (
                          <button
                            onClick={handleLogout}
                            className={classNames(
                              active ? "bg-neutral-50 dark:bg-neutral-700" : "",
                              "block w-full text-left px-3 py-1 text-sm leading-6 text-gray-900 dark:text-white"
                            )}
                          >
                            {item.name}
                          </button>
                        ) : (
                          <Link
                            href={item.url}
                            className={classNames(
                              active ? "bg-neutral-50 dark:bg-neutral-700" : "",
                              "block px-3 py-1 text-sm leading-6 text-gray-900 dark:text-white"
                            )}
                          >
                            {item.name}
                          </Link>
                        )
                      }
                    </MenuItem>
                  ))}
                </MenuItems>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
