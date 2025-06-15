
import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DocSidebar from '@/components/DocSidebar';
import APIDocumentation from '@/components/APIDocumentation';

const Index = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
        <DocSidebar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="flex-1">
          <div className={`sticky top-0 z-10 border-b px-4 py-2 ${darkMode ? 'border-gray-700 bg-gray-950' : 'border-gray-200 bg-white'}`}>
            <SidebarTrigger className={darkMode ? 'text-gray-100' : 'text-gray-900'} />
          </div>
          <div id="introduction">
            <APIDocumentation darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
