"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, MessageSquare, FileText, CheckCircle2, Clock, FolderSync } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
    title: "New message",
    body: "Your contractor sent you a message about the kitchen remodel.",
    timestamp: "2h ago",
    read: false,
  },
  {
    id: "2",
    icon: <FileText className="h-4 w-4 text-green-500" />,
    title: "Invoice ready",
    body: "Invoice #1042 for $3,200 is ready for review.",
    timestamp: "4h ago",
    read: false,
  },
  {
    id: "3",
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    title: "Phase complete",
    body: "Framing phase has been marked as complete.",
    timestamp: "6h ago",
    read: false,
  },
  {
    id: "4",
    icon: <Clock className="h-4 w-4 text-amber-500" />,
    title: "Appointment reminder",
    body: "Site walkthrough scheduled for tomorrow at 10:00 AM.",
    timestamp: "1d ago",
    read: true,
  },
  {
    id: "5",
    icon: <FolderSync className="h-4 w-4 text-purple-500" />,
    title: "Project update",
    body: "Timeline for Deck Build has been updated by your contractor.",
    timestamp: "2d ago",
    read: true,
  },
];

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-medium text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Bell className="mb-2 h-8 w-8" />
                <p className="text-sm">You&apos;re all caught up</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex gap-3 px-4 py-3 transition-colors hover:bg-gray-50 ${
                    !n.read ? "bg-blue-50/40" : ""
                  }`}
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                    {n.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900">{n.title}</p>
                      {!n.read && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{n.body}</p>
                    <p className="mt-1 text-[11px] text-gray-400">{n.timestamp}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
