// Bondiez service worker — only job is: receive a push, show a notification,
// and open/focus the app when that notification is tapped.

self.addEventListener('push', (event) => {
  let data = { title: 'Bondiez', body: 'Someone is trying to reach you' };
  try { if(event.data) data = event.data.json(); } catch(e) { /* use default above */ }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: undefined,
      tag: 'bondiez-call', // replaces any previous "calling" notification instead of stacking
      renotify: true,
      requireInteraction: true
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for(const client of clientList){
        if('focus' in client) return client.focus();
      }
      if(self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});
