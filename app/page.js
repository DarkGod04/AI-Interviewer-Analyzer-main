import { redirect } from "next/navigation";

export default function Home() {
  // Immediately redirect from root (/) to the dashboard
  // If not authenticated, the app's routing/provider logic will handle kicking them to /auth
  redirect('/dashboard');
}
