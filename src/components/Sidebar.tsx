import { Activity, AlertCircle, Calendar, CheckCircle2, Clock, LayoutDashboard, Search, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  activeView: 'triage' | 'schedule';
  setActiveView: (view: 'triage' | 'schedule') => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeFilter, setActiveFilter, activeView, setActiveView, isOpen, onClose }: SidebarProps) {
  const filters = [
    { id: 'All', icon: LayoutDashboard, label: 'All Cases' },
    { id: 'CRITICAL', icon: AlertCircle, label: 'Critical Cases' },
    { id: 'URGENT', icon: Clock, label: 'Urgent' },
    { id: 'ROUTINE', icon: Activity, label: 'Routine' },
    { id: 'Closed', icon: CheckCircle2, label: 'Resolved' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={`fixed lg:relative top-0 left-0 w-72 h-screen border-r border-white/10 p-6 flex flex-col gap-8 bg-black/40 backdrop-blur-3xl z-50 transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Activity className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">MediSetu</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Doctor's Command Center</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-white/40 hover:text-white">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
        <input 
          type="text" 
          placeholder="Search patients..." 
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        />
      </div>

      {/* View Switcher */}
      <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
        <button
          onClick={() => setActiveView('triage')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            activeView === 'triage' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : 'text-white/30 hover:text-white/60'
          }`}
        >
          Triage
        </button>
        <button
          onClick={() => setActiveView('schedule')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            activeView === 'schedule' ? 'bg-teal-600/20 text-teal-400 border border-teal-500/20' : 'text-white/30 hover:text-white/60'
          }`}
        >
          Schedule
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold px-2 mb-2">Triage Filters</p>
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => { setActiveView('triage'); setActiveFilter(filter.id); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
              activeView === 'triage' && activeFilter === filter.id 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <filter.icon className={`w-5 h-5 ${activeView === 'triage' && activeFilter === filter.id ? 'text-blue-400' : 'text-white/30 group-hover:text-white/60'}`} />
            <span className="font-medium text-sm">{filter.label}</span>
            {activeView === 'triage' && activeFilter === filter.id && (
              <motion.div 
                layoutId="active-pill" 
                className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"
              />
            )}
          </button>
        ))}

        {/* Schedule shortcut */}
        <button
          onClick={() => setActiveView('schedule')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group mt-1 ${
            activeView === 'schedule'
              ? 'bg-teal-600/10 text-teal-400 border border-teal-500/20'
              : 'text-white/50 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Calendar className={`w-5 h-5 ${activeView === 'schedule' ? 'text-teal-400' : 'text-white/30 group-hover:text-white/60'}`} />
          <span className="font-medium text-sm">Patient Schedule</span>
          {activeView === 'schedule' && (
            <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />
          )}
        </button>
      </nav>

      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10">
        <p className="text-xs font-medium text-white/80 mb-1">System Status</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Live Sync Active</p>
        </div>
      </div>
      </div>
    </>
  );
}
