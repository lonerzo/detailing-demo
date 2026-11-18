/* Shine On Mobile Detailing — service worker (v2).
   Shows a notification for push messages sent by the Worker after a sale.
   In this demo no push is ever sent; the cabinet's test button uses a local
   Notification instead. */
self.addEventListener("push", function (event) {
  var data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { body: event.data ? event.data.text() : "" };
  }
  var title = data.title || "New booking";
  var body = data.body || "A new booking came in.";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      tag: data.tag || "booking"
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (list) {
        for (var i = 0; i < list.length; i++) {
          if ("focus" in list[i]) return list[i].focus();
        }
        if (clients.openWindow) return clients.openWindow("./");
      })
  );
});
