import { useEffect, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Activity, AlertCircle, Loader2, RefreshCw, Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import PatientCard from './components/PatientCard';
import PatientModal from './components/PatientModal';
import Schedule from './components/Schedule';
import { fetchTriageLogs, updateTriageRecord } from './services/airtableService';
import { TriageRecord } from './types';

export default function App() {
  const [records, setRecords] = useState<TriageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeView, setActiveView] = useState<'triage' | 'schedule'>('triage');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TriageRecord | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadData = async () => {
    try {
      const data = await fetchTriageLogs();
      setRecords(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Failed to sync with Airtable. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Sync every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const filteredRecords = useMemo(() => {
    if (activeFilter === 'All') return records;
    return records.filter(r => r.fields.Status === activeFilter);
  }, [records, activeFilter]);

  const handleUpdateRecord = async (recordId: string, fields: Partial<TriageRecord['fields']>) => {
    try {
      const updated = await updateTriageRecord(recordId, fields);
      setRecords(prev => prev.map(r => r.id === recordId ? updated : r));
    } catch (err) {
      console.error('Update failed:', err);
      throw err;
    }
  };

  return (
    <div className="flex h-screen bg-midnight text-white overflow-hidden">
      <Sidebar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        activeView={activeView}
        setActiveView={setActiveView}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {activeView === 'schedule' ? (
        <Schedule />
      ) : (
        <main className="flex-1 flex flex-col min-w-0 relative">
          {/* Header */}
        <header className="h-20 lg:h-24 border-b border-white/10 flex items-center justify-between px-6 lg:px-10 bg-black/10 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3 lg:gap-4 overflow-hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg lg:text-2xl font-bold tracking-tight truncate">
              {activeView === 'triage' ? `${activeFilter} Triage` : 'Schedule'}
            </h2>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                {activeView === 'triage' ? `${filteredRecords.length} Active` : 'Synced'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold leading-none mb-1">Last Sync</p>
              <p className="text-xs font-medium text-white/60">{lastUpdated.toLocaleTimeString()}</p>
            </div>
            <button 
              onClick={loadData}
              className="p-2.5 lg:p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
            >
              <RefreshCw className={`w-4 h-4 lg:w-5 h-5 text-white/40 group-hover:text-white group-active:rotate-180 transition-all duration-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar">
            {loading && records.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 opacity-50">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                <p className="text-sm font-bold uppercase tracking-widest">Initializing...</p>
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-center px-4">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-red-400 font-medium max-w-xs">{error}</p>
                <button onClick={loadData} className="glass-button text-sm">Retry Connection</button>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 opacity-30">
                <Activity className="w-12 h-12 lg:w-16 h-16" />
                <p className="text-xs lg:text-sm font-bold uppercase tracking-widest">No matching cases</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 lg:gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredRecords.map((record) => (
                    <PatientCard
                      key={record.id}
                      record={record}
                      onReview={setSelectedRecord}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Background Accents */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        </main>
      )}

      {/* Modal */}
      <PatientModal 
        record={selectedRecord} 
        onClose={() => setSelectedRecord(null)} 
        onUpdate={handleUpdateRecord}
      />
    </div>
  );
}
