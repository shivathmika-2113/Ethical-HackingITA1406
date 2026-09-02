import { useState, useEffect } from 'react';
import type { PageId } from '@/types';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { SearchModal } from '@/components/SearchModal';
import { ToastProvider } from '@/components/ui/Toast';
import { DemoBanner } from '@/components/ui/Layout';
import { OverviewPage } from '@/pages/OverviewPage';
import { NetworkMapPage } from '@/pages/NetworkMapPage';
import { NetworkDiscoveryPage } from '@/pages/NetworkDiscoveryPage';
import { PortScannerPage } from '@/pages/PortScannerPage';
import { AssetsPage } from '@/pages/AssetsPage';
import { VulnerabilitiesPage } from '@/pages/VulnerabilitiesPage';
import { AIAnalystPage } from '@/pages/AIAnalystPage';
import { ThreatDetectionPage } from '@/pages/ThreatDetectionPage';
import { IncidentsPage } from '@/pages/IncidentsPage';
import { RemediationPage } from '@/pages/RemediationPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { SettingsPage } from '@/pages/SettingsPage';

function App() {
  const [page, setPage] = useState<PageId>('overview');
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'overview': return <OverviewPage onNavigate={setPage} />;
      case 'network-map': return <NetworkMapPage />;
      case 'network-discovery': return <NetworkDiscoveryPage />;
      case 'port-scanner': return <PortScannerPage />;
      case 'assets': return <AssetsPage />;
      case 'vulnerabilities': return <VulnerabilitiesPage />;
      case 'ai-analyst': return <AIAnalystPage />;
      case 'threat-detection': return <ThreatDetectionPage />;
      case 'incidents': return <IncidentsPage />;
      case 'remediation': return <RemediationPage />;
      case 'reports': return <ReportsPage />;
      case 'settings': return <SettingsPage />;
      default: return <OverviewPage onNavigate={setPage} />;
    }
  };

  return (
    <ToastProvider>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <Sidebar current={page} onNavigate={setPage} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DemoBanner />
          <TopBar onSearch={() => setSearchOpen(true)} />
          <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            <div className="max-w-7xl mx-auto animate-fade-in" key={page}>
              {renderPage()}
            </div>
          </main>
        </div>
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={setPage} />
    </ToastProvider>
  );
}

export default App;
