import { lazy, Suspense, useEffect, useState } from "react";
import type { BookProps } from "./Book";

/* Book behind a lazy import, for client:visible islands: three.js and
   React Three Fiber are only fetched once the island hydrates near the
   screen, instead of on page load as with client:only. Book reads window
   while rendering, so until then (and on the server) a placeholder holds
   the stage's height: it gives client:visible an element to watch and
   keeps the page from jumping when the viewer arrives. */
const Book = lazy(() => import("./Book"));

export default function LazyBook(props: BookProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const placeholder = <div aria-hidden="true" style={{ minHeight: props.height }} />;
  return mounted ? (
    <Suspense fallback={placeholder}>
      <Book {...props} />
    </Suspense>
  ) : (
    placeholder
  );
}
