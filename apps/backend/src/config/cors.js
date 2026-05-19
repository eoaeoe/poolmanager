import cors from "cors";

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (
      !origin ||
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://192.168.") ||
      origin === "https://pm.s6nchez.com"
    ) {
      callback(null, true);
      return;
    }

    callback(new Error("No permitido por CORS"));
  },
  credentials: true,
});
