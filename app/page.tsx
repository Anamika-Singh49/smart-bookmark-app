"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard",
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
