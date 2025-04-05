// context/NotificationContext.js
"use client";

import React, { createContext, useContext, useState } from "react";
import {
  NotificationInterface,
  NOTIFICATION_TYPES,
  NotificationContextType,
} from "@/lib/context/NotificaitonInterface";

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [notifications, setNotifications] = useState<NotificationInterface[]>(
    [],
  );

  const showNotification = (
    message: string,
    type = NOTIFICATION_TYPES.SUCCESS,
    timeout = 5000,
  ) => {
    const id = Date.now();
    const new_notification: NotificationInterface = {
      id,
      message,
      type,
    };
    setNotifications((prev) => [...prev, new_notification]);

    if (timeout) {
      setTimeout(() => {
        removeNotification(id);
      }, timeout);
    }

    return id;
  };

  const showSuccess = (message: string, timeout?: number) =>
    showNotification(message, NOTIFICATION_TYPES.SUCCESS, timeout);
  const showError = (message: string, timeout?: number) =>
    showNotification(message, NOTIFICATION_TYPES.ERROR, timeout);
  const showWarning = (message: string, timeout?: number) =>
    showNotification(message, NOTIFICATION_TYPES.WARNING, timeout);

  const removeNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        showSuccess,
        showError,
        showWarning,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }

  return context;
}
