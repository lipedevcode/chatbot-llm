import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex h-screen">
      <aside>Sidebar</aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
