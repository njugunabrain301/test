import { Metadata } from "next";
import { fetchBusinessProfile } from "@/utils/backendAPIs/app";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const profileResponse = await fetchBusinessProfile();
    const profile = profileResponse.data;
    if (!profile) {
      return {
        title: "Terms and Conditions",
        description:
          "Terms and Conditions - Read our terms of service, user agreements, and policies.",
      };
    }

    return {
      title: `Terms and Conditions - ${profile.name}`,
      description: `Terms and Conditions for ${profile.name}. Read our terms of service, user agreements, and policies.`,
      keywords: [
        "terms and conditions",
        "terms of service",
        "user agreement",
        "legal terms",
        profile.name,
      ],
      openGraph: {
        title: `Terms and Conditions - ${profile.name}`,
        description: `Terms and Conditions for ${profile.name}. Read our terms of service, user agreements, and policies.`,
        type: "website",
      },
    };
  } catch (error) {
    return {
      title: "Terms and Conditions",
      description:
        "Terms and Conditions - Read our terms of service, user agreements, and policies.",
    };
  }
}

export default async function TermsAndConditionsPage() {
  const profileResponse = await fetchBusinessProfile();
  const profile = profileResponse.data;

  if (!profile) {
    return <div>No profile found</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="w-[90%] mx-auto my-3">
          <div className="text-gray-800">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                TERMS AND CONDITIONS
              </h1>
              <p className="text-lg text-gray-600">
                Last updated February 16, 2024
              </p>
            </div>

            {/* Introduction */}
            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to <strong>{profile.name}</strong>! These Terms and
                Conditions ("Terms", "Terms and Conditions") govern your use of
                our website located at <strong>{profile.url}</strong> (the
                "Service") operated by <strong>{profile.name}</strong> ("us",
                "we", or "our").
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing or using our Service, you agree to be bound by
                these Terms. If you disagree with any part of these terms, then
                you may not access the Service.
              </p>
            </div>

            {/* Table of Contents */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                TABLE OF CONTENTS
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <a
                    href="#acceptance"
                    className="text-blue-600 hover:underline"
                  >
                    1. ACCEPTANCE OF TERMS
                  </a>
                </li>
                <li>
                  <a
                    href="#description"
                    className="text-blue-600 hover:underline"
                  >
                    2. DESCRIPTION OF SERVICE
                  </a>
                </li>
                <li>
                  <a
                    href="#user-accounts"
                    className="text-blue-600 hover:underline"
                  >
                    3. USER ACCOUNTS
                  </a>
                </li>
                <li>
                  <a href="#orders" className="text-blue-600 hover:underline">
                    4. ORDERS AND PAYMENTS
                  </a>
                </li>
                <li>
                  <a href="#shipping" className="text-blue-600 hover:underline">
                    5. SHIPPING AND DELIVERY
                  </a>
                </li>
                <li>
                  <a href="#returns" className="text-blue-600 hover:underline">
                    6. RETURNS AND REFUNDS
                  </a>
                </li>
                <li>
                  <a
                    href="#intellectual-property"
                    className="text-blue-600 hover:underline"
                  >
                    7. INTELLECTUAL PROPERTY
                  </a>
                </li>
                <li>
                  <a
                    href="#prohibited-uses"
                    className="text-blue-600 hover:underline"
                  >
                    8. PROHIBITED USES
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="text-blue-600 hover:underline">
                    9. PRIVACY POLICY
                  </a>
                </li>
                <li>
                  <a
                    href="#disclaimers"
                    className="text-blue-600 hover:underline"
                  >
                    10. DISCLAIMERS
                  </a>
                </li>
                <li>
                  <a
                    href="#limitation"
                    className="text-blue-600 hover:underline"
                  >
                    11. LIMITATION OF LIABILITY
                  </a>
                </li>
                <li>
                  <a
                    href="#termination"
                    className="text-blue-600 hover:underline"
                  >
                    12. TERMINATION
                  </a>
                </li>
                <li>
                  <a
                    href="#governing-law"
                    className="text-blue-600 hover:underline"
                  >
                    13. GOVERNING LAW
                  </a>
                </li>
                <li>
                  <a href="#changes" className="text-blue-600 hover:underline">
                    14. CHANGES TO TERMS
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-blue-600 hover:underline">
                    15. CONTACT INFORMATION
                  </a>
                </li>
              </ul>
            </div>

            {/* Section 1: Acceptance of Terms */}
            <div id="acceptance" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. ACCEPTANCE OF TERMS
              </h2>
              <p className="text-gray-700 mb-4">
                By accessing and using this website, you accept and agree to be
                bound by the terms and provision of this agreement.
                Additionally, when using this website's particular services, you
                shall be subject to any posted guidelines or rules applicable to
                such services.
              </p>
              <p className="text-gray-700 mb-4">
                If you do not agree to abide by the above, please do not use
                this service.
              </p>
            </div>

            {/* Section 2: Description of Service */}
            <div id="description" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. DESCRIPTION OF SERVICE
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>{profile.name}</strong> operates an e-commerce platform
                that allows users to browse, purchase, and receive various
                products and services. Our service includes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Product catalog and browsing</li>
                <li>Online ordering and payment processing</li>
                <li>Customer account management</li>
                <li>Order tracking and delivery</li>
                <li>Customer support services</li>
              </ul>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify, suspend, or discontinue any part
                of our service at any time without notice.
              </p>
            </div>

            {/* Section 3: User Accounts */}
            <div id="user-accounts" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. USER ACCOUNTS
              </h2>
              <p className="text-gray-700 mb-4">
                To access certain features of our service, you may be required
                to create an account. When creating an account, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>
                  Accept responsibility for all activities under your account
                </li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
              <p className="text-gray-700 mb-4">
                We reserve the right to refuse service, terminate accounts, or
                remove content at our sole discretion.
              </p>
            </div>

            {/* Section 4: Orders and Payments */}
            <div id="orders" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. ORDERS AND PAYMENTS
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>Order Processing:</strong> All orders are subject to
                acceptance and availability. We reserve the right to refuse or
                cancel any order for any reason, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Product availability</li>
                <li>Errors in product descriptions or pricing</li>
                <li>Errors in your order</li>
                <li>Suspected fraudulent activity</li>
              </ul>
              <p className="text-gray-700 mb-4">
                <strong>Pricing:</strong> All prices are subject to change
                without notice. Prices displayed on our website are in Kenyan
                Shillings (KES) unless otherwise specified.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Payment Methods:</strong> We accept various payment
                methods including mobile money (M-PESA), bank transfers, and
                cash on delivery where available. Payment must be received
                before order processing begins.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Order Confirmation:</strong> You will receive an order
                confirmation via email once your order has been successfully
                placed and payment has been processed.
              </p>
            </div>

            {/* Section 5: Shipping and Delivery */}
            <div id="shipping" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. SHIPPING AND DELIVERY
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>Delivery Areas:</strong> We deliver to various locations
                within Kenya. Delivery times and costs may vary depending on
                your location.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Delivery Times:</strong> Estimated delivery times are
                provided at checkout and are subject to change based on factors
                beyond our control, including weather conditions, traffic, and
                courier availability.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Delivery Instructions:</strong> Please ensure someone is
                available to receive the delivery at the specified address and
                time. If no one is available, the delivery may be rescheduled or
                returned to our facility.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Risk of Loss:</strong> Risk of loss and title for
                products purchased pass to you upon delivery to the carrier.
              </p>
            </div>

            {/* Section 6: Returns and Refunds */}
            <div id="returns" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. RETURNS AND REFUNDS
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>Return Policy:</strong> We offer returns within 7 days
                of delivery for most items, subject to the following conditions:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Items must be in original condition with tags attached</li>
                <li>Items must not be used, worn, or damaged</li>
                <li>Original packaging and receipt must be included</li>
                <li>Certain items may not be eligible for return</li>
              </ul>
              <p className="text-gray-700 mb-4">
                <strong>Refund Process:</strong> Refunds will be processed
                within 5-10 business days after we receive and inspect the
                returned item. Refunds will be issued to the original payment
                method.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Return Shipping:</strong> Return shipping costs are the
                responsibility of the customer unless the return is due to our
                error or a defective product.
              </p>
            </div>

            {/* Section 7: Intellectual Property */}
            <div id="intellectual-property" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. INTELLECTUAL PROPERTY
              </h2>
              <p className="text-gray-700 mb-4">
                The service and its original content, features, and
                functionality are and will remain the exclusive property of{" "}
                <strong>{profile.name}</strong> and its licensors. The service
                is protected by copyright, trademark, and other laws.
              </p>
              <p className="text-gray-700 mb-4">
                Our trademarks and trade dress may not be used in connection
                with any product or service without our prior written consent.
              </p>
            </div>

            {/* Section 8: Prohibited Uses */}
            <div id="prohibited-uses" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. PROHIBITED USES
              </h2>
              <p className="text-gray-700 mb-4">You may not use our service:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>
                  For any unlawful purpose or to solicit others to perform
                  unlawful acts
                </li>
                <li>
                  To violate any international, federal, provincial, or state
                  regulations, rules, laws, or local ordinances
                </li>
                <li>
                  To infringe upon or violate our intellectual property rights
                  or the intellectual property rights of others
                </li>
                <li>
                  To harass, abuse, insult, harm, defame, slander, disparage,
                  intimidate, or discriminate
                </li>
                <li>To submit false or misleading information</li>
                <li>
                  To upload or transmit viruses or any other type of malicious
                  code
                </li>
                <li>
                  To spam, phish, pharm, pretext, spider, crawl, or scrape
                </li>
                <li>For any obscene or immoral purpose</li>
                <li>
                  To interfere with or circumvent the security features of the
                  service
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                We reserve the right to terminate your use of the service for
                violating any of the prohibited uses.
              </p>
            </div>

            {/* Section 9: Privacy Policy */}
            <div id="privacy" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. PRIVACY POLICY
              </h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our Privacy
                Policy, which also governs your use of the service, to
                understand our practices.
              </p>
              <p className="text-gray-700 mb-4">
                <a
                  href="/privacy-policy"
                  className="text-blue-600 hover:underline"
                >
                  View our Privacy Policy
                </a>
              </p>
            </div>

            {/* Section 10: Disclaimers */}
            <div id="disclaimers" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. DISCLAIMERS
              </h2>
              <p className="text-gray-700 mb-4">
                The information on this website is provided on an "as is" basis.
                To the fullest extent permitted by law, this Company:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>
                  Excludes all representations and warranties relating to this
                  website and its contents
                </li>
                <li>
                  Excludes all liability for damages arising out of or in
                  connection with your use of this website
                </li>
                <li>
                  Does not warrant that the website will be constantly available
                  or available at all
                </li>
                <li>
                  Does not warrant that the information on this website is
                  complete, true, accurate, or non-misleading
                </li>
              </ul>
            </div>

            {/* Section 11: Limitation of Liability */}
            <div id="limitation" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. LIMITATION OF LIABILITY
              </h2>
              <p className="text-gray-700 mb-4">
                In no event shall <strong>{profile.name}</strong>, nor its
                directors, employees, partners, agents, suppliers, or
                affiliates, be liable for any indirect, incidental, special,
                consequential, or punitive damages, including without
                limitation, loss of profits, data, use, goodwill, or other
                intangible losses, resulting from your use of the service.
              </p>
              <p className="text-gray-700 mb-4">
                Our total liability to you for all damages shall not exceed the
                amount you paid us in the 12 months preceding the claim.
              </p>
            </div>

            {/* Section 12: Termination */}
            <div id="termination" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. TERMINATION
              </h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and bar access to the
                service immediately, without prior notice or liability, under
                our sole discretion, for any reason whatsoever and without
                limitation, including but not limited to a breach of the Terms.
              </p>
              <p className="text-gray-700 mb-4">
                If you wish to terminate your account, you may simply
                discontinue using the service.
              </p>
            </div>

            {/* Section 13: Governing Law */}
            <div id="governing-law" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                13. GOVERNING LAW
              </h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be interpreted and governed by the laws of
                Kenya, without regard to its conflict of law provisions.
              </p>
              <p className="text-gray-700 mb-4">
                Our failure to enforce any right or provision of these Terms
                will not be considered a waiver of those rights.
              </p>
            </div>

            {/* Section 14: Changes to Terms */}
            <div id="changes" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                14. CHANGES TO TERMS
              </h2>
              <p className="text-gray-700 mb-4">
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will provide at least 30 days notice prior to any new terms
                taking effect.
              </p>
              <p className="text-gray-700 mb-4">
                By continuing to access or use our service after those revisions
                become effective, you agree to be bound by the revised terms.
              </p>
            </div>

            {/* Section 15: Contact Information */}
            <div id="contact" className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                15. CONTACT INFORMATION
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms and Conditions,
                please contact us:
              </p>
              <div className="text-gray-700 space-y-2">
                <p>
                  <strong>Company:</strong> {profile.name}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Phone:</strong> {profile.phone}
                </p>
                <p>
                  <strong>Address:</strong> {profile.location}
                </p>
                <p>
                  <strong>Website:</strong> {profile.url}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                These Terms and Conditions were last updated on February 16,
                2024. By using our service, you acknowledge that you have read
                and understood these terms and agree to be bound by them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
