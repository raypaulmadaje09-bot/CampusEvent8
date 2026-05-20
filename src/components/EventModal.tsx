import React from 'react';
import { CampusEvent } from '../types';
import { X, Calendar, Clock, MapPin, Users, Share2, ExternalLink, Bookmark } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface EventModalProps {
  event: CampusEvent;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  const date = parseISO(event.date);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200 border border-transparent dark:border-gray-800">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative h-64 sm:h-80">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white mb-3 inline-block uppercase tracking-widest">
              {event.category}
            </span>
            <h2 className="text-3xl font-bold text-white leading-tight">
              {event.title}
            </h2>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{format(date, 'EEEE, MMMM do, yyyy')}</p>
                  <p className="text-xs text-gray-500">Date</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{event.startTime} - {event.endTime}</p>
                  <p className="text-xs text-gray-500">Time</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{event.location}</p>
                  <p className="text-xs text-gray-500">Location</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{event.attendees} Attending</p>
                  <p className="text-xs text-gray-500">Capacity</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">About the event</h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {event.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button className="flex-1 bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
              <Bookmark className="w-4 h-4" />
              RSVP Protocol
            </button>
            <div className="flex gap-2">
              <button className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                {event.organizer.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Organized by</p>
                <p className="text-xs font-semibold text-gray-800">{event.organizer}</p>
              </div>
            </div>
            <button className="text-indigo-600 hover:text-indigo-700 text-xs font-medium flex items-center gap-1">
              Contact Organizer <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
