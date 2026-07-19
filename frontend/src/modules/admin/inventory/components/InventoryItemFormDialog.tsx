import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Controller } from "react-hook-form";
import { FormWrapper } from "../../../../components/formWrapper/FormWrapper";
import SysInput from "../../../../components/sysInput/SysInput";
import type { InventoryItemData } from "../../services/inventory.service";
import {
  inventoryCategories,
  inventoryCategoryLabels,
} from "../inventory.constants";
import {
  inventoryItemSchema,
  type InventoryItemFormData,
} from "../inventorySchema";
import Styles from "../Inventory.styles";

interface InventoryItemFormDialogProps {
  item: InventoryItemData | null;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (data: InventoryItemFormData) => Promise<void>;
}

const getDefaultValues = (
  item: InventoryItemData | null,
): InventoryItemFormData => ({
  name: item?.name ?? "",
  category: item?.category ?? "DESCARTAVEIS",
  minRecommended: item?.minRecommended ?? 0,
  quantity: item?.quantity ?? 0,
});

const InventoryItemFormDialog = ({
  item,
  isSaving,
  onClose,
  onSubmit,
}: InventoryItemFormDialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open
      fullWidth
      fullScreen={fullScreen}
      maxWidth="sm"
      aria-labelledby="inventory-form-title"
      onClose={() => {
        if (!isSaving) onClose();
      }}
    >
      <FormWrapper<InventoryItemFormData>
        schema={inventoryItemSchema}
        defaultValues={getDefaultValues(item)}
        onSubmit={onSubmit}
        mode="onChange"
      >
        {({ control, register, formState: { errors, isSubmitting } }) => {
          const disabled = isSaving || isSubmitting;

          return (
            <>
              <Styles.DialogTitleRow>
                <DialogTitle id="inventory-form-title">
                  {item ? "Editar item" : "Novo item"}
                </DialogTitle>
                <Tooltip title="Fechar">
                  <span>
                    <IconButton
                      aria-label="Fechar formulário de item"
                      disabled={disabled}
                      onClick={onClose}
                    >
                      <CloseIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Styles.DialogTitleRow>

              <DialogContent dividers>
                <Styles.FormFields>
                  <SysInput
                    registration={register("name")}
                    errorMessage={errors.name?.message}
                    label="Nome"
                    placeholder="Ex.: Pomada Modeladora"
                    autoComplete="off"
                    autoFocus
                    required
                    fullWidth
                    disabled={disabled}
                    slotProps={{ htmlInput: { maxLength: 100 } }}
                  />

                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.category)}>
                        <InputLabel id="inventory-category-label">
                          Categoria
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="inventory-category-label"
                          label="Categoria"
                          disabled={disabled}
                        >
                          {inventoryCategories.map((category) => (
                            <MenuItem key={category} value={category}>
                              {inventoryCategoryLabels[category]}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {errors.category?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />

                  <Styles.NumericFields>
                    <SysInput
                      registration={register("minRecommended", {
                        valueAsNumber: true,
                      })}
                      errorMessage={errors.minRecommended?.message}
                      label="Mínimo recomendado"
                      type="number"
                      required
                      fullWidth
                      disabled={disabled}
                      slotProps={{
                        htmlInput: { min: 0, max: 1_000_000, step: 1 },
                      }}
                    />
                    <SysInput
                      registration={register("quantity", {
                        valueAsNumber: true,
                      })}
                      errorMessage={errors.quantity?.message}
                      label="Quantidade atual"
                      type="number"
                      required
                      fullWidth
                      disabled={disabled}
                      slotProps={{
                        htmlInput: { min: 0, max: 1_000_000, step: 1 },
                      }}
                    />
                  </Styles.NumericFields>
                </Styles.FormFields>
              </DialogContent>

              <DialogActions sx={{ px: 2, py: 1.5 }}>
                <Tooltip title={item ? "Salvar alterações" : "Cadastrar item"}>
                  <span>
                    <IconButton
                      type="submit"
                      color="primary"
                      aria-label={item ? "Salvar alterações" : "Cadastrar item"}
                      disabled={disabled}
                    >
                      {disabled ? (
                        <CircularProgress color="inherit" size={22} />
                      ) : item ? (
                        <SaveOutlinedIcon />
                      ) : (
                        <AddIcon />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              </DialogActions>
            </>
          );
        }}
      </FormWrapper>
    </Dialog>
  );
};

export default InventoryItemFormDialog;
