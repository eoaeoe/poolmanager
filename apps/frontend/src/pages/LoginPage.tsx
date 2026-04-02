import { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("boss@poolmanager.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");
      await login(email, password);
      navigate("/");
    } catch {
      setError("No se pudo iniciar sesión");
    }
  };

  return (
    <div className="flex align-items-center justify-content-center min-h-screen p-3">
      <Card title="Acceso a PoolManager" className="w-full md:w-30rem">
        <div className="flex flex-column gap-3">
          <span className="p-float-label">
            <InputText
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            <label htmlFor="email">Email</label>
          </span>

          <span className="p-float-label">
            <Password
              inputId="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              toggleMask
              feedback={false}
              className="w-full"
              inputClassName="w-full"
            />
            <label htmlFor="password">Contraseña</label>
          </span>

          {error ? <small className="p-error">{error}</small> : null}

          <Button label="Entrar" onClick={handleSubmit} />
        </div>
      </Card>
    </div>
  );
}
