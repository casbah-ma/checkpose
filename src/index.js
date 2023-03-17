import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import Capture from 'pages/Capture'
import Analyze from 'pages/Analyze';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Capture />,
  },
  {
    path: "/analyze",
    element: <Analyze />,
  },
  {
    path: "*",
    element: <h1>NOT FOUND</h1>,
  }
]);


const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={ router } />
  </React.StrictMode>
);

serviceWorkerRegistration.register();