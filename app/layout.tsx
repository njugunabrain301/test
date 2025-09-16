import { Inter, Cormorant_Garamond, Montserrat } from "next/font/google";
import { fetchBusinessProfile } from "@/utils/backendAPIs/app";
import { fetchCategories } from "@/utils/backendAPIs/products";
import { GlobalContextProvider } from "@/Context/context";
import { getCheckoutInfo } from "@/utils/backendAPIs/cart";
import { getHoliday } from "@/utils/holidays";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import WhatsappWidget from "@/components/WhatsappWidget/WhatsappWidget";
import GlobalCheckoutModal from "@/components/GlobalCheckoutModal";
import { Metadata } from "next";
import {
  BusinessProfile,
  DeliveryLocation,
  CheckoutInfo,
  RootLayoutProps,
  ApiResponse,
} from "@/utils/models";

export const runtime = "nodejs";

// export async function generateMetadata(): Promise<Metadata> {
//   let profileResponse: ApiResponse<BusinessProfile> =
//     await fetchBusinessProfile();
//   let categoriesResponse: ApiResponse<string[]> = await fetchCategories();

//   if (!profileResponse.success || !categoriesResponse.success) {
//     // Handle error case - return default metadata
//     return {
//       title: "Store",
//       description: "Online store",
//     };
//   }

//   let profile = profileResponse.data!;
//   let categories = categoriesResponse.data!;
//   let url = profile.customUrl ? profile.customUrl : profile.url;

//   let icon = profile.icon
//     ? profile.icon.replace(
//         "https://storage.googleapis.com/test-bucket001/",
//         "https://ik.imagekit.io/d4mmlivtj/goduka/tr:w-150,h-100/"
//       )
//     : "https://storage.googleapis.com/test-bucket001/shop.png";

//   let metadata: Metadata = {
//     metadataBase: new URL("https://" + url),
//     title: profile.name,
//     description: profile.about,
//     manifest: "/manifest.json",
//     keywords: categories,
//     openGraph: {
//       title: profile.name,
//       description: profile.about,
//       siteName: profile.name,
//       images: [
//         {
//           url: icon,
//         },
//       ],
//       locale: "en_US",
//       type: "website",
//     },
//     twitter: {
//       title: profile.name,
//       description: profile.about,
//       images: [
//         {
//           url: icon,
//         },
//       ],
//       card: "summary_large_image",
//     },
//     other: {
//       "google-site-verification": profile.googleMerchantTag,
//     },
//   };

//   if (icon) {
//     metadata.icons = {
//       icon: icon,
//       apple: icon,
//     };
//   }

//   return metadata;
// }

// const inter = Inter({ subsets: ["latin"] });
// const montserrat = Montserrat({ subsets: ["latin"] });
// const garamond = Cormorant_Garamond({ subsets: ["latin"], weight: "400" });

export default async function RootLayout({ children }: RootLayoutProps) {
  // let profileRes: ApiResponse<BusinessProfile> = await fetchBusinessProfile();

  // if (!profileRes.success || !profileRes.data) {
  //   // Handle error case - return error page
  //   return (
  //     <html lang="en">
  //       <body>
  //         <div>Failed to load store profile</div>
  //       </body>
  //     </html>
  //   );
  // }

  // let profile: BusinessProfile = profileRes.data;

  // let bodyFont = montserrat;
  // let titleFont = garamond;
  // let subtitleFont = garamond;

  // if (profile.template === "Timeless") {
  //   bodyFont = inter;
  //   titleFont = inter;
  //   subtitleFont = inter;
  // }

  // let checkoutRes: ApiResponse<CheckoutInfo> = await getCheckoutInfo();
  // let checkoutinfo: CheckoutInfo = checkoutRes.data
  //   ? { ...checkoutRes.data }
  //   : {};

  // if (checkoutRes.success && checkoutRes.data) {
  //   checkoutinfo.paymentOptions = checkoutRes.data.paymentOptions;
  //   checkoutinfo.deliveryLocations = checkoutRes.data.deliveryLocations;

  //   checkoutinfo.counties = [];
  //   let added: string[] = [];
  //   checkoutinfo.deliveryLocations?.map((loc: DeliveryLocation) => {
  //     if (!added.includes(loc.county)) checkoutinfo.counties?.push(loc.county);
  //     if (loc.payOnDelivery) {
  //       let idx = checkoutinfo.counties?.indexOf(loc.county);
  //       if (idx !== undefined && idx !== -1) {
  //         checkoutinfo.counties![idx] = loc.county + "*";
  //       }
  //     }
  //     added.push(loc.county);
  //     return loc;
  //   });
  // }

  // const holiday = getHoliday();

  // if (profile.holidayTheme) {
  //   (profile as any).holiday = holiday;
  // }

  return (
    <html lang="en">
      Hello G
      {/* <body className={bodyFont.className + " App min-w-[330px] p-0"}>
        <GlobalContextProvider
          profile={profile}
          titleFont={titleFont}
          bodyFont={bodyFont}
          subtitleFont={subtitleFont}
          checkoutInfo={checkoutinfo}
        >
          <div className="flex flex-col justify-between min-h-[100vh] items-stretch">
            <Navbar />
            <main className="flex-1">
              {profile.active ? (
                children
              ) : (
                <div>Store is currently inactive</div>
              )}
            </main>
            <Footer profile={profile} />
            <WhatsappWidget text="I'm interested in your products" />
            <GlobalCheckoutModal />
          </div>
        </GlobalContextProvider>
      </body> */}
    </html>
  );
}
