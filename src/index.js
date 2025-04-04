import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Service Worker for PWA support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("✅ Service Worker registered with scope:", registration.scope);

        // Listen for updates to the service worker
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  console.log("🔄 New update available! Reload to update.");
                  if (window.confirm("A new version is available. Reload now?")) {
                    window.location.reload();
                  }
                } else {
                  console.log("✅ Content is cached for offline use.");
                }
              }
            };
          }
        };
      })
      .catch((error) => {
        console.error("❌ Service Worker registration failed:", error);
      });
  });
}

// Register service worker using the serviceWorkerRegistration.js file
serviceWorkerRegistration.register();

// Background Sync Implementation
if ("serviceWorker" in navigator && "SyncManager" in window) {
  navigator.serviceWorker.ready.then((sw) => {
    sw.sync.register("sync-data").then(() => {
      console.log("✅ Background Sync Registered");
    }).catch((err) => {
      console.error("❌ Background Sync Registration Failed:", err);
    });
  });
}

// Push Notification Implementation
if ("serviceWorker" in navigator && "PushManager" in window) {
  navigator.serviceWorker.ready.then(async (registration) => {
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: "BKmKrbw8S4XP-QsseV9SklbG-bNjD7e4dBrRcZVsMbu2jyo71B6faw_nRmk-caywVYhUxdVEvuuD1RE90rsc7Dw",
      });

      // Send subscription to the server
      await fetch("http://localhost:5000/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Push Subscription sent to server:", subscription);
    } catch (error) {
      console.error("❌ Push Subscription Failed:", error);
    }
  });
}
