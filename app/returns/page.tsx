import React from "react";
import { fetchReturnsPolicy } from "@/utils/backendAPIs/policies";

export const runtime = "nodejs";
const dynamic = "force-dynamic";

export default async function ReturnsPage() {
  const response = await fetchReturnsPolicy();
  const returnsPolicy = response.data;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Returns Policy</h1>

        <div className="prose prose-lg max-w-none space-y-6">
          {returnsPolicy ? (
            <>
              {/* Policy Status */}
              <section className="p-4 border rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  Returns Policy Status
                </h3>
                <p>
                  {returnsPolicy.accept
                    ? "We accept returns for eligible items."
                    : "We currently do not accept returns."}
                </p>
              </section>

              {/* Eligibility */}
              {returnsPolicy.eligibility &&
                returnsPolicy.eligibility.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">
                      Return Eligibility
                    </h2>
                    <p className="mb-4">
                      Items are eligible for return if they meet the following
                      criteria:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      {returnsPolicy.eligibility.map(
                        (item: string, index: number) => (
                          <li key={index}>{item}</li>
                        )
                      )}
                    </ul>
                  </section>
                )}

              {/* Timeline */}
              {returnsPolicy.raiseTimeline && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">
                    Return Timeline
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Raise Return Request
                      </h3>
                      <p>
                        You have {returnsPolicy.raiseTimeline.amount}{" "}
                        {returnsPolicy.raiseTimeline.unit}
                        {returnsPolicy.raiseTimeline.amount > 1 ? "s" : ""} from
                        the date of delivery to raise a return request.
                      </p>
                    </div>
                    {returnsPolicy.refundTimeline && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Refund Processing
                        </h3>
                        <p>
                          Refunds are processed within{" "}
                          {returnsPolicy.refundTimeline.amount}{" "}
                          {returnsPolicy.refundTimeline.unit}
                          {returnsPolicy.refundTimeline.amount > 1
                            ? "s"
                            : ""}{" "}
                          of receiving the returned item.
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Refund Options */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Refund Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {returnsPolicy.cashRefund && (
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Cash Refund</h3>
                      <p>We offer cash refunds for eligible returns.</p>
                    </div>
                  )}
                  {returnsPolicy.replace && (
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Replacement</h3>
                      <p>
                        We can replace defective or damaged items with the same
                        or similar product.
                      </p>
                    </div>
                  )}
                  {returnsPolicy.fix && (
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Repair</h3>
                      <p>We can repair defective items when possible.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Shipping Costs */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Shipping Costs</h2>
                <div className="space-y-4">
                  {returnsPolicy.refundPurchaseShipping && (
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-lg font-medium mb-2">
                        Original Shipping
                      </h3>
                      <p>
                        We will refund the original shipping cost for eligible
                        returns.
                      </p>
                    </div>
                  )}
                  {returnsPolicy.refundReturnShipping && (
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-lg font-medium mb-2">
                        Return Shipping
                      </h3>
                      <p>
                        We will cover the cost of return shipping for eligible
                        returns.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </>
          ) : (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">
                Returns Policy Not Available
              </h2>
              <p className="opacity-80">
                Please contact us for information about our returns policy.
              </p>
            </div>
          )}

          {/* Contact Information */}
          <section className="mt-8 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
            <p className="mb-4">
              If you have any questions about our returns policy or need to
              initiate a return, please contact us through our website or
              customer service channels.
            </p>
            <p>
              We're here to help ensure you have a satisfactory shopping
              experience.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
