"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useScheduleEvents,
  useCreateScheduleEvent,
  useDeleteScheduleEvent,
} from "@/lib/hooks/use-schedule";

type EventType = "consultation" | "site_visit" | "inspection" | "work_day";

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

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getMonthData(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const prevMonthLast = new Date(year, month, 0).getDate();

  const cells: { day: number; month: number; year: number; isCurrentMonth: boolean }[] = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    const d = prevMonthLast - i;
    cells.push({ day: d, month: month - 1, year, isCurrentMonth: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month, year, isCurrentMonth: true });
  }

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

export default function SchedulingPage() {
  const [view, setView] = useState<"month" | "week">("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: eventsData, isLoading } = useScheduleEvents();
  const createEvent = useCreateScheduleEvent();
  const deleteEvent = useDeleteScheduleEvent();

  const events = (eventsData ?? []) as Record<string, unknown>[];

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
    const map: Record<string, { id: string; title: string; type: EventType; time: string }[]> = {};
    for (const ev of events) {
      const startTime = String(ev.start_time ?? "");
      const dateStr = startTime.split("T")[0];
      if (!dateStr) continue;

      const title = String(ev.title ?? "");
      const type = (String(ev.event_type ?? "work_day")) as EventType;
      const timeStr = startTime.includes("T")
        ? new Date(startTime).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })
        : "";

      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push({ id: String(ev.id), title, type, time: timeStr });
    }
    return map;
  }, [events]);

  const cellDateStr = (cell: { day: number; month: number; year: number }) => {
    const m = String(cell.month + 1).padStart(2, "0");
    const d = String(cell.day).padStart(2, "0");
    return `${cell.year}-${m}-${d}`;
  };

  const handleAddEvent = () => {
    const startTime = new Date().toISOString();
    createEvent.mutate({
      title: "New Event",
      event_type: "work_day",
      start_time: startTime,
      end_time: startTime,
    });
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="mt-1 h-4 w-56" />
          </div>
          <Skeleton className="h-8 w-28" />
        </div>
        <Skeleton className="mb-4 h-10 w-full" />
        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>
    );
  }

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
          onClick={handleAddEvent}
          disabled={createEvent.isPending}
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
                  {dayEvents.slice(0, 3).map((ev) => {
                    const colors = EVENT_COLORS[ev.type] ?? EVENT_COLORS.work_day;
                    return (
                      <div
                        key={ev.id}
                        className={`group relative rounded px-1 py-0.5 ${colors.bg}`}
                      >
                        <p
                          className={`truncate text-[10px] font-medium ${colors.text}`}
                        >
                          {ev.time ? (
                            <span className="mr-0.5 opacity-75">
                              {ev.time}
                            </span>
                          ) : null}
                          {ev.title}
                        </p>
                        <button
                          onClick={() => deleteEvent.mutate(ev.id)}
                          className="absolute right-0.5 top-0.5 hidden text-[10px] text-red-400 hover:text-red-600 group-hover:block"
                          title="Delete event"
                        >
                          &times;
                        </button>
                      </div>
                    );
                  })}
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

      {events.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-[#888]">
            No events scheduled yet. Click &quot;Add Event&quot; to create one.
          </p>
        </div>
      )}
    </div>
  );
}
