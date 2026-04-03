import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { api } from "../services/api";

type UserRole = "employee" | "boss";

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setError("");
        const response = await api.get("/users");
        setUsers(response.data.users);
      } catch {
        setError("No se pudieron cargar los usuarios");
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center py-6">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <section>
      <div className="mb-4">
        <h1 className="m-0">Usuarios</h1>
        <p className="text-color-secondary">Gestión de usuarios del sistema.</p>
      </div>

      {error ? <small className="p-error">{error}</small> : null}

      <div className="grid">
        {users.map((user) => (
          <div key={user.id} className="col-12 md:col-6 xl:col-4">
            <Card title={user.name} subTitle={user.email}>
              <p className="m-0">
                <strong>Rol:</strong> {user.role}
              </p>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
