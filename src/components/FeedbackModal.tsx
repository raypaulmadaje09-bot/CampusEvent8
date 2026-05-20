import React, { useState } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { User } from '../types';

interface FeedbackModalProps {
  onClose: () => void;
  onSubmit: (data: { subject: string; message: string; recipientId: string }) => void;
  admins: User[];
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose, onSubmit, admins }) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    recipientId: 'All'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-600 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> Transmission Protocol
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1 ml-1">Target Department / Node</label>
            <select 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
              value={formData.recipientId}
              onChange={e => setFormData({...formData, recipientId: e.target.value})}
            >
              <option value="All">Global Admin Broadcast</option>
              {admins.map(admin => (
                <option key={admin.id} value={admin.id}>{admin.name} ({admin.role})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1 ml-1">Subject Protocol</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
              placeholder="e.g. Schedule Discrepancy"
              value={formData.subject}
              onChange={e => setFormData({...formData, subject: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1 ml-1">Encrypted Message</label>
            <textarea 
              required
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all resize-none"
              placeholder="Enter details for administrative review..."
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Initialize Transmission
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
