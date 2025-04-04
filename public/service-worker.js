/* eslint-disable no-restricted-globals */
const CACHE_NAME = "footwear-store-v2"; // Increment version when updating
const urlsToCache = [
  "/",
  "/index.html",
  "/bundle.js",
  "/manifest.json",
  "/logo192.png",
  "/logo512.png",
  "/running-shoes.jpg",
  "/sports-sandals.jpg",
  "/casual-sneakers.jpg",
  "/formal-shoes.jpg",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
      })
    );
  });
  
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cache) => cache !== CACHE_NAME)
            .map((cache) => caches.delete(cache))
        );
      })
    );
    self.clients.claim(); // Ensures new SW controls all clients immediately
  });

// Fetch event - Serve from cache & update dynamically
self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return; // Prevent caching non-GET requests
  
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
              return networkResponse;
            }
            let responseClone = networkResponse.clone();
            caches.open("dynamic-cache").then((cache) => {
              cache.put(event.request, responseClone);
            });
            return networkResponse;
          })
        );
      }).catch(() => {
        return caches.match("/offline.html"); // Fallback page if fetch fails
      })
    );
  });

// Sync event - Background synchronization
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-orders") {
    event.waitUntil(syncOrders());
  }
});

async function syncOrders() {
  console.log("Syncing orders in background...");
  const orders = await getOrdersFromIndexedDB();
  if (orders.length > 0) {
    await sendOrdersToServer(orders);
    console.log("Orders synced successfully.");
  } else {
    console.log("No offline orders to sync.");
  }
}

function getOrdersFromIndexedDB() {
  return new Promise((resolve) => {
    // Simulate fetching offline orders
    resolve([{ id: 1, product: "Shoes", quantity: 2 }]);
  });
}

async function sendOrdersToServer(orders) {
  try {
    const response = await fetch("/api/sync", {
      method: "POST",
      body: JSON.stringify(orders),
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  } catch (error) {
    console.error("Failed to sync orders:", error);
  }
}

// Push notification event
self.addEventListener("push", (event) => {
  let data = { title: "Footwear Store", body: "New updates available!" };
  if (event.data) {
    data = event.data.json();
  }
  
  const options = {
    body: data.body,
    icon: "/logo192.png",
    badge: "/logo192.png",
  };
  
  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click event - Open app on click
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
  
    event.waitUntil(
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return self.clients.openWindow("/");
      })
    );
  });
  