"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const exchangeCode = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );

      if (error) {
        console.error("OAuth error:", error);
      }

      router.replace("/");
    };

    exchangeCode();
  }, [router]);

  return (
    <p style={{ textAlign: "center", marginTop: "100px" }}>
      Logging you in...
    </p>
  );
}