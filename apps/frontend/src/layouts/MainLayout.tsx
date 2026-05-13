import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "primereact/sidebar";
import { AppSidebar } from "../components/navigation/AppSidebar";
import { AppTopbar } from "../components/navigation/AppTopbar";
import "./MainLayout.css";

export function MainLayout() {
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);

  return (
    <div
      className="min-h-screen flex"
      style={{
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
      }}
    >
      <div className="hidden lg:block" style={{ background: "#004565" }}>
        <AppSidebar mobile={false} onNavigate={() => {}} />
      </div>

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

      <div
        className="flex-1 min-h-screen flex flex-column containerAppTopBar"
        style={{
          minWidth: 0,
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <AppTopbar onMenuClick={() => setMobileSidebarVisible(true)} />

        <main
          className="flex-1 overflow-auto"
          style={{
            background: "#1f2937",
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            overflowX: "hidden",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
