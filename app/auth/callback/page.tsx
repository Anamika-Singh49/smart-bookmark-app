"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth error:", error);
      }

      // login ke baad jahan bhejna ho
      router.replace("/");
    };

    handleCallback();
  }, [router]);

  return <p style={{ textAlign: "center", marginTop: "100px" }}>Signing you in...</p>;
}