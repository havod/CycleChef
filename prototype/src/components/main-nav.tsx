'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  CookingPot,
  HeartPulse,
  LayoutDashboard,
  Newspaper,
  ShoppingBasket,
  User,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const links = [
  {
    href: '/',
    label: 'Dashboard',
    icon: <LayoutDashboard />,
  },
  {
    href: '/profile',
    label: 'My Profile',
    icon: <User />,
  },
  {
    href: '/meal-planner',
    label: 'AI Meal Planner',
    icon: <Bot />,
  },
  {
    href: '/recipes',
    label: 'Recipes',
    icon: <CookingPot />,
  },
  {
    href: '/grocery-list',
    label: 'Grocery List',
    icon: <ShoppingBasket />,
  },
  {
    href: '/cycle-health',
    label: 'Cycle Health',
    icon: <HeartPulse />,
  },
  {
    href: '/blog',
    label: 'Blog',
    icon: <Newspaper />,
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === link.href}
            tooltip={link.label}
          >
            <Link href={link.href}>
              {link.icon}
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
