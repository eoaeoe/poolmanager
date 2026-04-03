import { Button } from "primereact/button";
import { IconMenu2 } from "@tabler/icons-react";
import { useAuth } from "../../features/auth/useAuth";

type Props = Readonly<{
  onMenuClick: () => void;
}>;

export function AppTopbar({ onMenuClick }: Props) {
  const { user, logout } = useAuth();

  return (
    <header
      className="surface-0  surface-border flex align-items-center justify-content-between px-3 md:px-4"
      style={{ height: "70px" }}
    >
      <div className="flex align-items-center gap-2">
        {/* Botón hamburguesa solo en móvil/tablet */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden border-none bg-transparent p-1 cursor-pointer flex align-items-center justify-content-center"
          aria-label="Abrir menú"
        >
          <IconMenu2 size={24} />
        </button>
      </div>

      <div className="flex align-items-center gap-2">
        <strong className="text-sm md:text-base nombreRolUsuario">
          {user?.name} ({user?.role})
        </strong>
        <Button
          icon="pi pi-power-off"
          rounded
          style={{
            color: "#aedff6",
            border: "3px solid #aedff6",
            marginLeft: "10px",
          }}
          outlined
          size="small"
          onClick={logout}
        />
      </div>
    </header>
  );
}
