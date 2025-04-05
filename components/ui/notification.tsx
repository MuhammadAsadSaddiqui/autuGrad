"use client";

import React, { useEffect, useState } from "react";
import {
  NOTIFICATION_TYPES,
  NotificationInterface,
} from "@/lib/context/NotificaitonInterface";
import { useNotification } from "@/lib/context/NotificationContext";

const notificationStyles = {
  [NOTIFICATION_TYPES.SUCCESS]: {
    container: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    borderColor: "border-green-700",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    progressColor: "bg-green-300",
  },
  [NOTIFICATION_TYPES.ERROR]: {
    container: "bg-gradient-to-r from-red-500 to-red-600 text-white",
    borderColor: "border-red-700",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
    progressColor: "bg-red-300",
  },
  [NOTIFICATION_TYPES.WARNING]: {
    container: "bg-gradient-to-r from-amber-500 to-amber-600 text-white",
    borderColor: "border-amber-700",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    progressColor: "bg-amber-300",
  },
};

function NotificationItem({
  notification,
  onClose,
}: {
  notification: NotificationInterface;
  onClose: () => void;
}) {
  const [isExiting, setIsExiting] = useState(false);
  const style =
    notificationStyles[notification.type] ||
    notificationStyles[NOTIFICATION_TYPES.SUCCESS];

  // Auto close animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onClose();
      }, 300); // Wait for exit animation to complete
    }, 4700); // Slightly less than the progress bar duration

    const progressBar = document.getElementById(`progress-${notification.id}`);
    if (progressBar) {
      progressBar.style.width = "100%";
      progressBar.style.transition = "none";
      setTimeout(() => {
        progressBar.style.width = "0%";
        progressBar.style.transition = "width linear 5s";
      }, 10);
    }

    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  return (
    <div
      className={`flex flex-col shadow-xl rounded-lg overflow-hidden mb-3 border-l-4 ${
        style.borderColor
      } ${
        isExiting ? "animate-slideOut" : "animate-slideIn"
      } backdrop-blur-sm bg-opacity-95 ${style.container}`}
    >
      <div className="flex items-center p-3">
        <div className="flex-shrink-0 mr-3">
          <div className="p-2 rounded-full bg-white bg-opacity-20">
            {style.icon}
          </div>
        </div>
        <div className="flex-grow font-medium">
          <div className="text-sm">{notification.message}</div>
        </div>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(onClose, 300);
          }}
          className="ml-2 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-40"
          aria-label="Close notification"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-black bg-opacity-10">
        <div
          id={`progress-${notification.id}`}
          className={`h-full ${style.progressColor}`}
          style={{ width: "100%" }}
        ></div>
      </div>
    </div>
  );
}

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-0 right-0 z-50 p-4 pointer-events-none max-h-screen overflow-hidden">
      <div className="w-full max-w-md space-y-2 pointer-events-auto flex flex-col items-end">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </div>
  );
}
