import { env } from "../../config/env.js";
import {
  deleteRefreshToken,
  deleteRefreshTokensByUserId,
  findUserByEmail,
  findUserById,
  getRefreshToken,
  saveRefreshToken,
  validatePassword,
} from "./auth.service.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "./auth.utils.js";

function buildUserResponse(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    imageUrl: user.imageUrl,
  };
}

function setRefreshCookie(res, token) {
  res.cookie(env.refreshCookieName, token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    path: "/api/auth",
  });
}

function clearRefreshCookie(res) {
  res.clearCookie(env.refreshCookieName, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    path: "/api/auth",
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email y contraseña son obligatorios",
    });
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(401).json({
      message: "Credenciales inválidas",
    });
  }

  const passwordIsValid = await validatePassword(password, user.passwordHash);

  if (!passwordIsValid) {
    return res.status(401).json({
      message: "Credenciales inválidas",
    });
  }

  const tokenPayload = {
    sub: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  };

  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  const refreshExpiresAt = new Date();
  refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7);

  await deleteRefreshTokensByUserId(user.id);
  await saveRefreshToken(user.id, refreshToken, refreshExpiresAt);
  setRefreshCookie(res, refreshToken);

  return res.json({
    user: buildUserResponse(user),
    accessToken,
  });
}

export async function refresh(req, res) {
  const refreshToken = req.cookies?.[env.refreshCookieName];

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token no encontrado",
    });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    const storedToken = await getRefreshToken(refreshToken);

    if (!storedToken) {
      return res.status(401).json({
        message: "Refresh token inválido",
      });
    }

    const newAccessToken = signAccessToken({
      sub: decoded.sub,
      role: decoded.role,
      email: decoded.email,
      name: decoded.name,
    });

    return res.json({
      accessToken: newAccessToken,
    });
  } catch {
    return res.status(401).json({
      message: "Refresh token expirado o inválido",
    });
  }
}

export async function logout(req, res) {
  const refreshToken = req.cookies?.[env.refreshCookieName];

  if (refreshToken) {
    try {
      await deleteRefreshToken(refreshToken);
    } catch {
      // Nada: aunque el token esté mal, limpiamos cookie
    }
  }

  clearRefreshCookie(res);

  return res.json({
    message: "Sesión cerrada correctamente",
  });
}

export async function me(req, res) {
  const user = await findUserById(req.user.sub);

  if (!user) {
    return res.status(404).json({
      message: "Usuario no encontrado",
    });
  }

  return res.json({
    user: buildUserResponse(user),
  });
}
