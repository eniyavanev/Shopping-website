// src/hooks/usePageTitle.js
import { useEffect } from "react";

const usePageTitle = (title) => {
  useEffect(() => {
    const baseTitle = "Eniyavan Cart";
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;
  }, [title]);
};

export default usePageTitle;
