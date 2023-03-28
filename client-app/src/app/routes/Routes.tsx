import { RouteObject, createBrowserRouter } from "react-router-dom";
import About from "../../features/about/About";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import BasketPage from "../../features/basket/BasketPage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetail from "../../features/catalog/ProductDetail";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import Contact from "../../features/contact/Contact";
import Home from "../../features/home/Home";
import NotFound from "../errors/NotFound";
import ServerError from "../errors/ServerError";
import App from "../layout/App";
import TestErrors from "../layout/TestErrors";
import RouterAuth from "./RouterAuth";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RouterAuth />,
        children: [
          {
            path: "checkout",
            element: <CheckoutPage />,
          },
        ],
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "catalog",
        element: <Catalog />,
      },
      {
        path: "catalog/:id",
        element: <ProductDetail />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "test-error",
        element: <TestErrors />,
      },
      {
        path: "server-error",
        element: <ServerError />,
      },
      {
        path: "basket",
        element: <BasketPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export const router = createBrowserRouter(routes);
