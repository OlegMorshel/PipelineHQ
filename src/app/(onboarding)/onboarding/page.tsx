export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto w-full max-w-[600px] space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Настройка стратегии
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Расскажите о себе, чтобы мы создали вашу стратегию
          </p>
        </div>
      </div>
    </div>
  );
}
