"use client";
const loading = {
  src: "https://storage.googleapis.com/test-bucket001/images/loading.gif",
  width: 500,
  height: 500,
};
const loading_dark = {
  src: "https://storage.googleapis.com/test-bucket001/images/loading-dark.gif",
  width: 500,
  height: 500,
};
import Image from "next/image";
import { useGlobalContext } from "@/Context/context";

export default function Loading() {
  let { theme } = useGlobalContext();
  return (
    <div className="flex p-10 md:p-1 justify-center items-stretch flex-col">
      <div className="w-[90%] md:w-[60%] md:max-w-[500px] lg:max-w-[700px] pt-[100px] md:pt-[0px] mx-auto flex items-center justify-center">
        {theme["theme-type"] === "light" ? (
          <Image alt="Loading gif" src={loading} />
        ) : (
          <Image alt="Loading gif" src={loading_dark} />
        )}
      </div>
    </div>
  );
}
