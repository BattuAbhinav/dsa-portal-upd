// App component with responsive navigation
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { navigationItems } from "@/components/AppSidebar";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import Index from "./pages/Index";
import Contests from "./pages/Contests";
import Progress from "./pages/Progress";
import NotFound from "./pages/NotFound";
import { AuthForm } from "@/components/AuthForm";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  if (isMobile) {
    // For mobile devices, use modern header with navigation
    return (
      <div className="min-h-screen w-full bg-gray-50">
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between px-4 h-16">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CodeLearn
              </span>
            </div>
            
            {/* Mobile Navigation */}
            <nav className="flex items-center gap-1">
              {navigationItems.map((item) => {
                const active = location.pathname === item.url;
                return (
                  <NavLink
                    key={item.title}
                    to={item.url}
                    className={`
                      flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200
                      ${active 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }
                    `}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="hidden xs:inline">{item.title}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  // For desktop, use enhanced sidebar layout
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between border-b border-gray-200/50 bg-white/95 backdrop-blur-md px-6 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
              <div className="h-6 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">
                  {location.pathname === '/' ? 'Learning Dashboard' : 
                   location.pathname === '/contests' ? 'Programming Contests' :
                   location.pathname === '/progress' ? 'Your Progress' : 'CodeLearn'}
                </span>
              </div>
            </div>
            
            {/* Header actions */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Online</span>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/contests" element={<Contests />} />
            <Route path="/progress" element={<Progress />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
