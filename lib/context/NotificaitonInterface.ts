export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
};

export interface NotificationInterface {
  id: number;
  message: string;
  type: string;
  timeout?: number;
}

export interface NotificationContextType {
  notifications: NotificationInterface[];
  showNotification: (
    message: string,
    type?: string,
    timeout?: number,
  ) => number;
  showSuccess: (message: string, timeout?: number) => number;
  showError: (message: string, timeout?: number) => number;
  showWarning: (message: string, timeout?: number) => number;
  removeNotification: (id: number) => void;
  clearNotifications: () => void;
}
