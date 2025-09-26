"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Landing from "./landing/page";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        router.push("/chat");
      } else {
        router.push("/landing");
      }
    };

    checkUser();
  }, [router]);

  return <div>Loading...</div>;
}
