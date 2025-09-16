import { Metadata } from "next";
import { fetchBusinessProfile } from "@/utils/backendAPIs/app";
import { getCheckoutInfo } from "@/utils/backendAPIs/cart";
import { fetchShippingPolicy } from "@/utils/backendAPIs/policies";
import { DeliveryLocation, PaymentOption } from "@/utils/models";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const profileResponse = await fetchBusinessProfile();
    const profile = profileResponse.data;

    if (!profile) {
      return {
        title: "Shipping Policy",
        description:
          "Shipping and delivery information. View delivery locations, shipping costs, and delivery options.",
      };
    }
    return {
      title: `Shipping Policy - ${profile.name}`,
      description: `Shipping and delivery information for ${profile.name}. View delivery locations, shipping costs, and delivery options.`,
      keywords: [
        "shipping policy",
        "delivery information",
        "shipping costs",
        "delivery locations",
        profile.name,
      ],
      openGraph: {
        title: `Shipping Policy - ${profile.name}`,
        description: `Shipping and delivery information for ${profile.name}. View delivery locations, shipping costs, and delivery options.`,
        type: "website",
      },
    };
  } catch (error) {
    return {
      title: "Shipping Policy",
      description:
        "Shipping and delivery information. View delivery locations, shipping costs, and delivery options.",
    };
  }
}

