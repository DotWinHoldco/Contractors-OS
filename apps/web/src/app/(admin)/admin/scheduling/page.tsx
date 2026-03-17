"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppUser } from "@/lib/hooks/use-app-user";
import {
  useScheduleEvents,
  useCreateScheduleEvent,
  useUpdateScheduleEvent,
  useDeleteScheduleEvent,
} from "@/lib/hooks/use-schedule";

type EventType = "consultation" | "site_visit" | "inspection" | "job_work";

const SCHEDULE_EVENT_TYPES = [
  { value: "consultation", label: "Consultation" },
  { value: "site_visit", label: "Site Visit" },
  { value: "estimate_appointment", label: "Estimate Appointment" },
  { value: "job_work", label: "Job Work" },
  { value: "inspection", label: "Inspection" },
  { value: "delivery", label: "Delivery" },
  { value: "client_meeting", label: "Client Meeting" },
  { value: "team_meeting", label: "Team Meeting" },
] as const;

const EVENT_COLORS: Record<EventType, { bg: string; text: string; dot: string }> = {
  consultation: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  site_visit: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  inspection: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  job_work: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
};

const EVENT_LABELS: Record<EventType, string> = {
  consultation: "Consultation",
  site_visit: "Site Visit",
  inspection: "Inspection",
  job_work: "Job Work",
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newEventType, setNewEventType] = useState("job_work");
  const [newDate, setNewDate] = useState("");
  const [newStartTime, setNewStartTime] = useState("09:00");
  const [newEndTime, setNewEndTime] = useState("10:00");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState("weekly");
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [recurrenceCycles, setRecurrenceCycles] = useState<number | "infinite">("infinite");
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);

  const { appUser } = useAppUser();
  const { data: eventsData, isLoading } = useScheduleEvents();
  const createEvent = useCreateScheduleEvent();
  const updateEvent = useUpdateScheduleEvent();
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
    const map: Record<string, { id: string; title: string; type: EventType; time: string; recurring: boolean }[]> = {};

    // Visible range: 6 weeks around current month
    const rangeStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), -7);
    const rangeEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 7);

    const addToMap = (dateStr: string, entry: { id: string; title: string; type: EventType; time: string; recurring: boolean }) => {
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(entry);
    };

    for (const ev of events) {
      const startTime = String(ev.start_time ?? "");
      if (!startTime) continue;

      const evStart = new Date(startTime);
      const title = String(ev.title ?? "");
      const type = (String(ev.event_type ?? "job_work")) as EventType;
      const isRec = !!ev.is_recurring;
      const timeStr = evStart.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      const baseEntry = { id: String(ev.id), title, type, time: timeStr, recurring: isRec };

      // Always add the original occurrence
      const origDate = evStart.toLocaleDateString("en-CA");
      addToMap(origDate, baseEntry);

      // Generate recurring occurrences
      if (isRec && ev.recurrence_pattern && ev.recurrence_pattern !== "none") {
        const pattern = String(ev.recurrence_pattern);
        const interval = Number(ev.recurrence_interval) || 1;
        const endDateStr = ev.recurrence_end_date ? String(ev.recurrence_end_date) : null;
        const recEnd = endDateStr ? new Date(endDateStr) : rangeEnd;

        let cursor = new Date(evStart);
        const maxOccurrences = 200; // safety limit
        let count = 0;

        while (count < maxOccurrences) {
          // Advance cursor by the pattern
          if (pattern === "daily") cursor.setDate(cursor.getDate() + interval);
          else if (pattern === "weekly") cursor.setDate(cursor.getDate() + 7 * interval);
          else if (pattern === "biweekly") cursor.setDate(cursor.getDate() + 14 * interval);
          else if (pattern === "monthly") cursor.setMonth(cursor.getMonth() + interval);
          else if (pattern === "quarterly") cursor.setMonth(cursor.getMonth() + 3 * interval);
          else if (pattern === "semiannual") cursor.setMonth(cursor.getMonth() + 6 * interval);
          else if (pattern === "annual") cursor.setFullYear(cursor.getFullYear() + interval);
          else break;

          if (cursor > recEnd || cursor > rangeEnd) break;
          count++;

          if (cursor >= rangeStart) {
            const ds = cursor.toLocaleDateString("en-CA");
            addToMap(ds, { ...baseEntry, id: `${baseEntry.id}_r${count}` });
          }
        }
      }
    }
    return map;
  }, [events, currentDate]);

  const cellDateStr = (cell: { day: number; month: number; year: number }) => {
    const m = String(cell.month + 1).padStart(2, "0");
    const d = String(cell.day).padStart(2, "0");
    return `${cell.year}-${m}-${d}`;
  };

  // Get local timezone offset string like "-05:00"
  const getTzOffset = () => {
    const offset = new Date().getTimezoneOffset();
    const sign = offset <= 0 ? "+" : "-";
    const hrs = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
    const mins = String(Math.abs(offset) % 60).padStart(2, "0");
    return `${sign}${hrs}:${mins}`;
  };

  const [editingEvent, setEditingEvent] = useState<Record<string, unknown> | null>(null);

  const openAddDialog = () => {
    const today = new Date().toISOString().split("T")[0];
    setEditingEvent(null);
    setNewTitle("");
    setNewEventType("job_work");
    setNewDate(today);
    setNewStartTime("09:00");
    setNewEndTime("10:00");
    setIsRecurring(false);
    setRecurrencePattern("weekly");
    setRecurrenceInterval(1);
    setRecurrenceCycles("infinite");
    setDialogOpen(true);
  };

  const openEditDialog = (eventId: string) => {
    const ev = events.find((e) => String(e.id) === eventId);
    if (!ev) return;
    setEditingEvent(ev);
    setNewTitle(String(ev.title || ""));
    setNewEventType(String(ev.event_type || "job_work"));
    const start = ev.start_time ? new Date(ev.start_time as string) : new Date();
    const end = ev.end_time ? new Date(ev.end_time as string) : new Date();
    setNewDate(start.toLocaleDateString("en-CA"));
    setNewStartTime(start.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    setNewEndTime(end.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    setIsRecurring(!!ev.is_recurring);
    setRecurrencePattern(String(ev.recurrence_pattern || "weekly"));
    setRecurrenceInterval(Number(ev.recurrence_interval) || 1);
    setRecurrenceCycles(ev.recurrence_end_date ? 10 : "infinite");
    setDialogOpen(true);
  };

  const handleDrop = (targetDate: string) => {
    if (!draggedEventId) return;
    const ev = events.find((e) => String(e.id) === draggedEventId);
    if (!ev) return;

    const oldStart = new Date(ev.start_time as string);
    const oldEnd = new Date(ev.end_time as string);
    const duration = oldEnd.getTime() - oldStart.getTime();

    // Build new start at same time but on the target date
    const [y, m, d] = targetDate.split("-").map(Number);
    const newStart = new Date(oldStart);
    newStart.setFullYear(y, m - 1, d);
    const newEnd = new Date(newStart.getTime() + duration);

    updateEvent.mutate({
      id: draggedEventId,
      start_time: newStart.toISOString(),
      end_time: newEnd.toISOString(),
    });
    setDraggedEventId(null);
  };

  const handleSaveEvent = () => {
    const dateStr = newDate || new Date().toISOString().split("T")[0];
    const tz = getTzOffset();
    const startTime = `${dateStr}T${newStartTime}:00${tz}`;
    const endTime = `${dateStr}T${newEndTime}:00${tz}`;

    // Calculate recurrence end date based on cycles
    let recurrenceEndDate: string | null = null;
    if (isRecurring && recurrenceCycles !== "infinite") {
      const endD = new Date(dateStr);
      const multiplier = recurrencePattern === "daily" ? 1 : recurrencePattern === "weekly" || recurrencePattern === "biweekly" ? 7 : recurrencePattern === "monthly" ? 30 : recurrencePattern === "quarterly" ? 90 : recurrencePattern === "annual" ? 365 : 7;
      const factor = recurrencePattern === "biweekly" ? 2 : 1;
      endD.setDate(endD.getDate() + multiplier * factor * recurrenceInterval * (recurrenceCycles as number));
      recurrenceEndDate = endD.toISOString().split("T")[0];
    }

    const recurrenceFields = isRecurring ? {
      is_recurring: true,
      recurrence_pattern: recurrencePattern,
      recurrence_interval: recurrenceInterval,
      recurrence_end_date: recurrenceEndDate,
    } : {
      is_recurring: false,
      recurrence_pattern: "none",
      recurrence_interval: null,
      recurrence_end_date: null,
    };

    if (editingEvent) {
      updateEvent.mutate(
        {
          id: String(editingEvent.id),
          title: newTitle || "Untitled Event",
          event_type: newEventType,
          start_time: startTime,
          end_time: endTime,
          ...recurrenceFields,
        },
        { onSuccess: () => { setDialogOpen(false); setEditingEvent(null); } }
      );
    } else {
      createEvent.mutate(
        {
          title: newTitle || "Untitled Event",
          event_type: newEventType,
          start_time: startTime,
          end_time: endTime,
          tenant_id: appUser?.tenantId,
          ...recurrenceFields,
        },
        { onSuccess: () => setDialogOpen(false) }
      );
    }
  };

  const handleDeleteEvent = () => {
    if (!editingEvent) return;
    if (confirm("Delete this event?")) {
      deleteEvent.mutate(String(editingEvent.id));
      setDialogOpen(false);
      setEditingEvent(null);
    }
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
          onClick={openAddDialog}
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Event
        </Button>
      </div>

      {/* Add/Edit Event Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingEvent(null); }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Add Event"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="event-title">Title</Label>
              <Input
                id="event-title"
                placeholder="Event title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-type">Event Type</Label>
              <Select value={newEventType} onValueChange={(v) => { if (v) setNewEventType(v); }}>
                <SelectTrigger id="event-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {SCHEDULE_EVENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-date">Date</Label>
              <Input
                id="event-date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="event-start">Start Time</Label>
                <Input
                  id="event-start"
                  type="time"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-end">End Time</Label>
                <Input
                  id="event-end"
                  type="time"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                />
              </div>
            </div>
            {/* Recurrence */}
            <div className="space-y-3 rounded-md border border-[#e0dbd5] p-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is-recurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="h-4 w-4 rounded border-[#e0dbd5]"
                />
                <Label htmlFor="is-recurring" className="text-sm font-medium">Repeating Event</Label>
              </div>
              {isRecurring && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#888]">Every</span>
                    <Input
                      type="number"
                      min={1}
                      max={99}
                      value={recurrenceInterval}
                      onChange={(e) => setRecurrenceInterval(Number(e.target.value) || 1)}
                      className="w-16 text-center"
                    />
                    <select
                      value={recurrencePattern}
                      onChange={(e) => setRecurrencePattern(e.target.value)}
                      className="rounded-md border border-[#e0dbd5] bg-white px-2 py-1.5 text-sm"
                    >
                      <option value="daily">day(s)</option>
                      <option value="weekly">week(s)</option>
                      <option value="biweekly">2 weeks</option>
                      <option value="monthly">month(s)</option>
                      <option value="quarterly">quarter(s)</option>
                      <option value="annual">year(s)</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#888]">Repeats for</span>
                    <select
                      value={recurrenceCycles === "infinite" ? "infinite" : String(recurrenceCycles)}
                      onChange={(e) => setRecurrenceCycles(e.target.value === "infinite" ? "infinite" : Number(e.target.value))}
                      className="rounded-md border border-[#e0dbd5] bg-white px-2 py-1.5 text-sm"
                    >
                      <option value="infinite">Forever</option>
                      <option value="2">2 cycles</option>
                      <option value="4">4 cycles</option>
                      <option value="6">6 cycles</option>
                      <option value="8">8 cycles</option>
                      <option value="10">10 cycles</option>
                      <option value="12">12 cycles</option>
                      <option value="24">24 cycles</option>
                      <option value="52">52 cycles</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <div>
              {editingEvent && (
                <Button variant="destructive" size="sm" onClick={handleDeleteEvent}>
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setDialogOpen(false); setEditingEvent(null); }}>
                Cancel
              </Button>
              <Button
                className="bg-black text-white hover:bg-black/90"
                onClick={handleSaveEvent}
                disabled={createEvent.isPending || updateEvent.isPending}
              >
                {editingEvent
                  ? updateEvent.isPending ? "Saving..." : "Save Changes"
                  : createEvent.isPending ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("bg-[#D4A84B]/10"); }}
                onDragLeave={(e) => { e.currentTarget.classList.remove("bg-[#D4A84B]/10"); }}
                onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("bg-[#D4A84B]/10"); handleDrop(dateStr); }}
                className={`min-h-[100px] border-b border-r border-[#e0dbd5] p-1.5 transition-colors ${
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
                    const colors = EVENT_COLORS[ev.type] ?? EVENT_COLORS.job_work;
                    return (
                      <button
                        key={ev.id}
                        draggable
                        onDragStart={() => setDraggedEventId(ev.id)}
                        onDragEnd={() => setDraggedEventId(null)}
                        onClick={() => openEditDialog(ev.id)}
                        className={`w-full cursor-grab rounded px-1 py-0.5 text-left transition-opacity hover:opacity-80 active:cursor-grabbing ${colors.bg}`}
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
                          {ev.recurring && <span className="ml-0.5 opacity-60">🔁</span>}
                        </p>
                      </button>
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
