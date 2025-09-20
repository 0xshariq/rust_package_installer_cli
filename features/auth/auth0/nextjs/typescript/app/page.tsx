import { auth0 } from "@/lib/auth0";
import { Button } from "@/components/button";

export default async function Home() {
  // Fetch the user session
  const session = await auth0.getSession();

  // If no session, show sign-up and login buttons
  if (!session) {
    return (
      <main>
        <a href="/auth/login?screen_hint=signup">
          <Button>Sign up</Button>
        </a>
        <a href="/auth/login">
          <Button>Log in</Button>
        </a>
      </main>
    );
  }

  // If session exists, show a welcome message and logout button
  return (
    <main>
      <h1>Welcome, {session.user.name}!</h1>
      <p>
        <a href="/auth/logout">
          <Button>Log out</Button>
        </a>
      </p>
    </main>
  );
}
