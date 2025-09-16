import { fetchBusinessProfile } from "@/utils/backendAPIs/app";

export const runtime = "edge";

export default async function robots() {
  let profile = await fetchBusinessProfile();
  let url = profile.data.url;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    },
    sitemap: url + "/sitemap.xml",
  };
}
