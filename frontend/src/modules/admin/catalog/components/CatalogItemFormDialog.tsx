import AddIcon from "@mui/icons-material/Add";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputAdornment from "@mui/material/InputAdornment";
import { FormWrapper } from "../../../../components/formWrapper/FormWrapper";
import SysInput from "../../../../components/sysInput/SysInput";
import type { CatalogItemData } from "../../services/catalog.service";
import {
  catalogItemSchema,
  type CatalogItemFormData,
  type CatalogItemFormInput,
} from "../catalogSchema";
import Styles from "../Catalog.styles";

interface CatalogItemFormDialogProps {
  item: CatalogItemData | null;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (data: CatalogItemFormData) => Promise<void>;
}

const getDefaultValues = (
  item: CatalogItemData | null,
): CatalogItemFormInput => ({
  name: item?.name ?? "",
  description: item?.description ?? "",
  price: item?.price ?? 0,
  durationMinutes: item?.durationMinutes ?? 30,
});

const CatalogItemFormDialog = ({
  item,
  isSaving,
  onClose,
  onSubmit,
}: CatalogItemFormDialogProps) => (
  <Dialog
    open
    fullWidth
    maxWidth="sm"
    onClose={() => {
      if (!isSaving) onClose();
    }}
  >
    <FormWrapper<CatalogItemFormInput, CatalogItemFormData>
      schema={catalogItemSchema}
      defaultValues={getDefaultValues(item)}
      onSubmit={onSubmit}
      mode="onChange"
    >
      {({ register, formState: { errors, isSubmitting } }) => (
        <>
          <DialogTitle>{item ? "Editar serviço" : "Novo serviço"}</DialogTitle>

          <DialogContent dividers>
            <Styles.FormFields>
              <SysInput
                registration={register("name")}
                errorMessage={errors.name?.message}
                label="Nome do serviço"
                placeholder="Ex.: Corte Clássico / Degradê"
                autoComplete="off"
                autoFocus
                required
                fullWidth
                disabled={isSaving}
                slotProps={{ htmlInput: { maxLength: 100 } }}
              />

              <SysInput
                registration={register("description")}
                errorMessage={errors.description?.message}
                label="Descrição"
                placeholder="Explique o que está incluído no serviço"
                multiline
                minRows={3}
                fullWidth
                disabled={isSaving}
                slotProps={{ htmlInput: { maxLength: 500 } }}
              />

              <Styles.NumericFields>
                <SysInput
                  registration={register("price", { valueAsNumber: true })}
                  errorMessage={errors.price?.message}
                  label="Preço"
                  type="number"
                  required
                  fullWidth
                  disabled={isSaving}
                  slotProps={{
                    htmlInput: { min: 0, step: 0.01, inputMode: "decimal" },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    },
                  }}
                />

                <SysInput
                  registration={register("durationMinutes", {
                    valueAsNumber: true,
                  })}
                  errorMessage={errors.durationMinutes?.message}
                  label="Duração (minutos)"
                  type="number"
                  required
                  fullWidth
                  disabled={isSaving}
                  slotProps={{
                    htmlInput: { min: 1, max: 1440, step: 1 },
                  }}
                />
              </Styles.NumericFields>
            </Styles.FormFields>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={onClose} disabled={isSaving || isSubmitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSaving || isSubmitting}
              startIcon={
                isSaving || isSubmitting ? (
                  <CircularProgress color="inherit" size={18} />
                ) : item ? (
                  <SaveOutlinedIcon />
                ) : (
                  <AddIcon />
                )
              }
            >
              {item ? "Salvar alterações" : "Cadastrar serviço"}
            </Button>
          </DialogActions>
        </>
      )}
    </FormWrapper>
  </Dialog>
);

export default CatalogItemFormDialog;
