"use client";
import { useGlobalContext } from "@/Context/context";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { getLeadDetails } from "@/utils/functions";
import Image from "next/image";

interface WhatsappWidgetProps {
  text?: string;
}

const whatsapp = {
  src: "https://storage.googleapis.com/test-bucket001/public/whatsapp.png",
  width: 50,
  height: 50,
};

export default function WhatsappWidget({
  text = "I'm interested in your products",
}: WhatsappWidgetProps) {
  const { profile, isVisible } = useGlobalContext();
  const controls = useAnimation();
  const pathname = usePathname();

  const sendToWhatsapp = () => {
    getLeadDetails("whatsapp");
    let number = profile.phone;
    if (number && number[0] === "0") {
      number = "+254" + number.slice(1);
    }

    const message = encodeURIComponent(`Subject: ${text}\n\n`);
    const url = `https://wa.me/${number}?text=${message}`;
    window.open(url, "_blank")?.focus();
  };

  const isProductPage = pathname.includes("/product/");

  useEffect(() => {
    if (isVisible) {
      controls.start({ bottom: 68 });
    }
  }, [isVisible, controls]);

  if (!profile.phone) {
    return null;
  }

  return (
    <div
      className={`w-[50px] h-[50px] fixed ${
        isProductPage ? "right-3" : "right-5"
      } bottom-4 cursor-pointer z-50`}
    >
      <motion.div
        initial={{ bottom: 10 }}
        animate={controls}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Image
          height={50}
          width={50}
          alt="WhatsApp Icon"
          src={whatsapp.src}
          onClick={sendToWhatsapp}
          className="drop-shadow-lg"
        />
      </motion.div>
    </div>
  );
}
