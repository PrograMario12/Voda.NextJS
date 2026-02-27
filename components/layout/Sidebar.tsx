'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  Settings
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'New Request',
    href: '/new',
    icon: PlusCircle,
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: FolderKanban,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64 p-4 border-r border-slate-800">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold tracking-tight">Voda.NextJS</h1>
        <p className="text-xs text-slate-400">Solo Dev Project Manager</p>
      </div>

      <nav className="flex-1 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-800">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </div>
  );
}
