import { redirect } from "next/navigation";
import { DEMO_OBJECT_ID } from "@/features/passport/data/mock-passports";

export default function HomePage() {
  redirect(`/objects/${DEMO_OBJECT_ID}`);
}
