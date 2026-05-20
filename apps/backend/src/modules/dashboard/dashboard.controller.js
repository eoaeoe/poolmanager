import {
  getLatestPoolLevels,
  getDashboardSummary,
} from "./dashboard.service.js";

export async function getLatestPoolLevelsController(req, res, next) {
  try {
    const data = await getLatestPoolLevels();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function getDashboardSummaryController(req, res, next) {
  try {
    const dashboard = await getDashboardSummary();
    return res.status(200).json(dashboard);
  } catch (error) {
    next(error);
  }
}
