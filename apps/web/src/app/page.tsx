export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-sans text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          <span style={{ color: 'var(--color-ff-primary)' }}>Flash</span>
          <span style={{ color: 'var(--color-ff-secondary)' }}>Fusion</span>
        </h1>
        <p className="text-center text-lg mb-4">
          Core Architecture Powered by Next.js 15
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-2">✅ Monorepo</h2>
            <p className="text-sm text-gray-600">Turborepo + PNPM</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-2">✅ Backend</h2>
            <p className="text-sm text-gray-600">Supabase</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-2">✅ Observability</h2>
            <p className="text-sm text-gray-600">Sentry + PostHog</p>
          </div>
        </div>
      </div>
    </main>
  );
}
