import {
  createUser,
  deleteUser,
  findUserByEmail,
  findUserById,
  findUsersPaginated,
  updateUser,
  removeUserImage,
} from "./users.service.js";

export async function getUsers(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = String(req.query.search || "").trim();
    const sortField = String(req.query.sortField || "createdAt");
    const sortOrder = String(req.query.sortOrder || "DESC").toUpperCase();

    const result = await findUsersPaginated({
      page,
      limit,
      search,
      sortField,
      sortOrder,
    });

    return res.json(result);
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    return res.status(500).json({
      message: "No se pudieron recuperar los usuarios",
    });
  }
}

export async function createUserController(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Nombre, email, contraseña y rol son obligatorios",
      });
    }

    if (!["boss", "employee"].includes(role)) {
      return res.status(400).json({
        message: "Rol inválido",
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message: "Ya existe un usuario con ese email",
      });
    }

    const imageUrl = req.file ? `/uploads/users/${req.file.filename}` : null;

    const newUser = await createUser({
      name,
      email,
      password,
      role,
      imageUrl,
    });

    return res.status(201).json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        imageUrl: newUser.imageUrl,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("CREATE USER ERROR:", error);

    return res.status(500).json({
      message: "No se pudo crear el usuario",
    });
  }
}

export async function updateUserController(req, res) {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    if (role && !["boss", "employee"].includes(role)) {
      return res.status(400).json({
        message: "Rol inválido",
      });
    }

    const existingUser = await findUserById(id);

    if (!existingUser) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    if (email && email !== existingUser.email) {
      const duplicate = await findUserByEmail(email);

      if (duplicate) {
        return res.status(409).json({
          message: "Ya existe un usuario con ese email",
        });
      }
    }

    const imageUrl = req.file
      ? `/uploads/users/${req.file.filename}`
      : existingUser.imageUrl;

    const updatedUser = await updateUser(id, {
      name,
      email,
      role,
      password,
      imageUrl,
    });

    return res.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        imageUrl: updatedUser.imageUrl,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    return res.status(500).json({
      message: "No se pudo actualizar el usuario",
    });
  }
}

export async function deleteUserController(req, res) {
  try {
    const { id } = req.params;

    const deleted = await deleteUser(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    return res.json({
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return res.status(500).json({
      message: "No se pudo eliminar el usuario",
    });
  }
}

export async function removeUserImageController(req, res) {
  try {
    const { id } = req.params;

    const user = await removeUserImage(id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    return res.json({
      message: "Imagen eliminada",
    });
  } catch (error) {
    console.error("REMOVE IMAGE ERROR:", error);

    return res.status(500).json({
      message: "No se pudo eliminar la imagen",
    });
  }
}
