import {
  CalendarDays,
  FileText,
  Home,
  LayoutDashboard,
  CalendarPlus,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const adminNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const portalNav: NavItem[] = [
  { href: "/portal", label: "Home", icon: Home },
  { href: "/portal/book", label: "Book", icon: CalendarPlus },
  { href: "/portal/upcoming", label: "Upcoming", icon: CalendarDays },
  { href: "/portal/invoices", label: "Invoices", icon: FileText },
];
