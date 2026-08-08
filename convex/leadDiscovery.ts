"use node";

import { ConvexError, v } from "convex/values";
import { action } from "./_generated/server";

const fallbackPlaces = [
  { placeId: "demo-dental", name: "Northstar Dental Care", category: "dental clinic", rating: 4.8, reviewsCount: 126, address: "Islamabad, Pakistan", phone: "+92 51 111 2222", website: "https://example.com/dental", mapsUrl: "https://maps.google.com/?q=Northstar+Dental+Care", isDuplicate: false },
  { placeId: "demo-bistro", name: "Metro Bistro", category: "restaurant", rating: 4.6, reviewsCount: 89, address: "Lahore, Pakistan", phone: "+92 42 333 4444", website: "https://example.com/bistro", mapsUrl: "https://maps.google.com/?q=Metro+Bistro", isDuplicate: false },
  { placeId: "demo-gym", name: "Brightline Gym", category: "gym", rating: 4.4, reviewsCount: 73, address: "Karachi, Pakistan", phone: "+92 21 555 6666", website: "https://example.com/gym", mapsUrl: "https://maps.google.com/?q=Brightline+Gym", isDuplicate: false },
];

const resultValue = v.object({ placeId: v.string(), name: v.string(), category: v.string(), rating: v.optional(v.number()), reviewsCount: v.number(), address: v.optional(v.string()), phone: v.optional(v.string()), website: v.optional(v.string()), mapsUrl: v.optional(v.string()), isDuplicate: v.boolean() });
const suggestionValue = v.object({ description: v.string(), placeId: v.string() });

async function requireIdentity(ctx: any) {
  if (!(await ctx.auth.getUserIdentity())) throw new ConvexError("Unauthenticated");
}

export const search = action({
  args: { query: v.optional(v.string()), category: v.optional(v.string()), location: v.optional(v.string()) },
  returns: v.array(resultValue),
  handler: async (ctx, args) => {
    await requireIdentity(ctx);
    const textQuery = [args.query, args.category, args.location].filter(Boolean).join(" ").trim();
    if (!textQuery) throw new ConvexError("Provide a search query or category.");
    const key = process.env.GOOGLE_MAPS_API_KEY;
    if (!key) return fallbackPlaces.filter((place) => `${place.name} ${place.category}`.toLowerCase().includes(textQuery.toLowerCase())).slice(0, 6);
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key, "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.types,places.googleMapsUri" },
      body: JSON.stringify({ textQuery }),
    });
    if (!response.ok) throw new ConvexError("Google Places search failed.");
    const data = await response.json() as any;
    return (data.places ?? []).map((place: any) => ({ placeId: place.id, name: place.displayName?.text ?? "Unnamed business", category: place.types?.[0]?.replaceAll("_", " ") ?? "Business", rating: place.rating, reviewsCount: place.userRatingCount ?? 0, address: place.formattedAddress, phone: place.nationalPhoneNumber ?? place.internationalPhoneNumber, website: place.websiteUri, mapsUrl: place.googleMapsUri, isDuplicate: false }));
  },
});

export const suggest = action({
  args: { input: v.string() },
  returns: v.array(suggestionValue),
  handler: async (ctx, { input }) => {
    await requireIdentity(ctx);
    if (input.trim().length < 2) return [];
    const key = process.env.GOOGLE_MAPS_API_KEY;
    if (!key) return fallbackPlaces.filter((place) => place.name.toLowerCase().includes(input.toLowerCase())).map((place) => ({ description: place.name, placeId: place.placeId })).slice(0, 5);
    const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", { method: "POST", headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key }, body: JSON.stringify({ input }) });
    if (!response.ok) return [];
    const data = await response.json() as any;
    return (data.suggestions ?? []).filter((item: any) => item.placePrediction).map((item: any) => ({ description: item.placePrediction.text.text, placeId: item.placePrediction.placeId }));
  },
});
