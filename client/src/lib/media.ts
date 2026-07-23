export const resolveMediaUrl = (url?: string | null): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  if (url.startsWith("uploads/")) {
    return `${apiBase}/${url}`;
  }

  if (url.startsWith("/uploads/")) {
    return `${apiBase}${url}`;
  }

  return url.startsWith("/") ? url : `/${url}`;
};
