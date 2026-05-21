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
      window.scrollTo(0, 0);
      navigate("/");
    } catch {
      setError("No se pudo iniciar sesión");
    }
  };

  return (
    <div className="flex align-items-center justify-content-center min-h-screen p-3">
      <Card className="w-full md:w-30rem cardLogin">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src="/logo.png"
            style={{ width: "150px", opacity: 1, marginBottom: "0px" }}
            alt="logo"
          />
        </div>
        <div className="mb-6" style={{ color: "#ffffff26" }}>
          {/* <h2 className="text-center">PoolManager</h2> */}
        </div>
        <div className="flex flex-column gap-3 mb-3">
          <span className="p-float-label">
            <InputText
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            <label htmlFor="email">Email</label>
          </span>

          <span className="p-float-label mt-3 mb-3">
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
