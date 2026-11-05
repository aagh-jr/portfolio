import { lazy, Suspense, useEffect, useState } from "react";

/* EcoWebCards behind a lazy import; see LazyBook. The empty placeholder
   is what client:visible watches. */
const EcoWebCards = lazy(() => import("./EcoWebCards"));

export default function LazyEcoWebCards() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const placeholder = <div aria-hidden="true" />;
  return mounted ? (
    <Suspense fallback={placeholder}>
      <EcoWebCards />
    </Suspense>
  ) : (
    placeholder
  );
}
