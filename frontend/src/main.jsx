import React from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import Movies from './pages/movies/Movies.jsx';
import Shows from './pages/shows/Shows.jsx';
import Home from './pages/Home.jsx'
import Logout from './pages/logout/Logout.jsx'
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
import Profile from "./pages/profile/Profile.jsx";
import CreateWatchlist from "./pages/watchlist/CreateWatchlist.jsx";
import History from './pages/history/History.jsx';
import Login from './pages/login/Login.jsx';
import Signup from './pages/signup/Signup.jsx'
import Watchlist from "./pages/watchlist/CreateWatchlist.jsx";

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
        element: <Movies />,
      },
      {
        path: "/shows",
        element: <Shows />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/create-watchlist",
        element: <CreateWatchlist />,
      },
      {
        path: "/watchlist",
        element: <Watchlist />,
      },
      {
        path: "/history",
        element: <History />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
      {
        path: "/:details/:id",
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
