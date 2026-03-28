import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, Clock, CheckCircle2, XCircle, RotateCcw,
  User, Phone, Stethoscope, ChevronRight, Plus
} from 'lucide-react';

interface Appointment {
  id: string;
  time: string;
  name: string;
  age: number;
  phone: string;
  reason: string;
  type: 'Follow-up' | 'New Visit' | 'Consultation' | 'Checkup';
  status: 'Upcoming' | 'In Progress' | 'Done' | 'Cancelled';
}

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', time: '09:00 AM', name: 'Priya Sharma', age: 34, phone: '+91 98765 43210', reason: 'Diabetes follow-up & HbA1c review', type: 'Follow-up', status: 'Done' },
  { id: '2', time: '09:30 AM', name: 'Arjun Mehta', age: 52, phone: '+91 90000 11223', reason: 'Hypertension & BP monitoring', type: 'Follow-up', status: 'Done' },
  { id: '3', time: '10:00 AM', name: 'Sunita Rao', age: 28, phone: '+91 87654 32100', reason: 'General wellness checkup', type: 'Checkup', status: 'In Progress' },
  { id: '4', time: '10:30 AM', name: 'Ramesh Iyer', age: 61, phone: '+91 91234 56789', reason: 'Post-surgery wound inspection', type: 'Follow-up', status: 'Upcoming' },
  { id: '5', time: '11:00 AM', name: 'Ankita Desai', age: 19, phone: '+91 88888 77777', reason: 'Fever & throat infection', type: 'New Visit', status: 'Upcoming' },
  { id: '6', time: '11:30 AM', name: 'Vikram Nair', age: 45, phone: '+91 99000 12345', reason: 'Thyroid consultation & reports', type: 'Consultation', status: 'Upcoming' },
  { id: '7', time: '12:00 PM', name: 'Geeta Pillai', age: 38, phone: '+91 77777 44444', reason: 'Prenatal checkup — 28 weeks', type: 'Checkup', status: 'Upcoming' },
  { id: '8', time: '02:00 PM', name: 'Deepak Joshi', age: 55, phone: '+91 80000 22222', reason: 'Chest pain evaluation', type: 'Consultation', status: 'Cancelled' },
  { id: '9', time: '02:30 PM', name: 'Meera Kulkarni', age: 42, phone: '+91 93333 55555', reason: 'Skin allergy follow-up', type: 'Follow-up', status: 'Upcoming' },
  { id: '10', time: '03:00 PM', name: 'Sanjay Gupta', age: 67, phone: '+91 86666 99999', reason: 'Arthritis pain & mobility review', type: 'Follow-up', status: 'Upcoming' },
];

const STATUS_CONFIG = {
  'Upcoming':    { color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   dot: 'bg-blue-400' },
  'In Progress': { color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20',  dot: 'bg-amber-400 animate-pulse' },
  'Done':        { color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  dot: 'bg-green-400' },
  'Cancelled':   { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    dot: 'bg-red-400' },
};

const TYPE_COLOR = {
  'Follow-up':    'text-purple-300 bg-purple-500/10 border-purple-500/20',
  'New Visit':    'text-cyan-300 bg-cyan-500/10 border-cyan-500/20',
  'Consultation': 'text-orange-300 bg-orange-500/10 border-orange-500/20',
  'Checkup':      'text-teal-300 bg-teal-500/10 border-teal-500/20',
};

export default function Schedule() {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const updateStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const filtered = filterStatus === 'All'
    ? appointments
    : appointments.filter(a => a.status === filterStatus);

  const stats = {
    total: appointments.length,
    done: appointments.filter(a => a.status === 'Done').length,
    upcoming: appointments.filter(a => a.status === 'Upcoming').length,
    inProgress: appointments.filter(a => a.status === 'In Progress').length,
  };

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden bg-midnight">
      {/* Header */}
      <header className="h-24 border-b border-white/10 flex items-center justify-between px-6 md:px-10 bg-black/10 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-teal-600/20 rounded-xl flex items-center justify-center border border-teal-500/30">
            <Calendar className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Schedule</h2>
            <p className="hidden sm:block text-[10px] text-white/30 uppercase tracking-widest font-bold">{today}</p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-3 py-2 bg-teal-600/20 border border-teal-500/30 rounded-xl text-teal-300 text-[10px] font-bold uppercase tracking-widest hover:bg-teal-600/30 transition-all">
          <Plus className="w-4 h-4" />
          New
        </button>
      </header>

      {/* Appointment List */}
      <div className="flex-1 overflow-y-auto px-4 md:px-10 py-6 custom-scrollbar">
        <div className="flex flex-col gap-3 max-w-4xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filtered.map((appt, i) => {
              const sc = STATUS_CONFIG[appt.status];
              const isExpanded = expandedId === appt.id;

              return (
                <motion.div
                  key={appt.id}
                  layout
                  className={`rounded-2xl border bg-white/[0.03] backdrop-blur-sm overflow-hidden transition-all ${sc.border}`}
                >
                  <div
                    className="flex items-center gap-4 px-4 py-4 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : appt.id)}
                  >
                    <div className="text-center shrink-0 w-16">
                      <p className="text-xs font-bold text-white/80">{appt.time}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-white truncate">{appt.name}</p>
                      <p className="text-[10px] text-white/40 truncate">{appt.reason}</p>
                    </div>
                    <div className={`shrink-0 px-2 py-1 rounded-full ${sc.bg} border ${sc.border}`}>
                      <span className={`text-[8px] font-bold uppercase tracking-widest ${sc.color}`}>{appt.status}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
