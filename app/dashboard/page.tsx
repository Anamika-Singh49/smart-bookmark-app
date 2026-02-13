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

  const [user, setUser] = useState<any>(null);
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Check login + load bookmarks
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/");
        return;
      }

      setUser(data.user);
      await fetchBookmarks(data.user.id);
      setLoading(false);
    };

    init();
  }, [router]);

  // ✅ Fetch bookmarks
  const fetchBookmarks = async (userId: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("id, url")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  // ✅ Add bookmark
  const addBookmark = async () => {
    if (!url.trim()) return;

    await supabase.from("bookmarks").insert({
      url,
      user_id: user.id,
    });

    setUrl("");
    fetchBookmarks(user.id);
  };

  // ✅ Delete bookmark
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    fetchBookmarks(user.id);
  };

  // ✅ Logout
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main style={{ padding: "20px" }}>
      <h2>Welcome 👋</h2>

      <button onClick={logout}>Logout</button>

      <br /><br />

      {/* Add bookmark */}
      <input
        type="text"
        placeholder="Paste bookmark URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={addBookmark}>Add Bookmark</button>

      <br /><br />

      {/* Bookmark list */}
      {bookmarks.length === 0 ? (
        <p>No bookmarks yet</p>
      ) : (
        <ul>
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id}>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {bookmark.url}
              </a>

              <button
                style={{ marginLeft: "10px" }}
                onClick={() => deleteBookmark(bookmark.id)}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
