import { Metadata } from "next";
import { fetchBusinessProfile } from "@/utils/backendAPIs/app";
import OrdersClient from "./OrdersClient";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const profileResponse = await fetchBusinessProfile();
    const profile = profileResponse.data;

    if (!profile) {
      return {
        title: "My Orders",
        description: "View your order history and track your purchases.",
      };
    }

    return {
      title: `My Orders - ${profile.name}`,
      description: `View your order history and track your purchases at ${profile.name}.`,
      keywords: [
        "orders",
        "order history",
        "purchases",
        "track orders",
        profile.name,
      ],
      openGraph: {
        title: `My Orders - ${profile.name}`,
        description: `View your order history and track your purchases at ${profile.name}.`,
        type: "website",
      },
    };
  } catch (error) {
    return {
      title: "My Orders",
      description: "View your order history and track your purchases.",
    };
  }
}

export default async function OrdersPage() {
  const profileResponse = await fetchBusinessProfile();
  const profile = profileResponse.data;

  return (
    <div className="min-h-screen py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="w-[90%] mx-auto my-3">
          <div className="text-gray-800">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                My Orders
              </h1>
              <p className="text-lg text-gray-600">
                Track your orders and view your purchase history
              </p>
            </div>

            {/* Orders Client Component */}
            <OrdersClient />
          </div>
        </div>
      </div>
    </div>
  );
}
