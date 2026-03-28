import { Activity, AlertCircle, CheckCircle2, Clock, LayoutDashboard, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export default function Sidebar({ activeFilter, setActiveFilter }: SidebarProps) {
  const filters = [
    { id: 'All', icon: LayoutDashboard, label: 'All Cases' },
    { id: 'CRITICAL', icon: AlertCircle, label: 'Critical Cases' },
    { id: 'URGENT', icon: Clock, label: 'Urgent' },
    { id: 'ROUTINE', icon: Activity, label: 'Routine' },
    { id: 'Closed', icon: CheckCircle2, label: 'Resolved' },
  ];

  return (
    <div className="w-72 h-screen border-r border-white/10 p-6 flex flex-col gap-8 bg-black/20 backdrop-blur-3xl">
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
          <Activity className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">MediSetu</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Doctor's Command Center</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
        <input 
          type="text" 
          placeholder="Search patients..." 
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        />
      </div>

      <nav className="flex flex-col gap-2">
        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold px-2 mb-2">Triage Filters</p>
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
              activeFilter === filter.id 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <filter.icon className={`w-5 h-5 ${activeFilter === filter.id ? 'text-blue-400' : 'text-white/30 group-hover:text-white/60'}`} />
            <span className="font-medium text-sm">{filter.label}</span>
            {activeFilter === filter.id && (
              <motion.div 
                layoutId="active-pill" 
                className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10">
        <p className="text-xs font-medium text-white/80 mb-1">System Status</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Live Sync Active</p>
        </div>
      </div>
    </div>
  );
}
