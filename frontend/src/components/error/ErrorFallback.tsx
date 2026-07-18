import { getErrorMessage, type FallbackProps } from "react-error-boundary";

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Ops! Algo deu errado.</h2>
      <p>{getErrorMessage(error) ?? "Ocorreu um erro inesperado."}</p>
      <p>Nossa equipe técnica já foi avisada. Tente recarregar a página.</p>
      <button onClick={resetErrorBoundary}>Tentar novamente</button>
    </div>
  );
}
