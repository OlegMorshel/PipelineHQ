import { Button } from "@/components/ui/button";
import { AtSign } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto flex w-full max-w-[360px] flex-col items-center space-y-8">
        {/* Logo */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">PipelineHQ</h1>
          <p className="text-sm text-muted-foreground">
            Превращаем Threads
            <br />в систему продаж
          </p>
        </div>

        {/* Login Button */}
        <Button className="w-full h-12 rounded-xl text-[15px] font-semibold gap-2">
          <AtSign className="h-4 w-4" />
          Войти через Threads
        </Button>

        {/* Info link */}
        <Button
          variant="ghost"
          className="text-muted-foreground text-sm"
        >
          Что это? Узнать →
        </Button>
      </div>
    </div>
  );
}
