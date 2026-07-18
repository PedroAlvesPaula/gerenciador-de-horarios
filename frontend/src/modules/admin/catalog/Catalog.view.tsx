import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SysInput from "../../../components/sysInput/SysInput";
import { FormWrapper } from "../../../components/formWrapper/FormWrapper";
import { useCatalog } from "./Catalog.context";
import {
  catalogItemSchema,
  type CatalogItemFormData,
  type CatalogItemFormInput,
} from "./catalogSchema";
import Styles from "./Catalog.styles";

const catalogDefaultValues: CatalogItemFormInput = {
  name: "",
  description: "",
  price: 0,
  durationMinutes: 30,
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const CatalogView = () => {
  const {
    catalogItems,
    isLoading,
    isCreating,
    errorMessage,
    formVersion,
    createService,
    reloadCatalog,
  } = useCatalog();

  return (
    <Styles.PageWrapper>
      <Box>
        <Styles.PageTitle variant="h4" component="h1">
          Serviços
        </Styles.PageTitle>
        <Typography color="text.secondary">
          Cadastre os serviços que serão exibidos para os clientes e usados no
          cálculo da agenda.
        </Typography>
      </Box>

      <Styles.ContentGrid>
        <Styles.FormCard>
          <Typography variant="h6" component="h2" fontWeight={700}>
            Novo serviço
          </Typography>

          <FormWrapper<CatalogItemFormInput, CatalogItemFormData>
            key={formVersion}
            schema={catalogItemSchema}
            defaultValues={catalogDefaultValues}
            onSubmit={createService}
            mode="onChange"
          >
            {({ register, formState: { errors, isSubmitting } }) => (
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
                  disabled={isCreating}
                />

                <SysInput
                  registration={register("description")}
                  errorMessage={errors.description?.message}
                  label="Descrição"
                  placeholder="Explique o que está incluído no serviço"
                  multiline
                  minRows={3}
                  fullWidth
                  disabled={isCreating}
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
                    disabled={isCreating}
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
                    disabled={isCreating}
                    slotProps={{
                      htmlInput: { min: 1, max: 1440, step: 1 },
                    }}
                  />
                </Styles.NumericFields>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={
                    isCreating || isSubmitting ? (
                      <CircularProgress color="inherit" size={18} />
                    ) : (
                      <AddIcon />
                    )
                  }
                  disabled={isCreating || isSubmitting}
                >
                  Cadastrar serviço
                </Button>
              </Styles.FormFields>
            )}
          </FormWrapper>
        </Styles.FormCard>

        <Box component="section" aria-labelledby="catalog-list-title">
          <Styles.ListHeader>
            <Typography id="catalog-list-title" variant="h6" fontWeight={700}>
              Serviços cadastrados
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {catalogItems.length} item(ns)
            </Typography>
          </Styles.ListHeader>

          {isLoading && (
            <Styles.CenteredState>
              <CircularProgress />
            </Styles.CenteredState>
          )}

          {errorMessage && (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={reloadCatalog}>
                  Tentar novamente
                </Button>
              }
            >
              {errorMessage}
            </Alert>
          )}

          {!isLoading && !errorMessage && catalogItems.length === 0 && (
            <Alert severity="info">Nenhum serviço cadastrado.</Alert>
          )}

          {!isLoading && !errorMessage && catalogItems.length > 0 && (
            <Styles.CatalogList>
              {catalogItems.map((item) => (
                <Styles.ServiceCard key={item.id}>
                  <Box>
                    <Typography variant="h6" component="h3">
                      {item.name}
                    </Typography>
                    {item.description && (
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    )}
                  </Box>

                  <Styles.ServiceMeta>
                    <Styles.Duration>
                      <AccessTimeIcon fontSize="small" />
                      {item.durationMinutes} minutos
                    </Styles.Duration>
                    <Typography fontWeight={700} color="secondary.main">
                      {currencyFormatter.format(item.price)}
                    </Typography>
                  </Styles.ServiceMeta>
                </Styles.ServiceCard>
              ))}
            </Styles.CatalogList>
          )}
        </Box>
      </Styles.ContentGrid>
    </Styles.PageWrapper>
  );
};

export default CatalogView;