export default async function ShippingPage() {
  const profileResponse = await fetchBusinessProfile();
  const profile = profileResponse.data;

  if (!profile) {
    return <div>No profile found</div>;
  }

  // Fetch shipping information
  const checkoutInfoResponse = await getCheckoutInfo();
  const shippingPolicyResponse = await fetchShippingPolicy();

  const checkoutInfo = checkoutInfoResponse.data;
  const shippingPolicy = shippingPolicyResponse.data;

  const deliveryLocations: DeliveryLocation[] =
    checkoutInfo?.deliveryLocations || [];
  const paymentOptions: PaymentOption[] = checkoutInfo?.paymentOptions || [];

  if (!checkoutInfo || !shippingPolicy) {
    return <div>No checkout info or shipping policy found</div>;
  }

  // Calculate counties from delivery locations instead of using API counties array
  const counties: any[] = [];
  // ...new Set(deliveryLocations.map((loc) => loc.county)),

  // Group delivery locations by county
  const locationsByCounty = deliveryLocations.reduce((acc, location) => {
    const county = location.county;
    if (!acc[county]) {
      acc[county] = [];
    }
    acc[county].push(location);
    return acc;
  }, {} as Record<string, DeliveryLocation[]>);

  // Get unique couriers
  const couriers: any[] = [
    // ...new Set(deliveryLocations.map((loc) => loc.courier))
  ];

  // Calculate delivery statistics
  const totalLocations = deliveryLocations.length;
  const payOnDeliveryLocations = deliveryLocations.filter(
    (loc) => loc.payOnDelivery
  ).length;
  const sameDayLocations = deliveryLocations.filter(
    (loc) => loc.sameday
  ).length;
  const nextDayLocations = deliveryLocations.filter(
    (loc) => loc.nextday
  ).length;

  // Get price range
  const prices = deliveryLocations
    .map((loc) => loc.price)
    .filter((price) => price > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  return (
    <div className="min-h-screen py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="w-[90%] mx-auto my-3">
          <div className="text-gray-800">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                SHIPPING POLICY
              </h1>
              <p className="text-lg text-gray-600">
                Last updated February 16, 2024
              </p>
            </div>

            {/* Introduction */}
            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                At <strong>{profile.name}</strong>, we are committed to
                providing reliable and efficient shipping services to our
                customers across Kenya. This shipping policy outlines our
                delivery areas, shipping costs, delivery times, and payment
                options.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-blue-900">
                  {totalLocations}
                </h3>
                <p className="text-blue-700">Delivery Locations</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-green-900">
                  {counties.length}
                </h3>
                <p className="text-green-700">Counties Covered</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-purple-900">
                  {couriers.length}
                </h3>
                <p className="text-purple-700">Courier Partners</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-orange-900">
                  {payOnDeliveryLocations > 0 ? "Available" : "Not Available"}
                </h3>
                <p className="text-orange-700">Pay on Delivery</p>
              </div>
            </div>

            {/* Shipping Overview */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Shipping Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Delivery Timeframes
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    {sameDayLocations > 0 && (
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                        Same-day delivery available in {sameDayLocations}{" "}
                        locations
                      </li>
                    )}
                    {nextDayLocations > 0 && (
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Next-day delivery available in {nextDayLocations}{" "}
                        locations
                      </li>
                    )}
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-gray-500 rounded-full mr-3"></span>
                      Standard delivery: 2-5 business days
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Shipping Costs
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      Starting from: <strong>KES {minPrice}</strong>
                    </li>
                    <li>
                      Maximum cost: <strong>KES {maxPrice}</strong>
                    </li>
                    <li>Free shipping: Available for orders over KES 5,000</li>
                    <li>Cost varies by location and courier</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            {paymentOptions.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Payment Options
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paymentOptions.map((option, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {option.name}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        {option.type === "mpesa_till" && option.tillNumber && (
                          <p>
                            Till Number: <strong>{option.tillNumber}</strong>
                          </p>
                        )}
                        {option.type === "mpesa_paybill" &&
                          option.paybillNumber && (
                            <p>
                              Paybill: <strong>{option.paybillNumber}</strong>
                            </p>
                          )}
                        {option.type === "mpesa_paybill" &&
                          option.accountNumber && (
                            <p>
                              Account: <strong>{option.accountNumber}</strong>
                            </p>
                          )}
                        {option.type === "cash_on_delivery" && (
                          <p className="text-green-600 font-medium">
                            Available
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Locations by County */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Delivery Locations by County
              </h2>
              <div className="space-y-6">
                {Object.entries(locationsByCounty).map(
                  ([county, locations]) => (
                    <div
                      key={county}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="bg-gray-100 px-6 py-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {county} County
                        </h3>
                        <p className="text-gray-600">
                          {locations.length} delivery location
                          {locations.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {locations.map((location) => (
                            <div
                              key={location._id}
                              className="p-4 bg-gray-50 rounded-lg"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">
                                  {location.subcounty || location.county}
                                </h4>
                                <span className="text-sm font-semibold text-blue-600">
                                  KES {location.price}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <p>
                                  Courier: <strong>{location.courier}</strong>
                                </p>
                                {location.time && (
                                  <p>
                                    Delivery Time:{" "}
                                    <strong>{location.time} days</strong>
                                  </p>
                                )}
                                {location.description && (
                                  <p className="text-xs text-gray-500">
                                    {location.description}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {location.payOnDelivery && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                      Pay on Delivery
                                    </span>
                                  )}
                                  {location.sameday && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                      Same Day
                                    </span>
                                  )}
                                  {location.nextday && (
                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                      Next Day
                                    </span>
                                  )}
                                  {location.weightLimit && (
                                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                                      Max {location.weightLimit}kg
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Courier Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Courier Partners
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {couriers.map((courier) => {
                  const courierLocations = deliveryLocations.filter(
                    (loc) => loc.courier === courier
                  );
                  const courierCounties: any[] = [
                    // ...new Set(courierLocations.map((loc) => loc.county)),
                  ];
                  const courierPayOnDelivery = courierLocations.filter(
                    (loc) => loc.payOnDelivery
                  ).length;

                  return (
                    <div
                      key={courier}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {courier}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          Locations: <strong>{courierLocations.length}</strong>
                        </p>
                        <p>
                          Counties: <strong>{courierCounties.length}</strong>
                        </p>
                        {courierPayOnDelivery > 0 && (
                          <p>
                            Pay on Delivery:{" "}
                            <strong>{courierPayOnDelivery} locations</strong>
                          </p>
                        )}
                        <p>Counties served: {courierCounties.join(", ")}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Terms */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Shipping Terms and Conditions
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Order Processing
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Orders are processed within 1-2 business days</li>
                    <li>
                      Delivery times are calculated from the date of dispatch
                    </li>
                    <li>
                      Weekends and public holidays are not counted as business
                      days
                    </li>
                    <li>Delivery times may vary during peak seasons</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Delivery Requirements
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Someone must be available to receive the delivery</li>
                    <li>Valid identification may be required upon delivery</li>
                    <li>Delivery address must be accurate and complete</li>
                    <li>
                      Additional delivery attempts may incur extra charges
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Special Services
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Same-day delivery available in select locations</li>
                    <li>Next-day delivery available in major cities</li>
                    <li>Pay on delivery available in most locations</li>
                    <li>Weight restrictions may apply for certain couriers</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Shipping Support
              </h2>
              <p className="text-gray-700 mb-4">
                For questions about shipping, delivery, or to track your order,
                please contact us:
              </p>
              <div className="text-gray-700 space-y-2">
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Phone:</strong> {profile.phone}
                </p>
                <p>
                  <strong>Business Hours:</strong> Monday - Friday, 8:00 AM -
                  6:00 PM
                </p>
                <p>
                  <strong>Website:</strong> {profile.url}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                This shipping policy was last updated on February 16, 2024. We
                reserve the right to modify this policy at any time. Please
                check back regularly for updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
