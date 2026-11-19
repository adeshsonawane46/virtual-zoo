import animalImageMap from "./animalImageMap.json";

export { animalImageMap };

export const categoryFallbacks = {
  MAMMAL: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80",
  BIRD: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1200&q=80",
  REPTILE: "https://images.unsplash.com/photo-1563281577-a7be47e20db9?auto=format&fit=crop&w=1200&q=80",
  AMPHIBIAN: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1200&q=80",
  FISH: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1200&q=80",
  INSECT: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80"
};

export const getSvgFallback = (category = "WILDLIFE") => {
  const emojiMap = {
    MAMMAL: "🦁",
    BIRD: "🦅",
    REPTILE: "🦎",
    AMPHIBIAN: "🐸",
    FISH: "🐠",
    INSECT: "🦋"
  };
  const catUpper = (category || "WILDLIFE").toUpperCase();
  const emoji = emojiMap[catUpper] || "🐾";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="50%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)"/>
    <circle cx="400" cy="220" r="100" fill="rgba(245, 158, 11, 0.1)"/>
    <text x="50%" y="46%" text-anchor="middle" font-size="96" dominant-baseline="middle">${emoji}</text>
    <text x="50%" y="74%" text-anchor="middle" font-size="26" font-family="system-ui, -apple-system, sans-serif" font-weight="800" fill="#f59e0b" letter-spacing="4">${catUpper}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const getCategoryFallbackImage = (category) => {
  const cat = category?.toUpperCase();
  return categoryFallbacks[cat] || categoryFallbacks.MAMMAL;
};

/**
 * Returns a verified, accurate photo for an animal using id or name mapping.
 */
export const getVerifiedAnimalImage = (animal) => {
  if (!animal) return null;
  if (typeof animal === "string") {
    if (animalImageMap[animal]) return animalImageMap[animal];
    return animal;
  }
  if (animal.id && animalImageMap[animal.id]) {
    return animalImageMap[animal.id];
  }
  if (animal.name && animalImageMap[animal.name]) {
    return animalImageMap[animal.name];
  }
  return animal.image || null;
};

/**
 * Normalizes animal image URLs to ensure crisp loading and avoid 400/404 errors.
 * Accepts either an animal object { id, name, image, category } or a URL string.
 */
export const formatAnimalImageUrl = (animalOrUrl, category) => {
  let targetUrl = null;
  if (animalOrUrl && typeof animalOrUrl === "object") {
    targetUrl = getVerifiedAnimalImage(animalOrUrl);
  } else if (typeof animalOrUrl === "string") {
    targetUrl = animalImageMap[animalOrUrl] || animalOrUrl;
  }

  if (!targetUrl || typeof targetUrl !== "string") {
    return getCategoryFallbackImage(category);
  }

  let formatted = targetUrl.trim();

  // Fix Wikimedia non-standard thumbnail sizes (convert 800px -> 960px)
  if (formatted.includes("upload.wikimedia.org") || formatted.includes("thumb.wikimedia.org")) {
    formatted = formatted.replace("thumb.wikimedia.org", "upload.wikimedia.org");
    if (formatted.includes("/800px-")) {
      formatted = formatted.replace(/\/800px-/g, "/960px-");
    }
    if (formatted.includes("GrizzlyBearKabini.jpg")) {
      formatted = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/GrizzlyBearJeanBeaufort.jpg/960px-GrizzlyBearJeanBeaufort.jpg";
    }
  }

  return formatted;
};

/**
 * Handles image load errors gracefully with multi-tier fallback:
 * Tier 1: Try the verified unique image from map (if not already tried).
 * Tier 2: Try the category-specific high-res Unsplash image.
 * Tier 3: Try the inline SVG category banner (guaranteed offline/local).
 */
export const handleImageError = (e, category, animal) => {
  const img = e.currentTarget || e.target;
  const currentAttempt = parseInt(img.dataset.fallbackAttempt || "0", 10);

  if (currentAttempt === 0 && animal) {
    img.dataset.fallbackAttempt = "1";
    const verified = getVerifiedAnimalImage(animal);
    if (verified && verified !== img.src) {
      img.referrerPolicy = "no-referrer";
      img.src = verified;
      return;
    }
  }

  if (currentAttempt <= 1) {
    img.dataset.fallbackAttempt = "2";
    img.referrerPolicy = "no-referrer";
    img.src = getCategoryFallbackImage(category);
  } else if (currentAttempt === 2) {
    img.dataset.fallbackAttempt = "3";
    img.src = getSvgFallback(category);
  } else {
    img.onerror = null;
  }
};
