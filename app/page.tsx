import {
  fetchCategories,
  fetchHomePage,
  HomePageResponse,
} from "@/utils/backendAPIs/products";
import { fetchBusinessProfile } from "@/utils/backendAPIs/app";
import { BusinessProfile, ApiResponse, Product } from "@/utils/models";
import { Metadata } from "next";
// import ProductCard from "@/components/ProductCard/ProductCard";
// import ProductSlider from "@/components/ProductSlider/ProductSlider";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const profileResponse: ApiResponse<BusinessProfile> =
    await fetchBusinessProfile();

  if (!profileResponse.success || !profileResponse.data) {
    return {
      title: "Home",
      description: "Welcome to our store",
    };
  }

  const profile = profileResponse.data;

  return {
    title: `${profile.name} - Home`,
    description: `Welcome to ${profile.name}. Discover our amazing products.`,
    openGraph: {
      title: `${profile.name} - Home`,
      description: `Welcome to ${profile.name}. Discover our amazing products.`,
      siteName: profile.name,
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function Home() {
  const homePageResponse: ApiResponse<HomePageResponse> = await fetchHomePage();
  const categoriesResponse: ApiResponse<string[]> = await fetchCategories();
  const profileResponse: ApiResponse<BusinessProfile> =
    await fetchBusinessProfile();

  if (
    !homePageResponse.success ||
    !categoriesResponse.success ||
    !profileResponse.success
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Store</h1>
          <p className="text-gray-600">
            Unable to load store data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const { slider, promoted, latest, ready, active } = homePageResponse.data!;
  const categories = categoriesResponse.data!;
  const profile = profileResponse.data!;

  if (!ready || !active) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {!ready ? "Store Not Ready" : "Store Inactive"}
          </h1>
          <p className="text-gray-600">
            {!ready
              ? "Our store is currently being set up. Please check back soon!"
              : "Our store is currently inactive. Please contact us for more information."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Welcome to {profile.name}
        </h1>

        {/* Featured Products Slider */}
        {slider.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Featured Products
            </h2>
            {/* <ProductSlider products={slider} /> */}
          </section>
        )}

        {/* We think you'll love these */}
        {promoted.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              We think you'll love these
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promoted.map((product, index) => (
                <div key={index}>{product.name}</div>
                // <ProductCard
                //   key={product._id || index}
                //   product={product}
                //   showPrice={profile.showPrice}
                // />
              ))}
            </div>
          </section>
        )}

        {/* Latest Products */}
        {latest.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Latest Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latest.map((product, index) => (
                <div key={index}>{product.name}</div>
                // <ProductCard
                //   key={product._id || index}
                //   product={product}
                //   showPrice={profile.showPrice}
                // />
              ))}
            </div>
          </section>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center cursor-pointer"
                >
                  <h3 className="font-medium text-gray-900">{category}</h3>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
