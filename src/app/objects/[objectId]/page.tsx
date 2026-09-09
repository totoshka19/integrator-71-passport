import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPassportById,
  listObjectIds,
} from "@/features/passport/data/mock-passports";
import { MainTab } from "@/features/passport/ui/main-tab";
import { ObjectHeader } from "@/features/passport/ui/object-header";
import { PassportWorkspace } from "@/features/passport/ui/passport-workspace";

export function generateStaticParams() {
  return listObjectIds().map((objectId) => ({ objectId }));
}

export async function generateMetadata({
  params,
}: PageProps<"/objects/[objectId]">): Promise<Metadata> {
  const { objectId } = await params;
  const passport = getPassportById(objectId);
  return { title: passport?.name ?? "Объект не найден" };
}

export default async function ObjectPassportPage({
  params,
}: PageProps<"/objects/[objectId]">) {
  const { objectId } = await params;
  const passport = getPassportById(objectId);
  if (passport === undefined) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:py-10">
      <ObjectHeader passport={passport} />
      <PassportWorkspace
        initial={{ stages: passport.stages, estimate: passport.estimate }}
        mainTab={<MainTab passport={passport} />}
      />
    </main>
  );
}
