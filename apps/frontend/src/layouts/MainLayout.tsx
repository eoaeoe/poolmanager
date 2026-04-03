import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "primereact/sidebar";
import { AppSidebar } from "../components/navigation/AppSidebar";
import { AppTopbar } from "../components/navigation/AppTopbar";
import "./MainLayout.css";

export function MainLayout() {
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar fija en desktop */}
      <div className="hidden lg:block" style={{ background: "#004565" }}>
        <AppSidebar mobile={false} onNavigate={() => {}} />
      </div>

      {/* Sidebar móvil */}
      <Sidebar
        style={{ background: "#004565" }}
        visible={mobileSidebarVisible}
        onHide={() => setMobileSidebarVisible(false)}
        showCloseIcon={false}
        modal
        className="w-18rem p-0"
      >
        <AppSidebar mobile onNavigate={() => setMobileSidebarVisible(false)} />
      </Sidebar>

      {/* Área principal */}
      <div className="flex-1 min-h-screen flex flex-column containerAppTopBar">
        <AppTopbar onMenuClick={() => setMobileSidebarVisible(true)} />

        <main
          className=" flex-1 overflow-auto"
          style={{ background: "#1f2937" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
