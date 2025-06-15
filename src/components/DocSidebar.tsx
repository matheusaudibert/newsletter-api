import React from 'react';
import { Calendar, List, Hash, ExternalLink, Zap } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  {
    title: "Introdução",
    icon: () => <img src="https://filipedeschamps.com.br/avatar-big.png" alt="Newsletter" className="h-4 w-4 rounded-full" />,
    href: "#introduction",
  },
  {
    title: "Notícia Mais Recente",
    icon: Zap,
    href: "#latest",
    endpoint: "/latest"
  },
  {
    title: "Notícias de Hoje",
    icon: Calendar,
    href: "#today",
    endpoint: "/today"
  },
  {
    title: "Todas as Notícias",
    icon: List,
    href: "#news",
    endpoint: "/news"
  },
  {
    title: "Notícia por ID",
    icon: Hash,
    href: "#news-by-id",
    endpoint: "/new?id=X"
  },
];

interface DocSidebarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const DocSidebar: React.FC<DocSidebarProps> = ({ darkMode, setDarkMode }) => {
  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <Sidebar className={`border-r ${darkMode ? 'border-gray-700 bg-gray-950' : 'border-gray-200 bg-white'}`}>
      <SidebarHeader className={`p-4 ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="flex items-center gap-3">
          <img 
            src="https://filipedeschamps.com.br/avatar-big.png" 
            alt="Newsletter Logo" 
            className="h-8 w-8 rounded-full"
          />
          <div>
            <h2 className={`font-bold text-lg ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Newsletter API</h2>
            <Badge className="bg-[#0070F3] hover:bg-[#0070F3]/90 text-white text-xs">
              Documentação v1.0
            </Badge>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className={darkMode ? 'bg-gray-950' : 'bg-white'}>
        <SidebarGroup>
          <SidebarGroupLabel className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => scrollToSection(item.href)}
                    className={`cursor-pointer ${darkMode ? 'text-gray-100 hover:bg-gray-800 hover:text-[#0070F3]' : 'text-gray-900 hover:bg-gray-50 hover:text-[#0070F3]'}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <div className="flex flex-col items-start">
                      <span>{item.title}</span>
                      {item.endpoint && (
                        <code className={`text-xs font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {item.endpoint}
                        </code>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Links Úteis</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a 
                    href="https://github.com/matheusaudibert/newsletter-api" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 ${darkMode ? 'text-gray-100 hover:bg-gray-800 hover:text-[#0070F3]' : 'text-gray-900 hover:bg-gray-50 hover:text-[#0070F3]'}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Repositório GitHub</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a 
                    href="https://newsletter.audibert.dev/api/v1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 ${darkMode ? 'text-gray-100 hover:bg-gray-800 hover:text-[#0070F3]' : 'text-gray-900 hover:bg-gray-50 hover:text-[#0070F3]'}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Base URL</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a 
                    href="https://newsletterbot.audibert.dev" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 ${darkMode ? 'text-gray-100 hover:bg-gray-800 hover:text-[#0070F3]' : 'text-gray-900 hover:bg-gray-50 hover:text-[#0070F3]'}`}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/>
                    </svg>
                    <span>Integrar ao Discord</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={`p-4 ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className="mt-1">
            Desenvolvido por{' '}
            <a
              href="https://github.com/matheusaudibert"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-bold underline ${darkMode ? 'hover:text-[#0070F3]' : 'hover:text-[#0070F3]'}`}
            >
              Matheus Audibert
            </a>
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DocSidebar;
