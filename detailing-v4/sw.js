"use strict";
/* Shine On Mobile Detailing — service worker.
   Push delivery for new bookings. The Worker that sends the push is wired
   after the sale, on the owner's hosting; this file only shows what arrives
   and opens the site when the notification is tapped. */

self.addEventListener("push", function (event) {
  var data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { body: event.data.text() };
    }
  }
  var title = data.title || "New booking";
  var body = data.body || "A new booking came in. Open the cabinet to see it.";
  var options = {
    body: body,
    tag: data.tag || "booking",
    data: { url: "./" }
  };
  if (data.icon) options.icon = data.icon;
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || "./";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if ("focus" in list[i]) return list[i].focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
