import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // try again on next frame after route renders
        requestAnimationFrame(() => {
          const el2 = document.getElementById(id);
          if (el2) el2.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }
  }, [pathname, hash]);

  return null;
}
