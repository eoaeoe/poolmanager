import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { IconMoodCry, IconHome2 } from "@tabler/icons-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      className="flex align-items-center justify-content-center"
      style={{
        minHeight: "calc(100vh - 70px)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          background: "rgba(174, 223, 246, 0.08)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "3rem 2rem",
          backdropFilter: "blur(10px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            margin: "0 auto 1.5rem auto",
            borderRadius: "50%",
            background: "rgba(0, 229, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid rgba(0, 229, 255, 0.15)",
          }}
        >
          <IconMoodCry size={70} color="#7fe7ff" stroke={1.5} />
        </div>

        <h1
          style={{
            fontSize: "5rem",
            margin: 0,
            color: "#7fe7ff",
            fontWeight: 700,
            letterSpacing: "4px",
          }}
        >
          404
        </h1>

        <h2
          style={{
            color: "white",
            marginTop: "1rem",
            marginBottom: "1rem",
            fontWeight: 400,
          }}
        >
          Página no encontrada
        </h2>

        <p
          style={{
            color: "#d7e7ef",
            maxWidth: "500px",
            margin: "0 auto 2rem auto",
            lineHeight: 1.7,
            fontSize: "1rem",
          }}
        >
          La página que estás intentando abrir no existe, fue movida o no tienes
          acceso a ella.
        </p>

        <Button
          label="Volver al inicio"
          icon={<IconHome2 size={18} />}
          onClick={() => navigate("/")}
          style={{
            background: "#004565",
            border: "1px solid #00e5ff55",
            padding: "0.9rem 1.4rem",
          }}
        />
      </div>
    </div>
  );
}
