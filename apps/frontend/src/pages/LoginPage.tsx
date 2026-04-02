import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginAsBoss, loginAsEmployee } = useAuth();

  const handleBossLogin = () => {
    loginAsBoss();
    navigate("/");
  };

  const handleEmployeeLogin = () => {
    loginAsEmployee();
    navigate("/");
  };

  return (
    <div className="flex align-items-center justify-content-center min-h-screen p-3">
      <Card title="Acceso a PoolManager" className="w-full md:w-30rem">
        <p className="mb-4 text-color-secondary">
          Login temporal para desarrollo por roles.
        </p>

        <div className="flex flex-column gap-3">
          <Button label="Entrar como jefe" onClick={handleBossLogin} />
          <Button
            label="Entrar como empleado"
            outlined
            onClick={handleEmployeeLogin}
          />
        </div>
      </Card>
    </div>
  );
}
