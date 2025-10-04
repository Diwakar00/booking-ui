export type NotificationType = "success" | "error" | "warning" | "info";

export interface INotification {
  id: number;
  message: string;
  type: NotificationType;
  show: boolean;
}

export interface INotificationOptions {
  type?: NotificationType;
  duration?: number;
}
