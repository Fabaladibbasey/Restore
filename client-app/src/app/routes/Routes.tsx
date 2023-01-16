import { RouteObject, createBrowserRouter } from "react-router-dom";
import About from "../../features/about/About";
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

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
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
        path: "checkout",
        element: <CheckoutPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export const router = createBrowserRouter(routes);
