import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function SignOutButton({
  className,
  label = "Sign out",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="outline" size="sm" className={className}>
        {label}
      </Button>
    </form>
  );
}
