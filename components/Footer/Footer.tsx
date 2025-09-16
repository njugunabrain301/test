"use client";
import React from "react";
import { useGlobalContext } from "@/Context/context";
import Link from "next/link";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

interface FooterProps {
  profile: any;
}

const Footer: React.FC<FooterProps> = ({ profile }) => {
  const { theme } = useGlobalContext();

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full py-8 mt-auto"
      style={{
        backgroundColor: theme.customPalette.background.inverted,
        color: theme.customPalette.text.inverted,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{profile.name}</h3>

            {profile.about && (
              <p className="text-sm opacity-80">{profile.about}</p>
            )}

            <div className="space-y-2">
              {profile.phone && (
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-4 w-4" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
              )}

              {profile.email && (
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-4 w-4" />
                  <span className="text-sm">{profile.email}</span>
                </div>
              )}

              {profile.location && (
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-4 w-4" />
                  <span className="text-sm">{profile.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>

            <div className="space-y-2">
              <Link href="/">
                <span className="text-sm hover:opacity-80 cursor-pointer transition-opacity block">
                  Home
                </span>
              </Link>

              <Link href="/products">
                <span className="text-sm hover:opacity-80 cursor-pointer transition-opacity block">
                  Products
                </span>
              </Link>

              <Link href="/about">
                <span className="text-sm hover:opacity-80 cursor-pointer transition-opacity block">
                  About Us
                </span>
              </Link>

              <Link href="/contact">
                <span className="text-sm hover:opacity-80 cursor-pointer transition-opacity block">
                  Contact
                </span>
              </Link>
            </div>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Policies</h3>

            <div className="space-y-2">
              <Link href="/privacy-policy">
                <span className="text-sm hover:opacity-80 cursor-pointer transition-opacity block">
                  Privacy Policy
                </span>
              </Link>

              <Link href="/terms-and-conditions">
                <span className="text-sm hover:opacity-80 cursor-pointer transition-opacity block">
                  Terms & Conditions
                </span>
              </Link>

              <Link href="/returns">
                <span className="text-sm hover:opacity-80 cursor-pointer transition-opacity block">
                  Returns Policy
                </span>
              </Link>

              <Link href="/shipping">
                <span className="text-sm hover:opacity-80 cursor-pointer transition-opacity block">
                  Shipping Policy
                </span>
              </Link>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Follow Us</h3>

            <div className="space-y-2">
              {profile.facebook && (
                <a
                  href={profile.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <span className="text-sm hover:opacity-80 cursor-pointer transition-opacity">
                    Facebook
                  </span>
                </a>
              )}

              {profile.instagram && (
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <span className="text-sm hover:opacity-80 cursor-pointer transition-opacity">
                    Instagram
                  </span>
                </a>
              )}

              {profile.twitter && (
                <a
                  href={profile.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <span className="text-sm hover:opacity-80 cursor-pointer transition-opacity">
                    Twitter
                  </span>
                </a>
              )}

              {profile.google && (
                <a
                  href={profile.google}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <span className="text-sm hover:opacity-80 cursor-pointer transition-opacity">
                    Google
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <span className="text-sm opacity-80">
              © {currentYear} {profile.name}. All rights reserved.
            </span>

            <span className="text-sm opacity-80">
              Powered by Bunika Solutions
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
