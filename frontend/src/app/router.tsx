import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout.tsx";
import ChatPage from "../pages/ChatPage.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import LoginPage from "../pages/LoginPage.tsx"

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/chat/:chatId",
        element: <ChatPage />,
      },
      {
        path: "/",
        element: <ChatPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path:"/login",
    element: <LoginPage />
  }
]);
