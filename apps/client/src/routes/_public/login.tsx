import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/features/auth/components/login-form";

export const Route = createFileRoute("/_public/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <LoginForm/>
    </div>
  );
}
