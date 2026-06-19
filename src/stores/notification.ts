import { create } from "zustand";

// Copied from project https://pixelbattle.fun/
export interface NotificationInfo {
  message: string;
  title: string;
  type: "error" | "success";
  id: string;
}

export interface NotificationsState {
  notifications: NotificationInfo[];

  addNotification: (
    notification: Omit<NotificationInfo, "id">,
    autoRemove?: number,
  ) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  addNotification: (notification, autoRemove = 10000) => {
    const { notifications } = get();

    const newNotifications = [...notifications];

    if (newNotifications.length >= 5) {
      newNotifications.shift();
    }

    const id = Math.random().toString(36).substring(2, 9);

    newNotifications.push({
      ...notification,
      id,
    });

    set({ notifications: newNotifications });

    if (autoRemove > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, autoRemove);
    }
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },
}));
