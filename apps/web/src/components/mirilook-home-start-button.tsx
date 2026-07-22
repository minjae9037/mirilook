"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type MirilookHomeStartButtonProps = {
  variant?: "primary" | "secondary";
};

export function MirilookHomeStartButton({
  variant = "primary",
}: MirilookHomeStartButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const secondary = variant === "secondary";

  async function handleStart() {
    if (isPending) return;

    setIsPending(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
      router.push(data.user ? "/studio/gender/" : "/login/");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      className={secondary ? "ml-home-secondary-button" : "ml-home-primary-button"}
      disabled={isPending}
      onClick={() => void handleStart()}
      type="button"
    >
      {isPending ? (
        <Loader2 aria-hidden="true" className="animate-spin" size={secondary ? 18 : 17} />
      ) : (
        <Heart aria-hidden="true" fill="currentColor" size={secondary ? 18 : 17} />
      )}
      사진 올리고 시작하기
    </button>
  );
}
