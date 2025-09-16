"use client";
import React, { useState, useEffect } from "react";
import { useGlobalContext } from "@/Context/context";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ShoppingCartIcon,
  UserIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import AuthModal from "./AuthModal";
import ProfileModal from "./ProfileModal";
import CartModal from "./CartModal";
import SearchModal from "./SearchModal";
import Link from "next/link";

const Navbar: React.FC = () => {
  const {
    profile,
    totalCount,
    handleOpenCart,
    handleOpenAuth,
    theme,
    miniHeader,
  } = useGlobalContext();

  const [user, setUser] = useState<any>(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleProfileClick = () => {
    if (user) {
      setOpenProfile(true);
    } else {
      handleOpenAuth();
    }
  };

  const resizeIcon = (img: string) => {
    return img.replace(
      "https://storage.googleapis.com/test-bucket001/",
      "https://ik.imagekit.io/d4mmlivtj/goduka/tr:w-50,h-50/"
    );
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div
        className={`sticky top-0 z-50 w-full ${
          miniHeader ? "h-16" : "h-20"
        } transition-all duration-300`}
        style={{
          backgroundColor: theme.customPalette.background.primary,
          borderBottom: `1px solid ${
            theme.customPalette.panel?.border || "#e5e7eb"
          }`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          style={{
            width: "100%",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-center items-center w-full">
            <div className="flex items-center justify-between h-full w-full">
              {/* Logo and Business Name */}
              <div className="flex items-center space-x-3">
                {profile.icon && (
                  <Image
                    src={resizeIcon(profile.icon)}
                    alt={profile.name}
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                )}
                <h1
                  className="text-xl font-semibold"
                  style={{ color: theme.customPalette.text.base }}
                >
                  {profile.name}
                </h1>
              </div>

              {/* Right Side Actions - All Icons */}
              <div className="flex items-center space-x-2">
                {/* Home Icon */}
                <Link href="/">
                  <button
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    style={{ color: theme.customPalette.text.base }}
                  >
                    <HomeIcon className="h-5 w-5" />
                  </button>
                </Link>

                {/* Search Button */}
                <button
                  onClick={() => setOpenSearch(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{ color: theme.customPalette.text.base }}
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>

                {/* Cart */}
                <button
                  onClick={handleOpenCart}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                  style={{ color: theme.customPalette.text.base }}
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {totalCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalCount}
                    </span>
                  )}
                </button>

                {/* Orders - Desktop Only */}
                {user && (
                  <Link href="/orders">
                    <button
                      className="hidden md:block p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      style={{ color: theme.customPalette.text.base }}
                      title="My Orders"
                    >
                      <DocumentTextIcon className="h-6 w-6" />
                    </button>
                  </Link>
                )}

                {/* User Profile */}
                <button
                  onClick={handleProfileClick}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{ color: theme.customPalette.text.base }}
                >
                  <UserIcon className="h-6 w-6" />
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{ color: theme.customPalette.text.base }}
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
                onClick={closeMobileMenu}
              />
            </motion.div>

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="fixed right-0 top-0 z-50 h-full w-80 bg-white shadow-2xl md:hidden">
                {/* Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                  <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                {/* Menu Items */}
                <div className="p-6 space-y-4 bg-white">
                  <Link href="/" onClick={closeMobileMenu}>
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <HomeIcon className="h-6 w-6 text-gray-600" />
                      <span className="text-gray-900 font-medium">Home</span>
                    </div>
                  </Link>

                  <button
                    onClick={() => {
                      setOpenSearch(true);
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <MagnifyingGlassIcon className="h-6 w-6 text-gray-600" />
                    <span className="text-gray-900 font-medium">Search</span>
                  </button>

                  <button
                    onClick={() => {
                      handleOpenCart();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <ShoppingCartIcon className="h-6 w-6 text-gray-600" />
                    <span className="text-gray-900 font-medium">
                      Cart ({totalCount})
                    </span>
                  </button>

                  {user && (
                    <Link href="/orders" onClick={closeMobileMenu}>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <DocumentTextIcon className="h-6 w-6 text-gray-600" />
                        <span className="text-gray-900 font-medium">
                          My Orders
                        </span>
                      </div>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleProfileClick();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <UserIcon className="h-6 w-6 text-gray-600" />
                    <span className="text-gray-900 font-medium">
                      {user ? "Profile" : "Sign In"}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AuthModal />
      <ProfileModal open={openProfile} setOpen={setOpenProfile} />
      <CartModal />
      <SearchModal open={openSearch} setOpen={setOpenSearch} />
    </>
  );
};

export default Navbar;
