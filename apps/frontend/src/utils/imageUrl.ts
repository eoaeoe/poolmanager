const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "";

export function getImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return null;

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `${API_ORIGIN}${imageUrl}`;
}
