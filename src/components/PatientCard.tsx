import { AlertTriangle, ArrowRight, Calendar, User } from 'lucide-react';
import { motion } from 'motion/react';
import { TriageRecord } from '../types';

interface PatientCardProps {
  key?: string;
  record: TriageRecord;
  onReview: (record: TriageRecord) => void;
}

export default function PatientCard({ record, onReview }: PatientCardProps) {
  const { Patient_Name, Patient_ID, AI_Analysis, Status } = record.fields;

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'CRITICAL': return 'status-critical';
      case 'URGENT': return 'status-urgent';
      case 'ROUTINE': return 'status-pending';
      case 'Closed': return 'status-closed';
      default: return 'status-pending';
    }
  };

  const hasRedFlags = AI_Analysis?.toLowerCase().includes('red flag') || 
                     AI_Analysis?.toLowerCase().includes('critical') ||
                     AI_Analysis?.toLowerCase().includes('emergency');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
      className="glass-card p-6 group cursor-pointer transition-all duration-300 relative overflow-hidden"
      onClick={() => onReview(record)}
    >
      {hasRedFlags && (
        <div className="absolute top-0 right-0 p-2 bg-red-500/20 rounded-bl-xl border-l border-b border-red-500/30">
          <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all">
            <User className="w-6 h-6 text-white/40 group-hover:text-white/80" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight group-hover:text-blue-400 transition-colors">{Patient_Name}</h3>
            <p className="text-xs text-white/40 font-mono tracking-widest uppercase">ID: {Patient_ID}</p>
          </div>
        </div>
        <span className={`status-badge ${getStatusClass(Status)}`}>
          {Status}
        </span>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-black/30 border border-white/5 group-hover:border-white/10 transition-all">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
            <ActivityIcon className="w-3 h-3" /> AI Clinical Analysis
          </p>
          <p className="text-sm text-white/70 line-clamp-2 leading-relaxed italic">
            "{AI_Analysis}"
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-white/30">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {new Date(record.createdTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <button 
            className="flex items-center gap-2 text-xs font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0"
            onClick={(e) => {
              e.stopPropagation();
              onReview(record);
            }}
          >
            REVIEW CASE <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
