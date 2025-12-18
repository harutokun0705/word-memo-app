/**
 * ブラウザ通知ユーティリティ
 */

// 通知許可をリクエストする
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('このブラウザは通知をサポートしていません。');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

// 通知許可状態を取得
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

// ローカル通知を送信
export function sendLocalNotification(title: string, options?: NotificationOptions) {
  if (!('Notification' in window)) {
    console.warn('このブラウザは通知をサポートしていません。');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      ...options,
    });
  }
}

// 未処理メモのリマインダーを送信
export function sendMemoReminder(count: number) {
  if (count <= 0) return;
  
  sendLocalNotification('📝 未アウトプットのメモがあります', {
    body: `${count}件のメモがまだアウトプットされていません。復習して知識を定着させましょう！`,
    tag: 'memo-reminder', // 同じタグの通知は上書きされる
  });
}
