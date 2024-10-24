// public/service-worker.js

self.addEventListener("push", function (event) {
  const data = event.data.json();

  const options = {
    body: data.body,
    //icon: "icon.png", // Caminho para um ícone
    ///badge: "icon.png", // Caminho para um badge
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
