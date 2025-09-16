import { fetchBusinessProfile } from "@/utils/backendAPIs/app";
import { fetchCategories, fetchProducts } from "@/utils/backendAPIs/products";

export const runtime = "edge";

export default async function sitemap() {
  let business = await fetchBusinessProfile();
  if (!business.success) console.log("Sitemap loading error");
  let baseUrl = business.data.url;
  let categories = await fetchCategories();
  categories = categories.data;
  let urls = [];
  urls.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "always",
    priority: 1,
  });
  categories.map((cat) => {
    urls.push({
      url: baseUrl + "/filter/" + encodeURIComponent(cat),
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    });
  });

  let prods = await fetchProducts();
  prods = prods.data;
  prods.map((p) => {
    urls.push({
      url: baseUrl + "/filter/item/" + p._id,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    });
  });

  return urls;
}
