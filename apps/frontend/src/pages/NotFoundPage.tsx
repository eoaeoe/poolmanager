import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section>
      <h1>404</h1>
      <p>Página no encontrada.</p>
      <Button label="Volver" onClick={() => navigate("/")} />
    </section>
  );
}
