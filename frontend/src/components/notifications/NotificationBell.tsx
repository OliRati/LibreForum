import { useEffect, useState } from 'react';
import { subscribeToUser } from '../../lib/mercureUser';
import { getUserId } from '../../utils/auth';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);

  const userId = getUserId();

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToUser(userId, (data) => {
      if (data.type === 'notification') {
        setNotifications((prev) => [data.notification, ...prev]);
      }
    });

    return unsubscribe;
  }, [userId]);

  return (
    <div className="relative">
      <div className="cursor-pointer">
        🔔 ({notifications.length})
      </div>

      {notifications.length > 0 && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border bg-white shadow">
          {notifications.map((n) => (
            <div key={n.id} className="border-b p-3 text-sm">
              {n.type === 'new_reply' && (
                <div>
                  Nouvelle réponse sur <b>{n.data.topicTitle}</b>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
