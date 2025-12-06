import React from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import Movies from "./pages/movies/Movies";
import Shows from "./pages/shows/Shows";
import Home from "./pages/Home";
import Search from "./pages/search/Search";
import Details from "./pages/details/Details";
import App from "./App";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import theme from "./theme";
import Profile from "./pages/Profile";
import CreateWatchlist from "./pages/watchlist/CreateWatchlist";
import EditWatchlist from "./pages/watchlist/EditWatchlist";
import History from "./pages/history/History";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Watchlist from "./pages/watchlist/CreateWatchlist";
import WatchlistDetail from "./pages/watchlist/WatchlistDetail";
import DiscoverUsers from "./pages/DiscoverUsers";
import SocialFeed from "./pages/SocialFeed";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
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
        path: "/discover",
        element: <DiscoverUsers />,
      },
      {
        path: "/feed",
        element: <SocialFeed />,
      },
      {
        path: "/watchlist/:id",
        element: <WatchlistDetail />,
      },
      {
        path: "/edit-watchlist/:id",
        element: <EditWatchlist />,
      },
      {
        path: "/profile/:userId",
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
        path: "/:details/:id",
        element: <Details />,
      },
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement!).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
