import { Button } from "primereact/button";
import { IconMenu2 } from "@tabler/icons-react";
import { useAuth } from "../../features/auth/useAuth";
import defaultUserImage from "../../assets/default-user.jpg";
import { getImageUrl } from "../../utils/imageUrl";

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
          style={{ color: "aqua" }}
          type="button"
          onClick={onMenuClick}
          className="lg:hidden border-none bg-transparent p-1 cursor-pointer flex align-items-center justify-content-center"
          aria-label="Abrir menú"
        >
          <IconMenu2 size={24} />
        </button>
        <img
          src={
            user?.imageUrl
              ? (getImageUrl(user.imageUrl) ?? defaultUserImage)
              : defaultUserImage
          }
          alt="Usuario"
          style={{
            width: "40px",
            height: "40px",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
        <strong className="text-sm md:text-base nombreRolUsuario">
          {user?.name} ({user?.role == "boss" ? "Jefe" : "Empleado"})
        </strong>
      </div>
      <div className="flex align-items-center gap-2">
        <Button
          icon="pi pi-power-off"
          rounded
          style={{
            // color: "#aedff6",
            // border: "3px solid #aedff6",
            color: "aqua",
            border: "3px solid aqua",
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
