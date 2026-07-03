import { Outlet } from "react-router-dom";
import Sidebar from "../components/shared/SideBar.tsx";

const MainLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;