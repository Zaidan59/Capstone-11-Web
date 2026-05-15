export function getResponseArray(payload) {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
}

export function toCoordinate(value) {
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : null;
}

export function getLatLng(item) {
  return [item.lat, item.lng];
}

export function buildLinks(kitchens, schools) {
  const kitchensById = new Map(kitchens.map((kitchen) => [kitchen.id, kitchen]));

  return schools
    .map((school) => {
      const kitchen = kitchensById.get(school.sppgId);
      if (!kitchen) return null;

      return {
        kitchenId: kitchen.id,
        schoolId: school.id,
        from: getLatLng(kitchen),
        to: getLatLng(school),
      };
    })
    .filter(Boolean);
}
