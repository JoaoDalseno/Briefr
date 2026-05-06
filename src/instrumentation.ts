// Hook do Next.js 14 para inicializar SDKs de observabilidade no servidor.
// Este arquivo é chamado uma vez na inicialização do servidor, antes
// de qualquer request ser processado.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config')
  }
}
