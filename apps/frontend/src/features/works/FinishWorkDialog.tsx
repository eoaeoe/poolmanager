import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import {
  IconArrowsVertical,
  IconDroplet,
  IconRipple,
  IconEngine,
} from "@tabler/icons-react";
import { InputTextarea } from "primereact/inputtextarea";
import {
  LEVEL_COLOR_PRESETS,
  WATER_APPEARANCES,
  WATER_LEVELS,
  YES_NO_OPTIONS,
} from "./works.constants";
import type { FinishWorkPayload } from "./works.types";
import { isFinishWorkDisabled } from "./works.utils";
import { LevelColorButtons } from "./LevelColorButtons";

interface FinishWorkDialogProps {
  readonly visible: boolean;
  readonly loading: boolean;
  readonly value: FinishWorkPayload;
  readonly onChange: (value: FinishWorkPayload) => void;
  readonly onHide: () => void;
  readonly onSubmit: () => void;
}

export function FinishWorkDialog({
  visible,
  loading,
  value,
  onChange,
  onHide,
  onSubmit,
}: FinishWorkDialogProps) {
  const disabled = isFinishWorkDisabled(value, loading);

  function updateField<K extends keyof FinishWorkPayload>(
    field: K,
    fieldValue: FinishWorkPayload[K],
  ) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <Dialog
      blockScroll
      id="finish-work-dialog"
      header="Finalizar mantenimiento"
      visible={visible}
      style={{ width: "42rem", maxWidth: "95vw" }}
      modal
      onHide={onHide}
    >
      <div className="flex flex-column gap-3">
        <div className="grid" style={{ marginTop: "15px" }}>
          <div className="col-12 md:col-12">
            <label
              htmlFor="finish-work-ph"
              className="block mb-2"
              style={{ color: "aqua" }}
            >
              PH
            </label>
            {/* <InputNumber
              id="finish-work-ph"
              value={value.ph}
              onValueChange={(e) => updateField("ph", e.value ?? null)}
              minFractionDigits={1}
              maxFractionDigits={2}
              className="w-full"
            /> */}
            <LevelColorButtons
              presets={LEVEL_COLOR_PRESETS.ph}
              selectedValue={value.ph}
              onSelect={(selectedValue) => updateField("ph", selectedValue)}
            />
          </div>

          <div className="col-12 md:col-12">
            <label
              htmlFor="finish-work-free-chlorine"
              className="block mb-2"
              style={{ color: "aqua" }}
            >
              CLORO LIBRE
            </label>
            {/* <InputNumber
              id="finish-work-free-chlorine"
              value={value.freeChlorine}
              onValueChange={(e) =>
                updateField("freeChlorine", e.value ?? null)
              }
              minFractionDigits={1}
              maxFractionDigits={2}
              className="w-full"
            /> */}
            <LevelColorButtons
              presets={LEVEL_COLOR_PRESETS.freeChlorine}
              selectedValue={value.freeChlorine}
              onSelect={(selectedValue) =>
                updateField("freeChlorine", selectedValue)
              }
            />
          </div>

          <div className="col-12 md:col-12">
            <label
              htmlFor="finish-work-total-chlorine"
              className="block mb-2"
              style={{ color: "aqua" }}
            >
              CLORO TOTAL
            </label>
            {/* <InputNumber
              id="finish-work-total-chlorine"
              value={value.totalChlorine}
              onValueChange={(e) =>
                updateField("totalChlorine", e.value ?? null)
              }
              minFractionDigits={1}
              maxFractionDigits={2}
              className="w-full"
            /> */}
            <LevelColorButtons
              presets={LEVEL_COLOR_PRESETS.totalChlorine}
              selectedValue={value.totalChlorine}
              onSelect={(selectedValue) =>
                updateField("totalChlorine", selectedValue)
              }
            />
          </div>

          <div className="col-12 md:col-12">
            <label
              htmlFor="finish-work-alkalinity"
              className="block mb-2"
              style={{ color: "aqua" }}
            >
              ALCALINIDAD
            </label>
            {/* <InputNumber
              id="finish-work-alkalinity"
              value={value.alkalinity}
              onValueChange={(e) => updateField("alkalinity", e.value ?? null)}
              className="w-full"
            /> */}
            <LevelColorButtons
              presets={LEVEL_COLOR_PRESETS.alkalinity}
              selectedValue={value.alkalinity}
              onSelect={(selectedValue) =>
                updateField("alkalinity", selectedValue)
              }
            />
          </div>

          <div className="col-12 md:col-12" style={{ marginTop: "1.5rem" }}>
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <IconRipple size={18} />
              </span>
              <Dropdown
                id="finish-work-water-appearance"
                value={value.waterAppearance}
                options={[...WATER_APPEARANCES]}
                optionLabel="name"
                optionValue="code"
                placeholder="Selecciona estado del agua"
                className="w-full"
                onChange={(e) => updateField("waterAppearance", e.value)}
              />
            </div>
          </div>

          <div className="col-12 md:col-12" style={{ marginTop: "1.5rem" }}>
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <IconArrowsVertical size={18} />
              </span>
              <Dropdown
                id="finish-work-water-level"
                value={value.waterLevel}
                options={[...WATER_LEVELS]}
                optionLabel="name"
                optionValue="code"
                placeholder="Selecciona nivel del agua"
                className="w-full"
                onChange={(e) => updateField("waterLevel", e.value)}
              />
            </div>
          </div>

          <div className="col-12 md:col-12" style={{ marginTop: "1.5rem" }}>
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <IconDroplet size={18} />
              </span>
              <Dropdown
                id="finish-work-water-open"
                value={value.waterOpen}
                options={[...YES_NO_OPTIONS]}
                optionLabel="name"
                optionValue="code"
                placeholder="¿Agua abierta?"
                className="w-full"
                onChange={(e) => updateField("waterOpen", e.value)}
              />
            </div>
          </div>

          <div className="col-12 md:col-12" style={{ marginTop: "1.5rem" }}>
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <IconEngine size={18} />
              </span>
              <Dropdown
                id="finish-work-manual-pump-on"
                value={value.manualPumpOn}
                options={[...YES_NO_OPTIONS]}
                optionLabel="name"
                optionValue="code"
                placeholder="¿Bomba manual encendida?"
                className="w-full"
                onChange={(e) => updateField("manualPumpOn", e.value)}
              />
            </div>
          </div>

          <div className="col-12">
            <label
              htmlFor="finish-work-comment"
              className="block mb-2"
              style={{ color: "aqua", marginTop: "15px" }}
            >
              Observaciones
            </label>
            <InputTextarea
              id="finish-work-comment"
              value={value.comment}
              onChange={(e) => updateField("comment", e.target.value)}
              rows={4}
              autoResize
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-content-end gap-2 mt-3">
          <Button
            label="Cancelar"
            severity="secondary"
            outlined
            onClick={onHide}
            disabled={loading}
          />

          <Button
            label="Guardar y finalizar"
            icon="pi pi-check"
            onClick={onSubmit}
            disabled={disabled}
            loading={loading}
          />
        </div>
      </div>
    </Dialog>
  );
}
