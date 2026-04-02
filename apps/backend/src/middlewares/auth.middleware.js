import { verifyAccessToken } from "../modules/auth/auth.utils.js";

export function requireAuth(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token no proporcionado",
    });
  }

  const token = authorizationHeader.replace("Bearer ", "").trim();

  try {
    const decoded = verifyAccessToken(token);

    req.user = {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Token inválido o expirado",
    });
  }
}
