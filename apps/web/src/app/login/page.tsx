import { MirilookAuthPanel } from "@/components/mirilook-auth-panel";
import { MirilookMainNav } from "@/components/mirilook-main-nav";

export const metadata = {
  title: "로그인",
};

export default function LoginPage() {
  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #fff5f8 0%, var(--ml-page, #f7f8fa) 42%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-5 py-4">
        <MirilookMainNav />
      </div>

      <section className="mx-auto w-full max-w-md px-5 pb-20 pt-6 sm:pt-10">
        <MirilookAuthPanel />
      </section>
    </main>
  );
}
