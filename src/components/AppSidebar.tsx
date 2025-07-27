import { useState } from "react";
import { Home, Trophy, TrendingUp, Calendar, ChevronRight, BookOpen } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

export const navigationItems = [
  { 
    title: "Home", 
    url: "/", 
    icon: Home,
    gradient: "from-blue-500 to-cyan-500",
    description: "Browse topics"
  },
  { 
    title: "Contests", 
    url: "/contests", 
    icon: Trophy,
    gradient: "from-orange-500 to-red-500", 
    description: "Upcoming contests"
  },
  { 
    title: "Progress", 
    url: "/progress", 
    icon: TrendingUp,
    gradient: "from-green-500 to-emerald-500",
    description: "Track your growth"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-72"} transition-all duration-300 border-r border-gray-200/50 bg-gradient-to-b from-white to-gray-50/30 backdrop-blur-sm`}
      collapsible="icon"
    >
      <SidebarContent className="relative">
        {/* Brand Section */}
        <SidebarGroup className="px-3 py-6">
          <div className={`flex items-center gap-3 px-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CodeLearn
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Master Programming
                </span>
              </div>
            )}
          </div>
        </SidebarGroup>

        {/* Navigation Section */}
        <SidebarGroup className="px-3">
          <SidebarGroupLabel className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ${collapsed ? 'px-2' : 'px-3'}`}>
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end 
                        className={`
                          group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 hover:scale-105
                          ${active 
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-black/20 border border-white/20` 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-md'
                          }
                        `}
                      >
                        {/* Icon with glow effect */}
                        <div className="relative">
                          <item.icon className={`w-5 h-5 transition-all duration-300 ${
                            active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                          }`} />
                          {active && (
                            <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-30 blur-sm rounded-full`} />
                          )}
                        </div>
                        
                        {!collapsed && (
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className={`font-semibold text-sm transition-colors duration-300 ${
                              active ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
                            }`}>
                              {item.title}
                            </span>
                            <span className={`text-xs transition-colors duration-300 ${
                              active ? 'text-white/80' : 'text-gray-500 group-hover:text-gray-600'
                            }`}>
                              {item.description}
                            </span>
                          </div>
                        )}
                        
                        {!collapsed && (
                          <ChevronRight className={`w-4 h-4 transition-all duration-300 ${
                            active 
                              ? 'text-white/80 transform rotate-90' 
                              : 'text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1'
                          }`} />
                        )}
                        
                        {/* Active indicator dot for collapsed state */}
                        {collapsed && active && (
                          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom decoration */}
        {!collapsed && (
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-gray-200/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-gray-600">All systems operational</span>
              </div>
              <div className="text-xs text-gray-500">
                Keep learning, keep growing! 🚀
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}