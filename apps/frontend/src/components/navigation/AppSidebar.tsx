import { NavLink } from "react-router-dom";
import {
  IconDashboard,
  IconPool,
  IconTool,
  IconUsers,
} from "@tabler/icons-react";
import { useAuth } from "../../features/auth/useAuth";

type Props = Readonly<{
  mobile?: boolean;
  onNavigate: () => void;
}>;

export function AppSidebar({ mobile = false, onNavigate }: Props) {
  const { user } = useAuth();

  const commonItems = [
    { to: "/", label: "Dashboard", icon: <IconDashboard size={20} /> },
    { to: "/pools", label: "Piscinas", icon: <IconPool size={20} /> },
    {
      to: "/maintenance",
      label: "Mantenimientos",
      icon: <IconTool size={20} />,
    },
  ];

  const bossItems =
    user?.role === "boss"
      ? [{ to: "/users", label: "Usuarios", icon: <IconUsers size={20} /> }]
      : [];

  const items = [...commonItems, ...bossItems];

  return (
    <aside
      className="surface-0 border-right-1 surface-border h-full"
      style={{
        width: mobile ? "100%" : "260px",
        minHeight: mobile ? "100%" : "100vh",
        padding: "1rem",
      }}
    >
      <div className="mb-4">
        <h2 className="m-0 text-xl">PoolManager</h2>
        <small className="text-color-secondary">
          {user?.role === "boss" ? "Jefe" : "Empleado"}
        </small>
      </div>

      <nav className="flex flex-column gap-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `no-underline border-round px-3 py-2 flex align-items-center gap-2 transition-duration-150 ${
                isActive
                  ? "bg-primary text-white"
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
