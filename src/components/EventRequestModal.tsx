import React, { useState } from 'react';
import { X, Plus, Image as ImageIcon, MapPin, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

interface EventRequestModalProps {
  onClose: () => void;
  onSubmit: (event: any) => void;
  categories: string[];
  theme: 'light' | 'dark';
}

const EventRequestModal: React.FC<EventRequestModalProps> = ({ onClose, onSubmit, categories, theme }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: categories[0] || 'Social',
    location: '',
    date: '',
    startTime: '',
    endTime: '',
    image: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      organizer: user?.name || 'Student',
      attendees: 0,
      status: 'Pending'
    });
    onClose();
  };

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className={cn(
        "relative rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 border",
        isDark ? "bg-[#121421] border-gray-800" : "bg-white border-gray-100"
      )}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-600 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Plus className="w-5 h-5" /> Campus Protocol Request
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className={cn("block text-xs font-black uppercase tracking-widest mb-1 ml-1", isDark ? "text-gray-500" : "text-gray-400")}>Event Title</label>
                <input 
                  required
                  type="text" 
                  className={cn(
                    "w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm",
                    isDark ? "bg-gray-900 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                  )}
                  placeholder="e.g. Science Fair 2024"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={cn("block text-xs font-black uppercase tracking-widest mb-1 ml-1", isDark ? "text-gray-500" : "text-gray-400")}>Date</label>
                  <input 
                    required
                    type="date" 
                    className={cn(
                      "w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm",
                      isDark ? "bg-gray-900 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                    )}
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className={cn("block text-xs font-black uppercase tracking-widest mb-1 ml-1", isDark ? "text-gray-500" : "text-gray-400")}>Category</label>
                  <select 
                    className={cn(
                      "w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm",
                      isDark ? "bg-gray-900 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                    )}
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={cn("block text-xs font-black uppercase tracking-widest mb-1 ml-1", isDark ? "text-gray-500" : "text-gray-400")}>Start</label>
                  <input 
                    required
                    type="time" 
                    className={cn(
                      "w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm",
                      isDark ? "bg-gray-900 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                    )}
                    value={formData.startTime}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                  />
                </div>
                <div>
                  <label className={cn("block text-xs font-black uppercase tracking-widest mb-1 ml-1", isDark ? "text-gray-500" : "text-gray-400")}>End</label>
                  <input 
                    required
                    type="time" 
                    className={cn(
                      "w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm",
                      isDark ? "bg-gray-900 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                    )}
                    value={formData.endTime}
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={cn("block text-xs font-black uppercase tracking-widest mb-1 ml-1", isDark ? "text-gray-500" : "text-gray-400")}>Local Visual Data</label>
                <div className={cn(
                  "h-44 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group transition-all",
                  isDark ? "bg-gray-900 border-gray-800 hover:border-indigo-500" : "bg-gray-50 border-gray-200 hover:border-indigo-400"
                )}>
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-[10px] font-black uppercase text-gray-500">Upload Event JPG</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({...formData, image: reader.result as string});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <label className={cn("block text-xs font-black uppercase tracking-widest mb-1 ml-1", isDark ? "text-gray-500" : "text-gray-400")}>Location Node</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    required
                    type="text" 
                    className={cn(
                      "w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm",
                      isDark ? "bg-gray-900 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                    )}
                    placeholder="Building & Room"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className={cn("block text-xs font-black uppercase tracking-widest mb-1 ml-1", isDark ? "text-gray-500" : "text-gray-400")}>Full Protocol Description</label>
            <textarea 
              required
              rows={3}
              className={cn(
                "w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none",
                isDark ? "bg-gray-900 border-gray-800 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
              )}
              placeholder="Provide all relevant details for approval..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Initialize Request Protocol
          </button>
          
          <p className="text-[10px] text-gray-500 text-center font-bold uppercase tracking-tighter">
            Note: All submissions undergo administrative clearance before becoming public.
          </p>
        </form>
      </div>
    </div>
  );
};

export default EventRequestModal;
