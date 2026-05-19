import { Dialog } from "primereact/dialog";
import type { AIDiagnosis } from "./ai.api";

interface Props {
  readonly visible: boolean;
  readonly diagnosis: AIDiagnosis | null;
  readonly onHide: () => void;
}

export function AIDiagnosisDialog({ visible, diagnosis, onHide }: Props) {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={
        <div className="ai-dialog-header">
          <i className="pi pi-sparkles"></i>
          <span>{diagnosis?.title}</span>
        </div>
      }
      modal
      style={{ width: "100%", maxWidth: "45rem" }}
      className="DialogAIDiagnosis"
    >
      {diagnosis && (
        <div className="ai-diagnosis">
          {diagnosis.criticals.length > 0 && (
            <div className="ai-diagnosis-block critical">
              <h3>
                <i className="pi pi-times-circle"></i> Crítico
              </h3>

              {diagnosis.criticals.map((item) => (
                <p key={item}>• {item}</p>
              ))}
            </div>
          )}

          {diagnosis.alerts.length > 0 && (
            <div className="ai-diagnosis-block warning">
              <h3>
                <i className="pi pi-exclamation-triangle"></i> Avisos
              </h3>

              {diagnosis.alerts.map((item) => (
                <p key={item}>• {item}</p>
              ))}
            </div>
          )}

          {diagnosis.positives.length > 0 && (
            <div className="ai-diagnosis-block success">
              <h3>
                <i className="pi pi-check-circle"></i> Correcto
              </h3>

              {diagnosis.positives.map((item) => (
                <p key={item}>• {item}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}
