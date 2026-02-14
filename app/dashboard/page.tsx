"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Bookmark = {
  id: string;
  url: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // 🔐 auth check
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/");
      } else {
        setLoading(false);
        fetchBookmarks();
      }
    });
  }, []);

  // 📥 fetch bookmarks
  const fetchBookmarks = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  // ➕ add bookmark
  const addBookmark = async () => {
    if (!url) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("bookmarks").insert({
      url,
      user_id: user.id,
    });

    setUrl("");
    fetchBookmarks();
  };

  // ❌ delete bookmark
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    fetchBookmarks();
  };

  // 🚪 logout
  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main style={{ padding: "30px" }}>
      <h1>Welcome 👋</h1>

      <button onClick={logout}>Logout</button>

      <div style={{ marginTop: "20px" }}>
        <input
          placeholder="Paste bookmark URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={addBookmark}>Add Bookmark</button>
      </div>

      <ul style={{ marginTop: "20px" }}>
        {bookmarks.length === 0 && <p>No bookmarks yet</p>}

        {bookmarks.map((b) => (
          <li key={b.id}>
            <a href={b.url} target="_blank">
              {b.url}
            </a>

            <button
              onClick={() => deleteBookmark(b.id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
