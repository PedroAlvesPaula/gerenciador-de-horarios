export function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Ops! Algo deu errado.</h2>
      <p>{error.reason}</p>
      <p>Nossa equipe técnica já foi avisada. Tente recarregar a página.</p>
      <button onClick={resetErrorBoundary}>Tentar novamente</button>
    </div>
  );
}
