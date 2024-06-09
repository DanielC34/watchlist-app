import React from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import Movies from './pages/movies/Movies.jsx';
import Anime from "./pages/anime/Anime.jsx";
import Shows from './pages/shows/Shows.jsx';
import Home from './pages/Home.jsx'
import Search from "./pages/search/Search.jsx";
import Details from "./pages/details/Details.jsx";
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
        element: <Home />,
      },
      {
        path: "/movies",
        element: <Movies/>,
      },
      {
        path: "/shows",
        element: <Shows />,
      },
      {
        path: "/anime",
        element: <Anime />,
      },
      {
        path: "/search",
        element: <Search/>,
      },
      {
        path: "/:type/:id",
        element: <Details />,
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
