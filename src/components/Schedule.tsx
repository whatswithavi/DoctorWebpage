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
    <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Header */}
      <header className="h-24 border-b border-white/10 flex items-center justify-between px-10 bg-black/10 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-teal-600/20 rounded-xl flex items-center justify-center border border-teal-500/30">
            <Calendar className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Today's Schedule</h2>
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{today}</p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 bg-teal-600/20 border border-teal-500/30 rounded-xl text-teal-300 text-sm font-medium hover:bg-teal-600/30 transition-all">
          <Plus className="w-4 h-4" />
          Add Appointment
        </button>
      </header>

      {/* Stats Row */}
      <div className="px-10 py-5 grid grid-cols-4 gap-4 border-b border-white/5">
        {[
          { label: 'Total Today', value: stats.total, color: 'text-white' },
          { label: 'Completed', value: stats.done, color: 'text-green-400' },
          { label: 'In Progress', value: stats.inProgress, color: 'text-amber-400' },
          { label: 'Upcoming', value: stats.upcoming, color: 'text-blue-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Pills */}
      <div className="px-10 py-4 flex gap-2 border-b border-white/5">
        {['All', 'Upcoming', 'In Progress', 'Done', 'Cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
              filterStatus === s
                ? 'bg-white/10 border-white/20 text-white'
                : 'border-transparent text-white/30 hover:text-white/60'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Appointment List */}
      <div className="flex-1 overflow-y-auto px-10 py-6 custom-scrollbar">
        <div className="flex flex-col gap-3 max-w-4xl">
          <AnimatePresence mode="popLayout">
            {filtered.map((appt, i) => {
              const sc = STATUS_CONFIG[appt.status];
              const isExpanded = expandedId === appt.id;

              return (
                <motion.div
                  key={appt.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className={`rounded-2xl border bg-white/[0.03] backdrop-blur-sm overflow-hidden transition-all ${sc.border} ${appt.status === 'Cancelled' ? 'opacity-50' : ''}`}
                >
                  {/* Main Row */}
                  <div
                    className="flex items-center gap-5 px-6 py-4 cursor-pointer hover:bg-white/5 transition-all"
                    onClick={() => setExpandedId(isExpanded ? null : appt.id)}
                  >
                    {/* Time */}
                    <div className="w-20 shrink-0 text-center">
                      <p className="text-sm font-bold text-white/80">{appt.time.split(' ')[0]}</p>
                      <p className="text-[10px] text-white/30">{appt.time.split(' ')[1]}</p>
                    </div>

                    {/* Divider line */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div className={`w-2.5 h-2.5 rounded-full ${sc.dot}`} />
                      <div className="w-px h-6 bg-white/10" />
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-white truncate">{appt.name}</p>
                        <span className="text-[10px] text-white/30">·</span>
                        <span className="text-xs text-white/40">{appt.age}y</span>
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${TYPE_COLOR[appt.type]}`}>
                          {appt.type}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 truncate">{appt.reason}</p>
                    </div>

                    {/* Status Badge */}
                    <div className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full ${sc.bg} border ${sc.border}`}>
                      <span className={`text-xs font-bold ${sc.color}`}>{appt.status}</span>
                    </div>

                    <ChevronRight className={`w-4 h-4 text-white/20 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-white/5"
                      >
                        <div className="px-6 py-5 flex items-center justify-between gap-8">
                          {/* Details */}
                          <div className="flex gap-8">
                            <div className="flex items-center gap-2 text-white/50">
                              <User className="w-4 h-4" />
                              <span className="text-sm">{appt.name}, {appt.age} yrs</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/50">
                              <Phone className="w-4 h-4" />
                              <span className="text-sm">{appt.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/50">
                              <Stethoscope className="w-4 h-4" />
                              <span className="text-sm">{appt.reason}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          {appt.status !== 'Cancelled' && (
                            <div className="flex gap-2 shrink-0">
                              {appt.status !== 'In Progress' && appt.status !== 'Done' && (
                                <button
                                  onClick={() => updateStatus(appt.id, 'In Progress')}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-all"
                                >
                                  <Clock className="w-3.5 h-3.5" /> Start
                                </button>
                              )}
                              {appt.status !== 'Done' && (
                                <button
                                  onClick={() => updateStatus(appt.id, 'Done')}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-300 text-xs font-semibold hover:bg-green-500/20 transition-all"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Done
                                </button>
                              )}
                              <button
                                onClick={() => updateStatus(appt.id, 'Cancelled')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold hover:bg-red-500/20 transition-all"
                              >
                                <XCircle className="w-3.5 h-3.5" /> Cancel
                              </button>
                            </div>
                          )}
                          {appt.status === 'Cancelled' && (
                            <button
                              onClick={() => updateStatus(appt.id, 'Upcoming')}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-xs font-semibold hover:bg-white/10 transition-all"
                            >
                              <RotateCcw className="w-3.5 h-3.5" /> Restore
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center gap-3 opacity-30">
              <Calendar className="w-12 h-12" />
              <p className="text-sm font-bold uppercase tracking-widest">No appointments for this filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
