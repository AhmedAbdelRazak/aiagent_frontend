/* app/admin/page.js */
import { redirect } from "next/navigation";
export default function UserRoot() {
	redirect("/dashboard/overview");
}
