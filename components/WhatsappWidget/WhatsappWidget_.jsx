"use client";
import { useGlobalContext } from "@/Context/context";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { getLeadDetails } from "@/utils/functions";
import Image from "next/image";

const whatsapp = {
  src: "https://storage.googleapis.com/test-bucket001/public/whatsapp.png",
  width: 50,
  height: 50,
};

export default function WhatsappWidget({ text }) {
  let { profile, isVisible } = useGlobalContext();

  const controls = useAnimation();

  const sendToWhatsapp = () => {
    getLeadDetails("whatsapp");
    let number = profile.phone;
    if (number[0] === "0") {
      number = "+254" + number.slice(1);
    }
    var url =
      "https://wa.me/" + number + "?text=" + "Subject : " + text + "%0a%0a";
    window.open(url, "_blank").focus();
  };

  const url = usePathname();
  const prodPage = url.includes("/item/");
  useEffect(() => {
    if (isVisible) {
      controls.start({ bottom: 68 }); // Change bottom value to slide div upwards
    } else {
      // controls.start({ bottom: -100 }); // Change bottom value to slide div downwards
    }
  }, [isVisible, controls]);

  return (
    <main-content>
      <motion.div
        className={
          prodPage
            ? "w-[50px] h-[50px] fixed right-3 cursor-pointer"
            : "w-[50px] h-[50px] fixed right-5 cursor-pointer"
        }
        initial={{ bottom: 10 }}
        animate={controls}
        transition={{ duration: 0.5 }}
      >
        <Image
          height={50}
          width={50}
          alt="Whatsapp Icon"
          src={whatsapp}
          onClick={sendToWhatsapp}
        />
      </motion.div>
    </main-content>
  );
}
