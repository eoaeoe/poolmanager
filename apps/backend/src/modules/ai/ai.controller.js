import { generatePoolDiagnosis } from "./ai.service.js";

// COMENTADO PARA LLAMAR A OLLAMA
// export async function generatePoolDiagnosisController(req, res, next) {
//   try {
//     const diagnosis = await generatePoolDiagnosis(req.body);

//     return res.status(200).json({
//       diagnosis,
//     });
//   } catch (error) {
//     next(error);
//   }
// }

export async function generatePoolDiagnosisController(req, res, next) {
  try {
    const diagnosis = await generatePoolDiagnosis(req.body);
    return res.status(200).json({
      diagnosis,
    });
  } catch (error) {
    next(error);
  }
}
