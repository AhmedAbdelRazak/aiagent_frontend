/* app/admin/page.js */
import { redirect } from "next/navigation";
export default function AdminRoot() {
	redirect("/admin/overview");
}
