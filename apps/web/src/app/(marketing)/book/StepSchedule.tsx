"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useBookingStore } from "@/lib/stores/booking-store";
import { format, addDays, isSameDay, isWeekend } from "date-fns";

const timeSlots = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

export function StepSchedule() {
  const { consultationDate, consultationTime, setConsultation, nextStep, prevStep } =
    useBookingStore();

  // Generate next 14 weekdays
  const availableDates = useMemo(() => {
    const dates: Date[] = [];
    let d = addDays(new Date(), 1);
    while (dates.length < 14) {
      if (!isWeekend(d)) dates.push(d);
      d = addDays(d, 1);
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    consultationDate ? new Date(consultationDate) : null
  );

  function handleDateSelect(date: Date) {
    setSelectedDate(date);
    setConsultation(date.toISOString(), consultationTime);
  }

  function handleTimeSelect(time: string) {
    if (selectedDate) {
      setConsultation(selectedDate.toISOString(), time);
    }
  }

  const canContinue = consultationDate && consultationTime;

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-black md:text-3xl">
        Schedule Your Consultation
      </h2>
      <p className="mt-2 text-sm text-[#888]">
        Pick a date and time for your free on-site consultation.
      </p>

      {/* Date Picker */}
      <div className="mt-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#888]">
          Select a Date
        </p>
        <div className="flex flex-wrap gap-2">
          {availableDates.map((date) => (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => handleDateSelect(date)}
              className={`rounded-md border px-3 py-2 text-center transition-colors ${
                selectedDate && isSameDay(date, selectedDate)
                  ? "border-black bg-black text-white"
                  : "border-[#e0dbd5] hover:border-black"
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-current opacity-60">
                {format(date, "EEE")}
              </p>
              <p className="text-sm font-semibold">{format(date, "MMM d")}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Time Picker */}
      {selectedDate && (
        <div className="mt-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#888]">
            Select a Time
          </p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => handleTimeSelect(time)}
                className={`rounded-md border px-2 py-2 text-sm transition-colors ${
                  consultationTime === time
                    ? "border-black bg-black text-white"
                    : "border-[#e0dbd5] text-[#555] hover:border-black"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {canContinue && (
        <div className="mt-6 rounded-md border border-[#e0dbd5] bg-[#f8f8f8] p-4">
          <p className="text-sm text-[#555]">
            Your consultation:{" "}
            <span className="font-semibold text-black">
              {format(new Date(consultationDate), "EEEE, MMMM d, yyyy")} at{" "}
              {consultationTime}
            </span>
          </p>
        </div>
      )}

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={prevStep} className="text-sm">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={nextStep}
          disabled={!canContinue}
          className="rounded-md bg-black px-6 text-sm font-bold uppercase tracking-wider text-white hover:bg-black/90"
        >
          Continue
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
