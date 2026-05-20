import React from 'react';
import { CampusEvent } from '../types';
import { Calendar, Clock, MapPin, Users, Sparkles, Shield, Trash2, CheckCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';

interface EventCardProps {
  event: CampusEvent;
  onClick: (event: CampusEvent) => void;
  onApprove?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  Academic: 'bg-blue-100 text-blue-700',
  Social: 'bg-pink-100 text-pink-700',
  Sports: 'bg-orange-100 text-orange-700',
  Workshops: 'bg-purple-100 text-purple-700',
  Career: 'bg-emerald-100 text-emerald-700',
  Arts: 'bg-amber-100 text-amber-700',
  Tech: 'bg-indigo-100 text-indigo-700',
};

const EventCard: React.FC<EventCardProps> = ({ event, onClick, onApprove, onDelete }) => {
  const { isAdmin } = useAuth();
  const date = parseISO(event.date);

  return (
    <div 
      className="group rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col h-full shadow-sm hover:shadow-md bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800"
      onClick={() => onClick(event)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {event.status === 'Pending' && (
            <span className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1 w-fit">
              <Shield className="w-3 h-3" /> PENDING
            </span>
          )}
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold shadow-sm",
            categoryColors[event.category] || 'bg-gray-100 text-gray-700'
          )}>
            {event.category}
          </span>
          {event.isPopular && (
            <span className="bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1 w-fit">
              <Sparkles className="w-3 h-3" /> POPULAR
            </span>
          )}
          {event.isLive && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1 w-fit animate-pulse">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span> LIVE NOW
            </span>
          )}
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {isAdmin && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(event.id);
              }}
              className="p-2 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-md text-gray-700 dark:text-gray-200 hover:bg-red-600 hover:text-white transition-colors shadow-sm"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {isAdmin && event.status === 'Pending' && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onApprove?.(event.id);
            }}
            className="absolute bottom-4 left-4 right-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> Approve Event
          </button>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-indigo-600 uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          {format(date, 'EEEE, MMM do')}
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {event.title}
        </h3>

        <div className="mt-auto space-y-2.5">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            {event.startTime} - {event.endTime}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="pt-4 flex items-center justify-between border-t border-gray-50 dark:border-gray-800 mt-4">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Users className="w-4 h-4 mr-1.5 text-gray-400" />
              {event.attendees} attending
            </div>
            <span className="text-xs font-medium text-indigo-600 group-hover:underline">Details →</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
