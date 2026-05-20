import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  parseISO 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { CampusEvent } from '../types';
import { cn } from '../utils/cn';

interface CalendarViewProps {
  events: CampusEvent[];
  onEventClick: (event: CampusEvent) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, onEventClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{format(currentMonth, 'MMMM yyyy')}</h2>
          <p className="text-sm text-gray-500">Click on an event to see more details</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-white rounded-xl border border-gray-200 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-4 py-2 text-sm font-semibold hover:bg-white rounded-xl border border-gray-200 transition-colors shadow-sm"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-white rounded-xl border border-gray-200 transition-colors shadow-sm"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
          {dateNames[i]}
        </div>
      );
    }

    return <div className="grid grid-cols-7 border-b border-gray-100">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        
        const dayEvents = events.filter(event => 
          isSameDay(parseISO(event.date), cloneDay)
        );

        days.push(
          <div
            key={day.toString()}
            onClick={() => {
              if (dayEvents.length > 0) {
                // If multiple events, we could show a special list, 
                // but usually users expect to see the first one or a list.
                // For now, let's just make the whole cell clickable to trigger 
                // the first event if they click the cell but not a specific badge.
                // Or better: show the detail of the first event if they click empty area.
                onEventClick(dayEvents[0]);
              }
            }}
            className={cn(
              "min-h-[120px] p-2 border-r border-b border-gray-100 transition-colors bg-white hover:bg-gray-50/50 cursor-pointer",
              !isSameMonth(day, monthStart) && "bg-gray-50/30 text-gray-300"
            )}
          >
            <div className="flex justify-between items-center mb-1">
              <span className={cn(
                "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full",
                isSameDay(day, new Date()) ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-gray-700",
                !isSameMonth(day, monthStart) && "text-gray-300"
              )}>
                {formattedDate}
              </span>
            </div>
            <div className="space-y-1">
              {dayEvents.slice(0, 5).map(event => (
                <div
                  key={event.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                  className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold truncate cursor-pointer transition-transform hover:scale-[1.02]",
                    event.category === 'Tech' && "bg-indigo-100 text-indigo-700",
                    event.category === 'Academic' && "bg-blue-100 text-blue-700",
                    event.category === 'Sports' && "bg-orange-100 text-orange-700",
                    event.category === 'Arts' && "bg-amber-100 text-amber-700",
                    event.category === 'Social' && "bg-pink-100 text-pink-700",
                    event.category === 'Workshops' && "bg-purple-100 text-purple-700",
                    event.category === 'Career' && "bg-emerald-100 text-emerald-700",
                  )}
                  title={event.title}
                >
                  <div className="flex items-center gap-1">
                    <Clock className="w-2 h-2" /> {event.startTime.split(' ')[0]}
                  </div>
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 5 && (
                <div className="text-[9px] font-bold text-gray-400 pl-1">
                  + {dayEvents.length - 5} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="bg-white rounded-b-3xl overflow-hidden border-l border-t border-gray-100">{rows}</div>;
  };

  return (
    <div className="animate-in fade-in duration-500">
      {renderHeader()}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  );
};

export default CalendarView;
