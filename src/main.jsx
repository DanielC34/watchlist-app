import React from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import App from './App';
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import pageTheme from '../pageTheme.js';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <h1>Home</h1>,
      },
      {
        path: "/movies",
        element: <h1>Movies</h1>,
      },
      {
        path: "/shows",
        element: <h1>Shows</h1>,
      },
      {
        path: "/search",
        element: <h1>Search</h1>,
      },
      {
        path: "/:type/:id",
        element: <h1>Details</h1>,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={pageTheme.config.initialColorMode} />
      <ChakraProvider theme={pageTheme}>
        <RouterProvider router={router} />
      </ChakraProvider>
  </React.StrictMode>
);
