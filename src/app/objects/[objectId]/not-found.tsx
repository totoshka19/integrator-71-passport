import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DEMO_OBJECT_ID } from "@/features/passport/data/mock-passports";

export default function ObjectNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4 px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Объект не найден</h1>
      <p className="text-muted-foreground">
        Паспорта с таким идентификатором нет. Возможно, объект удалён или ссылка
        устарела.
      </p>
      <Button asChild>
        <Link href={`/objects/${DEMO_OBJECT_ID}`}>Открыть демонстрационный объект</Link>
      </Button>
    </main>
  );
}
