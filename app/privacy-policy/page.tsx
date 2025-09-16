import { Metadata } from "next";
import { fetchBusinessProfile } from "@/utils/backendAPIs/app";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const profileResponse = await fetchBusinessProfile();
    const profile = profileResponse.data;

    if (!profile) {
      return {
        title: "Privacy Policy",
        description:
          "Privacy Policy - Learn how we collect, use, and protect your personal information.",
      };
    }

    return {
      title: `Privacy Policy - ${profile.name}`,
      description: `Privacy Policy for ${profile.name}. Learn how we collect, use, and protect your personal information.`,
      keywords: [
        "privacy policy",
        "data protection",
        "personal information",
        profile.name,
      ],
      openGraph: {
        title: `Privacy Policy - ${profile.name}`,
        description: `Privacy Policy for ${profile.name}. Learn how we collect, use, and protect your personal information.`,
        type: "website",
      },
    };
  } catch (error) {
    return {
      title: "Privacy Policy",
      description:
        "Privacy Policy - Learn how we collect, use, and protect your personal information.",
    };
  }
}

export default async function PrivacyPolicyPage() {
  const profileResponse = await fetchBusinessProfile();
  const profile = profileResponse.data;

  if (!profile) {
    return <div>No business found</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="w-[90%] mx-auto my-3">
          <div className="text-gray-800">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                PRIVACY POLICY
              </h1>
              <p className="text-lg text-gray-600">
                Last updated February 16, 2024
              </p>
            </div>

            {/* Introduction */}
            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                This privacy notice for <strong>{profile.name}</strong> (
                <strong>"we,"</strong> <strong>"us,"</strong> or{" "}
                <strong>"our"</strong>), describes how and why we might collect,
                store, use, and/or share (<strong>"process"</strong>) your
                information when you use our services (<strong>Services</strong>
                ), such as when you:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  Visit our website at <strong>{profile.url}</strong>, or any
                  website of ours that links to this privacy notice
                </li>
                <li>
                  Engage with us in other related ways, including any sales,
                  marketing, or events
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Questions or concerns?</strong> Reading this privacy
                notice will help you understand your privacy rights and choices.
                If you do not agree with our policies and practices, please do
                not use our Services. If you still have any questions or
                concerns, please contact us at{" "}
                <strong>{profile.url}/contacts</strong>.
              </p>
            </div>

            {/* Summary of Key Points */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                SUMMARY OF KEY POINTS
              </h2>
              <p className="text-gray-700 mb-4">
                <em>
                  This summary provides key points from our privacy notice, but
                  you can find out more details about any of these topics by
                  clicking the link following each key point or by using our{" "}
                  <a href="#toc" className="text-blue-600 hover:underline">
                    table of contents
                  </a>{" "}
                  below to find the section you are looking for.
                </em>
              </p>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-700">
                    <strong>What personal information do we process?</strong>{" "}
                    When you visit, use, or navigate our Services, we may
                    process personal information depending on how you interact
                    with us and the Services, the choices you make, and the
                    products and features you use. Learn more about{" "}
                    <a
                      href="#personalinfo"
                      className="text-blue-600 hover:underline"
                    >
                      personal information you disclose to us
                    </a>
                    .
                  </p>
                </div>

                <div>
                  <p className="text-gray-700">
                    <strong>
                      Do we process any sensitive personal information?
                    </strong>{" "}
                    We do not process sensitive personal information.
                  </p>
                </div>

                <div>
                  <p className="text-gray-700">
                    <strong>
                      Do we receive any information from third parties?
                    </strong>{" "}
                    We do not receive any information from third parties.
                  </p>
                </div>

                <div>
                  <p className="text-gray-700">
                    <strong>How do we process your information?</strong> We
                    process your information to provide, improve, and administer
                    our Services, communicate with you, for security and fraud
                    prevention, and to comply with law. We may also process your
                    information for other purposes with your consent. We process
                    your information only when we have a valid legal reason to
                    do so. Learn more about{" "}
                    <a
                      href="#infouse"
                      className="text-blue-600 hover:underline"
                    >
                      how we process your information
                    </a>
                    .
                  </p>
                </div>

                <div>
                  <p className="text-gray-700">
                    <strong>
                      In what situations and with which parties do we share
                      personal information?
                    </strong>{" "}
                    We may share information in specific situations and with
                    specific third parties. Learn more about{" "}
                    <a
                      href="#whoshare"
                      className="text-blue-600 hover:underline"
                    >
                      when and with whom we share your personal information
                    </a>
                    .
                  </p>
                </div>

                <div>
                  <p className="text-gray-700">
                    <strong>How do we keep your information safe?</strong> We
                    have organizational and technical processes and procedures
                    in place to protect your personal information. However, no
                    electronic transmission over the internet or information
                    storage technology can be guaranteed to be 100% secure, so
                    we cannot promise or guarantee that hackers, cybercriminals,
                    or other unauthorized third parties will not be able to
                    defeat our security and improperly collect, access, steal,
                    or modify your information. Learn more about{" "}
                    <a
                      href="#infosafe"
                      className="text-blue-600 hover:underline"
                    >
                      how we keep your information safe
                    </a>
                    .
                  </p>
                </div>

                <div>
                  <p className="text-gray-700">
                    <strong>What are your rights?</strong> Depending on where
                    you are located geographically, the applicable privacy law
                    may mean you have certain rights regarding your personal
                    information. Learn more about{" "}
                    <a
                      href="#privacyrights"
                      className="text-blue-600 hover:underline"
                    >
                      your privacy rights
                    </a>
                    .
                  </p>
                </div>

                <div>
                  <p className="text-gray-700">
                    <strong>How do you exercise your rights?</strong> The
                    easiest way to exercise your rights is by submitting a{" "}
                    <a
                      href="https://app.termly.io/notify/1ac60810-f3ff-40f6-886b-e198b6c44318"
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      data subject access request
                    </a>
                    , or by contacting us. We will consider and act upon any
                    request in accordance with applicable data protection laws.
                  </p>
                </div>

                <div>
                  <p className="text-gray-700">
                    Want to learn more about what we do with any information we
                    collect?{" "}
                    <a href="#toc" className="text-blue-600 hover:underline">
                      Review the privacy notice in full
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            <div id="toc" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                TABLE OF CONTENTS
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <a
                    href="#infocollect"
                    className="text-blue-600 hover:underline"
                  >
                    1. WHAT INFORMATION DO WE COLLECT?
                  </a>
                </li>
                <li>
                  <a href="#infouse" className="text-blue-600 hover:underline">
                    2. HOW DO WE PROCESS YOUR INFORMATION?
                  </a>
                </li>
                <li>
                  <a href="#whoshare" className="text-blue-600 hover:underline">
                    3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
                  </a>
                </li>
                <li>
                  <a href="#cookies" className="text-blue-600 hover:underline">
                    4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
                  </a>
                </li>
                <li>
                  <a
                    href="#sociallogins"
                    className="text-blue-600 hover:underline"
                  >
                    5. HOW DO WE HANDLE YOUR SOCIAL LOGINS?
                  </a>
                </li>
                <li>
                  <a
                    href="#inforetain"
                    className="text-blue-600 hover:underline"
                  >
                    6. HOW LONG DO WE KEEP YOUR INFORMATION?
                  </a>
                </li>
                <li>
                  <a href="#infosafe" className="text-blue-600 hover:underline">
                    7. HOW DO WE KEEP YOUR INFORMATION SAFE?
                  </a>
                </li>
                <li>
                  <a
                    href="#infominors"
                    className="text-blue-600 hover:underline"
                  >
                    8. DO WE COLLECT INFORMATION FROM MINORS?
                  </a>
                </li>
                <li>
                  <a
                    href="#privacyrights"
                    className="text-blue-600 hover:underline"
                  >
                    9. WHAT ARE YOUR PRIVACY RIGHTS?
                  </a>
                </li>
                <li>
                  <a href="#DNT" className="text-blue-600 hover:underline">
                    10. CONTROLS FOR DO-NOT-TRACK FEATURES
                  </a>
                </li>
                <li>
                  <a
                    href="#policyupdates"
                    className="text-blue-600 hover:underline"
                  >
                    11. DO WE MAKE UPDATES TO THIS NOTICE?
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-blue-600 hover:underline">
                    12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
                  </a>
                </li>
                <li>
                  <a href="#request" className="text-blue-600 hover:underline">
                    13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE
                    COLLECT FROM YOU?
                  </a>
                </li>
              </ul>
            </div>

            {/* Section 1: What Information Do We Collect */}
            <div id="infocollect" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. WHAT INFORMATION DO WE COLLECT?
              </h2>

              <div id="personalinfo" className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Personal information you disclose to us
                </h3>
                <p className="text-gray-700 mb-4">
                  <strong>
                    <em>In Short:</em>
                  </strong>{" "}
                  <em>
                    We collect personal information that you provide to us.
                  </em>
                </p>
                <p className="text-gray-700 mb-4">
                  We collect personal information that you voluntarily provide
                  to us when you register on the Services, express an interest
                  in obtaining information about us or our products and
                  Services, when you participate in activities on the Services,
                  or otherwise when you contact us.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Personal Information Provided by You.</strong> The
                  personal information that we collect depends on the context of
                  your interactions with us and the Services, the choices you
                  make, and the products and features you use. The personal
                  information we collect may include the following:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>names</li>
                  <li>phone numbers</li>
                  <li>email addresses</li>
                  <li>passwords</li>
                  <li>billing addresses</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  <strong>Sensitive Information.</strong> We do not process
                  sensitive information.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Payment Data.</strong> We may collect data necessary
                  to process your payment if you make purchases, such as your
                  payment instrument number, and the security code associated
                  with your payment instrument.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Social Media Login Data.</strong> We may provide you
                  with the option to register with us using your existing social
                  media account details, like your Facebook, Twitter, or other
                  social media account. If you choose to register in this way,
                  we will collect the information described in the section
                  called{" "}
                  <a
                    href="#sociallogins"
                    className="text-blue-600 hover:underline"
                  >
                    HOW DO WE HANDLE YOUR SOCIAL LOGINS?
                  </a>{" "}
                  below.
                </p>
                <p className="text-gray-700 mb-4">
                  All personal information that you provide to us must be true,
                  complete, and accurate, and you must notify us of any changes
                  to such personal information.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Information automatically collected
                </h3>
                <p className="text-gray-700 mb-4">
                  <strong>
                    <em>In Short:</em>
                  </strong>{" "}
                  <em>
                    Some information — such as your Internet Protocol (IP)
                    address and/or browser and device characteristics — is
                    collected automatically when you visit our Services.
                  </em>
                </p>
                <p className="text-gray-700 mb-4">
                  We automatically collect certain information when you visit,
                  use, or navigate the Services. This information does not
                  reveal your specific identity (like your name or contact
                  information) but may include device and usage information,
                  such as your IP address, browser and device characteristics,
                  operating system, language preferences, referring URLs, device
                  name, country, location, information about how and when you
                  use our Services, and other technical information. This
                  information is primarily needed to maintain the security and
                  operation of our Services, and for our internal analytics and
                  reporting purposes.
                </p>
                <p className="text-gray-700 mb-4">
                  Like many businesses, we also collect information through
                  cookies and similar technologies.
                </p>
                <p className="text-gray-700 mb-4">
                  The information we collect includes:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>
                    <em>Log and Usage Data.</em> Log and usage data is
                    service-related, diagnostic, usage, and performance
                    information our servers automatically collect when you
                    access or use our Services and which we record in log files.
                    Depending on how you interact with us, this log data may
                    include your IP address, device information, browser type,
                    and settings and information about your activity in the
                    Services (such as the date/time stamps associated with your
                    usage, pages and files viewed, searches, and other actions
                    you take such as which features you use), device event
                    information (such as system activity, error reports
                    (sometimes called "crash dumps"), and hardware settings).
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Information */}
            <div id="contact" className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
              </h2>
              <p className="text-gray-700 mb-4">
                If you have questions or comments about this notice, you may
                email us at <strong>{profile.email}</strong> or call us at{" "}
                <strong>{profile.phone}</strong> or contact us by post at:
              </p>
              <div className="text-gray-700">
                <p>
                  <strong>{profile.name}</strong>
                </p>
                <p>{profile.location}</p>
                <p>Kenya</p>
              </div>
            </div>

            {/* Minor Information */}
            <div id="infominors" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. DO WE COLLECT INFORMATION FROM MINORS?
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>
                  <em>In Short:</em>
                </strong>{" "}
                <em>
                  We do not knowingly collect data from or market to children
                  under 18 years of age.
                </em>
              </p>
              <p className="text-gray-700 mb-4">
                We do not knowingly solicit data from or market to children
                under 18 years of age. By using the Services, you represent that
                you are at least 18 or that you are the parent or guardian of
                such a minor and consent to such minor dependent's use of the
                Services. If we learn that personal information from users less
                than 18 years of age has been collected, we will deactivate the
                account and take reasonable measures to promptly delete such
                data from our records. If you become aware of any data we may
                have collected from children under age 18, please contact us at{" "}
                <strong>{profile.email}</strong> or call us at{" "}
                <strong>{profile.phone}</strong>.
              </p>
            </div>

            {/* Privacy Rights */}
            <div id="privacyrights" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. WHAT ARE YOUR PRIVACY RIGHTS?
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>
                  <em>In Short:</em>
                </strong>{" "}
                <em>
                  You may review, change, or terminate your account at any time.
                </em>
              </p>
              <p className="text-gray-700 mb-4">
                If you have questions or comments about your privacy rights, you
                may email us at <strong>{profile.email}</strong> or call us at{" "}
                <strong>{profile.phone}</strong>.
              </p>
            </div>

            {/* Policy Updates */}
            <div id="policyupdates" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. DO WE MAKE UPDATES TO THIS NOTICE?
              </h2>
              <p className="text-gray-700 mb-4">
                <em>
                  <strong>In Short:</strong> Yes, we will update this notice as
                  necessary to stay compliant with relevant laws.
                </em>
              </p>
              <p className="text-gray-700 mb-4">
                We may update this privacy notice from time to time. The updated
                version will be indicated by an updated "Revised" date and the
                updated version will be effective as soon as it is accessible.
                If we make material changes to this privacy notice, we may
                notify you either by prominently posting a notice of such
                changes or by directly sending you a notification. We encourage
                you to review this privacy notice frequently to be informed of
                how we are protecting your information.
              </p>
            </div>

            {/* Data Review */}
            <div id="request" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT
                FROM YOU?
              </h2>
              <p className="text-gray-700 mb-4">
                Based on the applicable laws of your country, you may have the
                right to request access to the personal information we collect
                from you, change that information, or delete it. To request to
                review, update, or delete your personal information, please{" "}
                <a
                  href="https://app.termly.io/notify/1ac60810-f3ff-40f6-886b-e198b6c44318"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  fill out and submit a data subject access request
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
