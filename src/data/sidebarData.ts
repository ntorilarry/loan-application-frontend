import { LuUserRoundPen } from "react-icons/lu";
import { RxDashboard } from "react-icons/rx";
import { FaClipboardUser } from "react-icons/fa6";
import { GrSystem } from "react-icons/gr";
import { MdOutlineApproval, MdPayment } from "react-icons/md";
import { CiShare1 } from "react-icons/ci";

export type NavigationSubItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

export type NavigationItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  subItems?: NavigationSubItem[];
};

export const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: RxDashboard,
  },
  {
    name: "Loan Management",
    href: "/loan-management",
    icon: LuUserRoundPen,
  },

  {
    name: "Approval",
    href: "/approval",
    icon: MdOutlineApproval,
  },
  {
    name: "Disbursement",
    href: "/disbursement",
    icon: CiShare1,
  },
  {
    name: "Repayment",
    href: "/repayment",
    icon: MdPayment,
  },
  {
    name: "Employee Management",
    href: "/employee-management",
    icon: FaClipboardUser,
  },
  {
    name: "System Logs",
    href: "/system-logs",
    icon: GrSystem,
  },
  // {
  //   name: "Newsletters",
  //   href: "/newsletter/list-newsletter/page=1",
  //   icon: FaRegNewspaper,
  //   allowedRoles: ["SUPER_ADMIN", "DIGITAL_MARKETER"],
  //   subItems: [
  //     {
  //       name: "Newsletter",
  //       href: "/newsletter/list-newsletter/page=1",
  //       icon: RiUserStarLine,
  //       allowedRoles: ["SUPER_ADMIN", "DIGITAL_MARKETER"],
  //     },
  //     {
  //       name: "Subscriptions",
  //       href: "/newsletter/list-subscriptions/page=1",
  //       icon: PiSignpostLight,
  //       allowedRoles: ["SUPER_ADMIN", "DIGITAL_MARKETER"],
  //     },
  //   ],
  // },
];
