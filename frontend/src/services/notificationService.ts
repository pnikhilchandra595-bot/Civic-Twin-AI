/**
 * Real Web Notification Service for Desktop OS Alerts
 */

class NotificationService {
  private permissionGranted: boolean = false;

  constructor() {
    if ('Notification' in window) {
      this.permissionGranted = Notification.permission === 'granted';
    }
  }

  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    try {
      const perm = await Notification.requestPermission();
      this.permissionGranted = perm === 'granted';
      return this.permissionGranted;
    } catch (e) {
      return false;
    }
  }

  public sendDesktopAlert(title: string, body: string, iconUrl?: string) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      this.requestPermission().then(granted => {
        if (granted) this._show(title, body, iconUrl);
      });
      return;
    }
    this._show(title, body, iconUrl);
  }

  private _show(title: string, body: string, iconUrl?: string) {
    try {
      new Notification(title, {
        body,
        icon: iconUrl || '/favicon.ico',
        tag: 'civictwin-emergency',
        requireInteraction: true
      });
    } catch (e) {
      console.warn('Desktop notification error:', e);
    }
  }
}

export const notificationService = new NotificationService();
