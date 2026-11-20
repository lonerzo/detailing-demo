/* Service worker for browser push notifications (detailing demo). */
"use strict";

self.addEventListener("push", function(event){
  var data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) { data = {}; }
  var title = data.title || "New booking";
  var body = data.body || "A new booking just came in. Open the cabinet to see the details.";
  event.waitUntil(self.registration.showNotification(title, { body: body }));
});

self.addEventListener("notificationclick", function(event){
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(list){
      for (var i = 0; i < list.length; i++){
        if ("focus" in list[i]) return list[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow("./");
    })
  );
});
