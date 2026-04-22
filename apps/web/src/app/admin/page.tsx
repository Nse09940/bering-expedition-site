import { redirect } from "next/navigation";

export default function AdminPage() {
  redirect("http://localhost:8000/admin/");
}
