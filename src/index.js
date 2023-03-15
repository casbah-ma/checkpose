import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Capture from 'pages/Capture'
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Capture />,
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