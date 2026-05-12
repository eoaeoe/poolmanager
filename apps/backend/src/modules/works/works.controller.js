import {
  finishWork,
  getCurrentWorkByUser,
  startWork,
  getWorksByPool,
  getWorksByUser,
} from "./works.service.js";
import { validateFinishWork, validateStartWork } from "./works.validators.js";

export async function getCurrentWorkController(req, res, next) {
  try {
    const work = await getCurrentWorkByUser(req.user.id);

    return res.status(200).json(work);
  } catch (error) {
    next(error);
  }
}

export async function startWorkController(req, res, next) {
  try {
    const { poolId } = req.body;

    const validation = validateStartWork(poolId);

    if (validation.error) {
      return res.status(validation.status).json({
        message: validation.message,
      });
    }

    const result = await startWork({
      userId: req.user.id,
      poolId,
    });

    if (result.error) {
      return res.status(result.status).json({
        message: result.message,
      });
    }

    return res.status(201).json(result.work);
  } catch (error) {
    next(error);
  }
}

export async function finishWorkController(req, res, next) {
  try {
    const validation = validateFinishWork(req.body);

    if (validation.error) {
      return res.status(validation.status).json({
        message: validation.message,
      });
    }

    const result = await finishWork({
      workId: req.params.id,
      userId: req.user.id,
      data: req.body,
    });

    if (result.error) {
      return res.status(result.status).json({
        message: result.message,
      });
    }

    return res.status(200).json(result.work);
  } catch (error) {
    next(error);
  }
}

export async function getWorksByUserController(req, res, next) {
  try {
    const { userId } = req.params;

    const works = await getWorksByUser(userId);

    return res.status(200).json(works);
  } catch (error) {
    next(error);
  }
}

export async function getWorksByPoolController(req, res, next) {
  try {
    const { poolId } = req.params;

    const works = await getWorksByPool(poolId);

    return res.status(200).json(works);
  } catch (error) {
    next(error);
  }
}
