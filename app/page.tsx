"use client";

import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main style={{ textAlign: "center", marginTop: "100px" }}>
      <button onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </main>
  );
}
