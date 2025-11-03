import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Edit } from 'lucide-react';

export default function AppointmentCalendar({ appointments = [], onDateClick, onAppointmentClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.appointmentDate);
      return (
        aptDate.getDate() === date.getDate() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const today = new Date();

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      rescheduled: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const day = i - startingDayOfWeek + 1;
      const isValidDay = day > 0 && day <= daysInMonth;
      const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayAppointments = isValidDay ? getAppointmentsForDate(cellDate) : [];

      days.push(
        <div
          key={i}
          className={`min-h-[100px] border border-gray-200 p-2 ${
            !isValidDay ? 'bg-gray-50' : 'bg-white hover:bg-gray-50 cursor-pointer'
          } ${isToday(day) ? 'ring-2 ring-primary-500' : ''}`}
          onClick={() => isValidDay && onDateClick && onDateClick(cellDate)}
        >
          {isValidDay && (
            <>
              <div className={`text-sm font-semibold mb-1 ${isToday(day) ? 'text-primary-600' : 'text-gray-700'}`}>
                {day}
              </div>
              <div className="space-y-1">
                {dayAppointments.slice(0, 2).map((apt, idx) => (
                  <div
                    key={idx}
                    className={`text-xs px-2 py-1 rounded truncate flex justify-between items-center ${getStatusColor(apt.status)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAppointmentClick && onAppointmentClick(apt);
                    }}
                    title={`${apt.appointmentTime} - ${apt.type}`}
                  >
                    <span>{apt.appointmentTime} {apt.type}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-6 hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAppointmentClick && onAppointmentClick(apt);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {dayAppointments.length > 2 && (
                  <div className="text-xs text-gray-500 px-2">
                    +{dayAppointments.length - 2} more
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {monthName}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-0">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold text-sm py-2 border-b border-gray-200">
              {day}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300"></div>
            <span className="text-xs">Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
            <span className="text-xs">Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
            <span className="text-xs">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
            <span className="text-xs">Cancelled</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
