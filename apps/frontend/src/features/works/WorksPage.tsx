import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Message } from "primereact/message";
import { IconClock, IconFlood, IconPool } from "@tabler/icons-react";
import { FinishWorkDialog } from "./FinishWorkDialog";
import { AIDiagnosisDialog } from "../ai/AIDiagnosisDialog";
import { useWorks } from "./useWorks";
import { formatWorkStartDate } from "./works.utils";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";

export default function WorksPage() {
  const {
    pools,
    selectedPoolId,
    setSelectedPoolId,
    currentWork,
    finishDialogVisible,
    setFinishDialogVisible,
    finishData,
    setFinishData,
    loading,
    error,
    handleStartWork,
    handleFinishWork,
    aiDiagnosis,
    aiDialogVisible,
    setAiDialogVisible,
    loadingDiagnosis,
    handleGenerateSelectedPoolDiagnosis,
  } = useWorks();

  return (
    <section>
      <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3 mb-4">
        <div>
          <h2 className="m-0 tituloSeccion">
            <IconFlood className="iconTabler" size={30} /> Mantenimiento
          </h2>
        </div>
      </div>
      {error && (
        <div className="mb-3">
          <Message severity="error" text={error} />
        </div>
      )}

      {currentWork ? (
        <div className="flex flex-column gap-3 justify-content-center align-items-center py-5">
          <Card
            id="cardMantenimientoCurso"
            title="Mantenimiento en curso"
            style={{ minWidth: "300px", backgroundColor: "#4786a3" }}
          >
            <div
              className="p-inputgroup flex-1"
              style={{ marginBottom: "25px" }}
            >
              <span className="p-inputgroup-addon">
                <IconPool className="iconTabler" size={30} />
              </span>
              <InputText
                className="w-full"
                value={currentWork.pool?.name || currentWork.poolId}
                disabled
              />
            </div>

            <div className="p-inputgroup flex-1 justify-content-center">
              <span className="p-inputgroup-addon">
                <IconClock className="iconTabler" size={30} />
              </span>
              <InputText
                className="w-full"
                value={formatWorkStartDate(currentWork)}
                disabled
              />
            </div>
            <div className="p-inputgroup flex-1 justify-content-center">
              <Button
                icon="pi pi-stop"
                rounded
                raised
                style={{
                  width: "100px",
                  height: "100px",
                  marginTop: "35px",
                  marginBottom: "15px",
                  color: "white",
                }}
                id="botonPararTrabajo"
                severity="danger"
                onClick={() => setFinishDialogVisible(true)}
                disabled={loading}
              />
            </div>
          </Card>
        </div>
      ) : (
        <div className="flex flex-column gap-3 justify-content-center align-items-center py-5">
          <div>
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <IconPool className="iconTabler" size={30} />
              </span>
              <Dropdown
                inputId="poolId"
                value={selectedPoolId}
                options={pools}
                optionLabel="name"
                filter
                showClear
                optionValue="id"
                style={{ lineHeight: "28px", minWidth: "300px" }}
                placeholder="Selecciona una piscina"
                onChange={(e) => setSelectedPoolId(e.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-column align-items-center gap-4">
            <Button
              icon="pi pi-play"
              onClick={handleStartWork}
              rounded
              text
              raised
              severity="success"
              style={{
                width: "100px",
                height: "100px",
                marginTop: "35px",
                marginBottom: "35px",
                background: "#004565",
                color: "aqua",
              }}
              id="botonIniciarTrabajo"
              disabled={!selectedPoolId || loading}
              loading={loading}
            />

            <Button
              label="Diagnóstico Automático"
              icon="pi pi-sparkles"
              loading={loadingDiagnosis}
              onClick={handleGenerateSelectedPoolDiagnosis}
              style={{ backgroundColor: "#1e435f" }}
              disabled={!selectedPoolId || loading}
              rounded
              raised
            />
          </div>
        </div>
      )}

      <AIDiagnosisDialog
        visible={aiDialogVisible}
        diagnosis={aiDiagnosis}
        onHide={() => setAiDialogVisible(false)}
      />

      <FinishWorkDialog
        visible={finishDialogVisible}
        loading={loading}
        value={finishData}
        onChange={setFinishData}
        onHide={() => setFinishDialogVisible(false)}
        onSubmit={handleFinishWork}
      />
    </section>
  );
}
