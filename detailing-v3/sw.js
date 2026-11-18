/* Shine On Mobile Detailing — service worker for browser notifications (demo).
   Real push delivery for new bookings is wired after the sale, through the
   site's Worker. This worker only shows notifications it is given. */
self.addEventListener("push", function (event) {
  var data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { body: event.data ? event.data.text() : "" };
  }
  var title = data.title || "Shine On Mobile Detailing";
  var body = data.body || "New booking received.";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: data.icon || undefined,
      data: { url: "./" },
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  var url =
    (event.notification.data && event.notification.data.url) || "./";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (list) {
        for (var i = 0; i < list.length; i++) {
          if ("focus" in list[i]) return list[i].focus();
        }
        if (clients.openWindow) return clients.openWindow(url);
      })
  );
});
