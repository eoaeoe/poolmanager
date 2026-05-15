import { getLatestPoolLevels } from "./dashboard.service.js";

export async function getLatestPoolLevelsController(req, res, next) {
  try {
    const data = await getLatestPoolLevels();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}
