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
      className="surface-0 border-bottom-1 surface-border flex align-items-center justify-content-between px-3 md:px-4"
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

        <strong className="text-sm md:text-base">
          Bienvenido, {user?.name}
        </strong>
      </div>

      <div className="flex align-items-center gap-2">
        <span className="text-color-secondary hidden sm:inline">
          {user?.role}
        </span>
        <Button
          label="Salir"
          icon="pi pi-sign-out"
          outlined
          size="small"
          onClick={logout}
        />
      </div>
    </header>
  );
}
