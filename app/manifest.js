import { fetchBusinessProfile } from "@/utils/backendAPIs/app";

export const runtime = "edge";

export default async function manifest() {
  let profile = await fetchBusinessProfile();
  profile = profile.data;
  return {
    name: profile.name,
    short_name: profile.name,
    description: profile.about,
    start_url: "/",
    display: "standalone",
    background_color: "#202020",
    theme_color: "#202020",
    icons: [
      {
        src: profile.icon ? profile.icon : "/shop.png",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
