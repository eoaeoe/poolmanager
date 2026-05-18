import { NavLink } from "react-router-dom";
import "./AppSidebar.css";
import {
  IconDashboard,
  IconPool,
  IconFlood,
  IconUsers,
  IconClipboardList,
} from "@tabler/icons-react";
import { useAuth } from "../../features/auth/useAuth";

type Props = Readonly<{
  mobile?: boolean;
  onNavigate: () => void;
}>;

export function AppSidebar({ mobile = false, onNavigate }: Props) {
  const { user } = useAuth();

  const employeeItems = [
    {
      to: "/work",
      label: "Mantenimiento",
      icon: <IconFlood size={20} />,
    },
  ];

  const bossItems =
    user?.role === "boss"
      ? [
          { to: "/", label: "Dashboard", icon: <IconDashboard size={20} /> },
          { to: "/pools", label: "Piscinas", icon: <IconPool size={20} /> },
          { to: "/users", label: "Usuarios", icon: <IconUsers size={20} /> },
          {
            to: "/works",
            label: "Trabajos",
            icon: <IconClipboardList size={20} />,
          },
        ]
      : [];

  const items = [...bossItems, ...employeeItems];

  return (
    <aside
      className="surface-0 border-right-0 surface-border h-full"
      style={{
        width: mobile ? "100%" : "260px",
        minHeight: mobile ? "100%" : "100vh",
        padding: "1rem",
      }}
    >
      <div className="mb-4">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src="/logo.png"
            style={{ width: "60px", opacity: 0.3, marginBottom: "0px" }}
            alt="logo"
          />
        </div>
      </div>

      <nav className="flex flex-column gap-2" style={{ marginLeft: "30px" }}>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `no-underline border-round px-3 py-2 flex align-items-center gap-2 transition-duration-150 ${
                isActive
                  ? "bg-primary text-selected"
                  : "text-color hover:surface-100"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
