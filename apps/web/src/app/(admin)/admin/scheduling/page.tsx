"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type EventType = "consultation" | "site_visit" | "inspection" | "work_day";

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: EventType;
  time?: string;
}

const EVENT_COLORS: Record<EventType, { bg: string; text: string; dot: string }> = {
  consultation: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  site_visit: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  inspection: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  work_day: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
};

const EVENT_LABELS: Record<EventType, string> = {
  consultation: "Consultation",
  site_visit: "Site Visit",
  inspection: "Inspection",
  work_day: "Work Day",
};

// Generate mock events for the current week
function generateMockEvents(): CalendarEvent[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const fmt = (d: Date) => d.toISOString().split("T")[0];
  const addDays = (d: Date, n: number) => {
    const r = new Date(d);
    r.setDate(d.getDate() + n);
    return r;
  };

  return [
    {
      id: "1",
      title: "Mitchell Kitchen Consult",
      date: fmt(monday),
      type: "consultation",
      time: "9:00 AM",
    },
    {
      id: "2",
      title: "Kim Deck Build",
      date: fmt(monday),
      type: "work_day",
      time: "7:00 AM",
    },
    {
      id: "3",
      title: "Torres Bathroom Site Visit",
      date: fmt(addDays(monday, 1)),
      type: "site_visit",
      time: "10:00 AM",
    },
    {
      id: "4",
      title: "Reynolds Addition Inspection",
      date: fmt(addDays(monday, 2)),
      type: "inspection",
      time: "1:00 PM",
    },
    {
      id: "5",
      title: "Kim Deck Build",
      date: fmt(addDays(monday, 2)),
      type: "work_day",
      time: "7:00 AM",
    },
    {
      id: "6",
      title: "Kim Deck Build",
      date: fmt(addDays(monday, 3)),
      type: "work_day",
      time: "7:00 AM",
    },
    {
      id: "7",
      title: "Chen Fence Consultation",
      date: fmt(addDays(monday, 4)),
      type: "consultation",
      time: "2:00 PM",
    },
    {
      id: "8",
      title: "Kim Deck Build",
      date: fmt(addDays(monday, 4)),
      type: "work_day",
      time: "7:00 AM",
    },
  ];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getMonthData(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const prevMonthLast = new Date(year, month, 0).getDate();

  const cells: { day: number; month: number; year: number; isCurrentMonth: boolean }[] = [];

  // Previous month fill
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = prevMonthLast - i;
    cells.push({ day: d, month: month - 1, year, isCurrentMonth: false });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month, year, isCurrentMonth: true });
  }

  // Next month fill
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, month: month + 1, year, isCurrentMonth: false });
    }
  }

  return cells;
}

function getWeekData(baseDate: Date) {
  const dayOfWeek = baseDate.getDay();
  const sunday = new Date(baseDate);
  sunday.setDate(baseDate.getDate() - dayOfWeek);

  const cells: { day: number; month: number; year: number; isCurrentMonth: boolean }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    cells.push({
      day: d.getDate(),
      month: d.getMonth(),
      year: d.getFullYear(),
      isCurrentMonth: true,
    });
  }
  return cells;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function SchedulingPage() {
  const [view, setView] = useState<"month" | "week">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const events = useMemo(() => generateMockEvents(), []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const cells =
    view === "month"
      ? getMonthData(year, month)
      : getWeekData(currentDate);

  const todayStr = new Date().toISOString().split("T")[0];

  const navigate = (dir: -1 | 1) => {
    const next = new Date(currentDate);
    if (view === "month") {
      next.setMonth(next.getMonth() + dir);
    } else {
      next.setDate(next.getDate() + dir * 7);
    }
    setCurrentDate(next);
  };

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const ev of events) {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    }
    return map;
  }, [events]);

  const cellDateStr = (cell: { day: number; month: number; year: number }) => {
    const m = String(cell.month + 1).padStart(2, "0");
    const d = String(cell.day).padStart(2, "0");
    return `${cell.year}-${m}-${d}`;
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Scheduling</h1>
          <p className="text-sm text-[#888]">
            Manage your calendar and appointments
          </p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Event
        </Button>
      </div>

      {/* Controls */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#e0dbd5] hover:bg-[#f8f8f8]"
          >
            <ChevronLeft className="h-4 w-4 text-black" strokeWidth={1.5} />
          </button>
          <h2 className="min-w-[180px] text-center text-sm font-semibold text-black">
            {MONTH_NAMES[month]} {year}
          </h2>
          <button
            onClick={() => navigate(1)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#e0dbd5] hover:bg-[#f8f8f8]"
          >
            <ChevronRight className="h-4 w-4 text-black" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="ml-2 rounded-md border border-[#e0dbd5] px-3 py-1 text-xs font-medium text-[#555] hover:bg-[#f8f8f8]"
          >
            Today
          </button>
        </div>

        <div className="flex rounded-md border border-[#e0dbd5]">
          <button
            onClick={() => setView("week")}
            className={`px-3 py-1.5 text-xs font-medium ${
              view === "week"
                ? "bg-black text-white"
                : "text-[#555] hover:bg-[#f8f8f8]"
            } rounded-l-md`}
          >
            Week
          </button>
          <button
            onClick={() => setView("month")}
            className={`px-3 py-1.5 text-xs font-medium ${
              view === "month"
                ? "bg-black text-white"
                : "text-[#555] hover:bg-[#f8f8f8]"
            } rounded-r-md`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-4">
        {(Object.keys(EVENT_COLORS) as EventType[]).map((type) => (
          <div key={type} className="flex items-center gap-1.5">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${EVENT_COLORS[type].dot}`}
            />
            <span className="text-xs text-[#555]">{EVENT_LABELS[type]}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <Card className="border border-[#e0dbd5] shadow-none">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-[#e0dbd5]">
          {DAYS.map((day) => (
            <div
              key={day}
              className="px-2 py-2 text-center text-xs font-bold uppercase tracking-widest text-[#888]"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Date Cells */}
        <div className="grid grid-cols-7">
          {cells.map((cell, idx) => {
            const dateStr = cellDateStr(cell);
            const dayEvents = eventsByDate[dateStr] || [];
            const isToday = dateStr === todayStr;

            return (
              <div
                key={idx}
                className={`min-h-[100px] border-b border-r border-[#e0dbd5] p-1.5 ${
                  !cell.isCurrentMonth ? "bg-[#fafaf8]" : ""
                } ${idx % 7 === 6 ? "border-r-0" : ""}`}
              >
                <div className="mb-1 flex justify-end">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      isToday
                        ? "bg-black font-semibold text-white"
                        : cell.isCurrentMonth
                          ? "font-medium text-black"
                          : "text-[#ccc]"
                    }`}
                  >
                    {cell.day}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 3).map((ev) => (
                    <div
                      key={ev.id}
                      className={`rounded px-1 py-0.5 ${EVENT_COLORS[ev.type].bg}`}
                    >
                      <p
                        className={`truncate text-[10px] font-medium ${EVENT_COLORS[ev.type].text}`}
                      >
                        {ev.time && (
                          <span className="mr-0.5 opacity-75">{ev.time}</span>
                        )}
                        {ev.title}
                      </p>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <p className="px-1 text-[10px] text-[#888]">
                      +{dayEvents.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
