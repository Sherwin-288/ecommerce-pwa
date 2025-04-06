import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// Register service worker for PWA support
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    const installingWorker = registration.waiting;
    if (installingWorker) {
      installingWorker.onstatechange = () => {
        if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
          if (window.confirm("A new version is available. Reload now?")) {
            window.location.reload();
          }
        }
      };
    }
  },
  onSuccess: () => {
    console.log("✅ Service Worker registered successfully.");
  },
});

// Background Sync
if ("serviceWorker" in navigator && "SyncManager" in window) {
  navigator.serviceWorker.ready
    .then((sw) => sw.sync.register("sync-data"))
    .then(() => console.log("✅ Background Sync Registered"))
    .catch((err) => console.error("❌ Background Sync Registration Failed:", err));
}

// Push Notifications
if ("serviceWorker" in navigator && "PushManager" in window) {
  navigator.serviceWorker.ready.then(async (registration) => {
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: "BKmKrbw8S4XP-QsseV9SklbG-bNjD7e4dBrRcZVsMbu2jyo71B6faw_nRmk-caywVYhUxdVEvuuD1RE90rsc7Dw",
      });

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
