import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle2, ClipboardList, Send, X, Activity, Loader2 } from 'lucide-react';
import { TriageRecord, TriageStatus } from '../types';
import { useState } from 'react';

interface PatientModalProps {
  record: TriageRecord | null;
  onClose: () => void;
  onUpdate: (recordId: string, fields: Partial<TriageRecord['fields']>) => Promise<void>;
}

export default function PatientModal({ record, onClose, onUpdate }: PatientModalProps) {
  const [notes, setNotes] = useState(record?.fields.Notes || '');
  const [status, setStatus] = useState<TriageStatus>(record?.fields.Status || 'ROUTINE');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  if (!record) return null;

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(record.id, {
        Notes: notes,
        Status: status,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update record:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const runGeminiDiagnostics = async () => {
    setIsAnalysing(true);
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{
            role: 'system',
            content: 'You are a Senior Medical Consultant. Analyze the provided symptoms and give a professional second opinion on management and potential risks. Keep it brief (3 sentences).'
          }, {
            role: 'user',
            content: `Symptoms: ${record.fields.Symptoms_Summary}`
          }]
        })
      });
      const data = await res.json();
      setAiReport(data.choices[0].message.content);
    } catch (err) {
      setAiReport("Consultation unavailable. Check API connection.");
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleSendToPharmacy = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(record.id, {
        is_rpa_processed: true,
        Status: 'Closed',
      });
      onClose();
    } catch (error) {
      console.error('Failed to send to pharmacy:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const statusOptions: TriageStatus[] = ['CRITICAL', 'URGENT', 'ROUTINE', 'Under Review', 'Escalated', 'Closed'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-card w-full max-w-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                <ClipboardList className="text-blue-400 w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{record.fields.Patient_Name}</h2>
                <p className="text-xs text-white/40 font-mono tracking-widest uppercase">CASE ID: {record.fields.Patient_ID}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white/40" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto space-y-8">
            {/* AI Analysis Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Initial AI Analysis</h3>
                </div>
                <button 
                  onClick={runGeminiDiagnostics}
                  disabled={isAnalysing}
                  className="px-4 py-2 rounded-lg bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isAnalysing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Activity className="w-3 h-3" />}
                  Consult Gemini AI
                </button>
              </div>
              <div className="p-6 rounded-2xl bg-blue-600/5 border border-blue-500/20 relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-full" />
                <p className="text-sm text-white/90 leading-relaxed italic">
                  "{record.fields.AI_Analysis}"
                </p>
                {aiReport && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Gemini Consultant Opinion:</p>
                    <p className="text-sm text-gray-300 leading-relaxed font-medium">
                      {aiReport}
                    </p>
                  </motion.div>
                )}
              </div>
              
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                 <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Symptoms Input</p>
                 <p className="text-sm text-white/70 font-medium">{record.fields.Symptoms_Summary}</p>
              </div>
            </section>

            {/* Status Selection */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-4">Update Triage Status</h3>
              <div className="grid grid-cols-3 gap-3">
                {statusOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setStatus(opt)}
                    className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                      status === opt 
                        ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20' 
                        : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </section>

            {/* Clinical Notes */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-4">Clinical Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter detailed clinical observations, diagnosis, or instructions..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
              />
            </section>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-white/5 flex gap-4">
            <button
              onClick={handleSendToPharmacy}
              disabled={isUpdating}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> Send to Pharmacy
            </button>
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
            >
              <CheckCircle2 className="w-4 h-4" /> {isUpdating ? 'Saving...' : 'Save & Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
