import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import SysInput from "../../../../../components/sysInput/SysInput";
import { FormWrapper } from "../../../../../components/formWrapper/FormWrapper";
import type { AddressData } from "../../../services/addresses.service";
import {
  addressSchema,
  type AddressFormData,
  type AddressFormInput,
} from "../addressSchema";
import Styles from "../Addresses.styles";

interface AddressFormDialogProps {
  address: AddressData | null;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (data: AddressFormData) => Promise<void>;
}

const getDefaultValues = (address: AddressData | null): AddressFormInput => ({
  street: address?.street ?? "",
  number: address?.number ?? "",
  complement: address?.complement ?? "",
  neighborhood: address?.neighborhood ?? "",
  city: address?.city ?? "",
  state: address?.state ?? "",
  zipCode: address?.zipCode ?? "",
});

const AddressFormDialog = ({
  address,
  isSaving,
  onClose,
  onSubmit,
}: AddressFormDialogProps) => (
  <Dialog
    open
    fullWidth
    maxWidth="sm"
    onClose={() => {
      if (!isSaving) onClose();
    }}
  >
    <FormWrapper<AddressFormInput, AddressFormData>
      schema={addressSchema}
      defaultValues={getDefaultValues(address)}
      onSubmit={onSubmit}
      mode="onChange"
    >
      {({ register, formState: { errors, isSubmitting } }) => (
        <>
          <DialogTitle>
            {address ? "Editar endereço" : "Novo endereço"}
          </DialogTitle>

          <DialogContent dividers>
            <Styles.FormFields>
              <SysInput
                registration={register("street")}
                errorMessage={errors.street?.message}
                label="Rua ou avenida"
                autoComplete="address-line1"
                required
                fullWidth
                autoFocus
                disabled={isSaving}
                slotProps={{ htmlInput: { maxLength: 120 } }}
              />

              <Styles.ShortFields>
                <SysInput
                  registration={register("number")}
                  errorMessage={errors.number?.message}
                  label="Número"
                  autoComplete="address-line2"
                  required
                  fullWidth
                  disabled={isSaving}
                  slotProps={{ htmlInput: { maxLength: 20 } }}
                />
                <SysInput
                  registration={register("complement")}
                  errorMessage={errors.complement?.message}
                  label="Complemento"
                  placeholder="Apto., bloco..."
                  fullWidth
                  disabled={isSaving}
                  slotProps={{ htmlInput: { maxLength: 100 } }}
                />
              </Styles.ShortFields>

              <SysInput
                registration={register("neighborhood")}
                errorMessage={errors.neighborhood?.message}
                label="Bairro"
                required
                fullWidth
                disabled={isSaving}
                slotProps={{ htmlInput: { maxLength: 80 } }}
              />

              <Styles.ShortFields>
                <SysInput
                  registration={register("city")}
                  errorMessage={errors.city?.message}
                  label="Cidade"
                  autoComplete="address-level2"
                  required
                  fullWidth
                  disabled={isSaving}
                  slotProps={{ htmlInput: { maxLength: 80 } }}
                />
                <SysInput
                  registration={register("state")}
                  errorMessage={errors.state?.message}
                  label="Estado (UF)"
                  autoComplete="address-level1"
                  required
                  fullWidth
                  disabled={isSaving}
                  slotProps={{ htmlInput: { maxLength: 2 } }}
                />
              </Styles.ShortFields>

              <SysInput
                registration={register("zipCode")}
                errorMessage={errors.zipCode?.message}
                label="CEP"
                placeholder="00000-000"
                autoComplete="postal-code"
                fullWidth
                disabled={isSaving}
                slotProps={{ htmlInput: { maxLength: 9, inputMode: "numeric" } }}
              />
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
                ) : undefined
              }
            >
              {address ? "Salvar alterações" : "Cadastrar endereço"}
            </Button>
          </DialogActions>
        </>
      )}
    </FormWrapper>
  </Dialog>
);

export default AddressFormDialog;
