import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import Capture from "pages/Capture";
import Analyze from "pages/Analyze";
import Intro from "pages/Intro";
import "rc-slider/assets/index.css";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Intro />,
  },
  {
    path: "/capture",
    element: <Capture />,
  },
  {
    path: "/analyze",
    element: <Analyze />,
  },
  {
    path: "/about",
    element: <Capture />,
  },
  {
    path: "*",
    element: <h1>NOT FOUND</h1>,
  },
]);

const root = createRoot(document.getElementById("root"));
root.render(
  <>
    <Toaster />
    <RouterProvider router={router} />
  </>
);

serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    const waitingServiceWorker = registration.waiting;

    if (waitingServiceWorker) {
      waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
      toast("New version available")
      setTimeout(()=>window.location.reload(),2500)
    }
  }
})

function delay(t) {
  return new Promise(function (resolve) {
      setTimeout(resolve, t);
  });
}
