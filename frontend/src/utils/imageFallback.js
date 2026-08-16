export const getCategoryFallbackImage = (category) => {
  const fallbacks = {
    MAMMAL: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/800px-Lion_waiting_in_Namibia.jpg",
    BIRD: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Ara_macao_-plenty-8a.jpg/800px-Ara_macao_-plenty-8a.jpg",
    REPTILE: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Iguana_iguana_1.jpg/800px-Iguana_iguana_1.jpg",
    AMPHIBIAN: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Dendrobates_azureus_01.jpg/800px-Dendrobates_azureus_01.jpg",
    FISH: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Amphiprion_ocellaris_01.jpg/800px-Amphiprion_ocellaris_01.jpg",
    INSECT: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Danaus_plexippus_01.jpg/800px-Danaus_plexippus_01.jpg"
  };
  return fallbacks[category?.toUpperCase()] || "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/800px-Lion_waiting_in_Namibia.jpg";
};

export const handleImageError = (e, category) => {
  e.target.onerror = null;
  e.target.src = getCategoryFallbackImage(category);
};
