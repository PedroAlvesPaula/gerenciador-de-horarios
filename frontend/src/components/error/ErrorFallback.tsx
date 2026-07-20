import { type FallbackProps } from "react-error-boundary";

export function ErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Ops! Algo deu errado.</h2>
      <p>Ocorreu um erro inesperado.</p>
      <p>Nossa equipe técnica já foi avisada. Tente recarregar a página.</p>
      <button onClick={resetErrorBoundary}>Tentar novamente</button>
    </div>
  );
}
