// app/signin/page.tsx
import { Suspense } from "react";
import SignInClient from "./SignInClient";

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="p-6 sm:p-10 text-sm text-neutral-500">Loading…</div>}>
      <SignInClient />
    </Suspense>
  );
}
