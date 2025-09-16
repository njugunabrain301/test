"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LandingPageArticle } from "@/utils/models";

interface LandingPageArticlesProps {
  articles: LandingPageArticle[];
}

// Helper function to sanitize HTML - client-side approach
const cleanHTML = (text: string) => {
  if (!text) return "";

  // Basic HTML sanitization - remove script tags and dangerous attributes
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:text\/html/gi, "");
};

// Counter component for statistics
const Counter = ({
  value,
  title,
  prefix = "",
  suffix = "",
}: {
  value: number;
  title: string;
  prefix?: string;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCount(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="text-center p-4">
      <div className="text-3xl font-bold text-blue-600">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-sm text-gray-600 mt-1">{title}</div>
    </div>
  );
};

// Simple carousel component
const SimpleCarousel = ({ items }: { items: any[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (items.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              <div className="flex flex-col items-center text-center">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title || ""}
                    className="w-full max-w-sm h-48 object-cover rounded-lg mb-4"
                  />
                )}
                {item.title && (
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                )}
                {item.description && (
                  <p className="text-gray-600">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
          >
            ‹
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
          >
            ›
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center mt-4 space-x-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default function LandingPageArticles({
  articles,
}: LandingPageArticlesProps) {
  if (!articles || articles.length === 0) {
    return null;
  }

  let articleCount = 0;

  return (
    <div className="mb-8">
      {articles
        .filter((article) => article.visibility)
        .sort((a, b) => a.order - b.order)
        .map((article, index) => {
          if (article.type === "article") {
            let reverse = articleCount % 2 !== 0;
            articleCount++;
            const content = article.content as any; // Type assertion for article content
            let hasImage = content.image;

            return (
              <div
                key={index}
                className={`w-full my-5 ${
                  hasImage ? "max-w-4xl mx-auto" : "max-w-2xl mx-auto"
                }`}
              >
                {content.title && (
                  <h3
                    className={`text-2xl md:text-3xl font-bold w-full mb-4 ${
                      hasImage ? "text-left" : "text-center"
                    }`}
                  >
                    {content.title}
                  </h3>
                )}
                <div
                  className={`w-full flex flex-wrap my-4 ${
                    hasImage ? "justify-between items-center" : "justify-center"
                  }`}
                  style={{
                    flexDirection:
                      reverse && content.image ? "row-reverse" : "row",
                  }}
                >
                  {content.image && (
                    <div className="w-full md:w-[45%] mb-4 md:mb-0">
                      <img
                        src={content.image}
                        alt={content.title || ""}
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                    </div>
                  )}
                  {content.content && (
                    <div
                      className={`leading-8 ${
                        hasImage ? "w-full md:w-[50%]" : "w-full"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: cleanHTML(content.content),
                      }}
                    />
                  )}
                </div>
              </div>
            );
          } else if (article.type === "list") {
            const content = article.content as any;
            return (
              <div key={index} className="w-full max-w-2xl mx-auto my-5">
                <div className="w-full my-3">
                  {content.title && (
                    <h2 className="text-2xl md:text-3xl font-bold w-full text-center my-3">
                      {content.title}
                    </h2>
                  )}
                  {content.intro && (
                    <p className="leading-8 mb-3 text-center">
                      {content.intro}
                    </p>
                  )}
                  <ul className="list-disc ml-7 leading-8">
                    {content.items.map((item: any, idx: number) => (
                      <li
                        key={idx}
                        dangerouslySetInnerHTML={{
                          __html: cleanHTML(item),
                        }}
                      />
                    ))}
                  </ul>
                </div>
              </div>
            );
          } else if (
            article.type === "counter" &&
            article.visibility &&
            article.content
          ) {
            const content = article.content as any;
            return (
              <div
                key={index}
                className="w-full max-w-4xl mx-auto my-5 flex justify-center flex-wrap items-center"
              >
                <div className="flex justify-evenly flex-wrap items-center w-full">
                  {content.values.map((value: any, idx: number) => (
                    <Counter
                      key={idx}
                      value={value.value}
                      title={value.title}
                      prefix={value.prefix || ""}
                      suffix={value.suffix || ""}
                    />
                  ))}
                </div>
              </div>
            );
          } else if (article.type === "title") {
            const content = article.content as any;
            return (
              <div
                key={index}
                className="w-full relative text-center mb-3 py-10 px-5 rounded-lg"
                style={{
                  backgroundImage: content.image
                    ? `url('${content.image}')`
                    : "",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {content.image && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg" />
                )}
                <div
                  className="relative z-10"
                  style={{
                    color: content.image ? "white" : "inherit",
                  }}
                >
                  {content.title && (
                    <h1 className="text-3xl md:text-4xl font-bold w-full text-center mb-4">
                      {content.title}
                    </h1>
                  )}
                  {content.subtitle && (
                    <h2 className="text-xl md:text-2xl text-center">
                      {content.subtitle}
                    </h2>
                  )}
                </div>
              </div>
            );
          } else if (article.type === "link") {
            const content = article.content as any;
            return (
              <div
                key={index}
                className="w-full max-w-md mx-auto my-5 flex items-center justify-center"
              >
                <div className="bg-gray-800 text-white rounded-3xl p-4">
                  <Link
                    href={content.url || "/"}
                    className="hover:underline block text-center"
                  >
                    <h2 className="text-xl md:text-2xl">{content.text}</h2>
                  </Link>
                </div>
              </div>
            );
          } else if (article.type === "carousel") {
            const content = article.content as any;
            return (
              <div
                key={index}
                className="w-full relative text-center mb-3 py-10 px-5"
              >
                {content.title && (
                  <h3 className="text-2xl md:text-3xl font-bold w-full text-center mb-6">
                    {content.title}
                  </h3>
                )}
                <SimpleCarousel items={content.values} />
              </div>
            );
          } else if (article.type === "video") {
            const content = article.content as any;
            return (
              <div
                key={index}
                className="w-full relative text-center mb-3 py-10 px-5 rounded-lg"
                style={{
                  backgroundImage: content.image
                    ? `url('${content.image}')`
                    : "",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {content.image && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg" />
                )}
                <div
                  className="relative z-10"
                  style={{
                    color: content.image ? "white" : "inherit",
                  }}
                >
                  {content.title && (
                    <h1 className="text-3xl md:text-4xl font-bold w-full text-center mb-6">
                      {content.title}
                    </h1>
                  )}
                  <div className="max-w-4xl mx-auto">
                    <iframe
                      className="w-full aspect-video rounded-lg"
                      src={`https://www.youtube.com/embed/${content.videoId}`}
                      title={content.title || "Video"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  {content.caption && (
                    <h2 className="text-lg md:text-xl text-center mt-4">
                      {content.caption}
                    </h2>
                  )}
                </div>
              </div>
            );
          } else if (article.type === "banner-video") {
            const content = article.content as any;
            return (
              <div
                key={index}
                className="w-full relative text-center mb-3 py-10 px-5 bg-gray-800 text-white rounded-lg"
              >
                <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
                  <div className="w-full md:w-[48%] flex flex-col justify-center mb-6 md:mb-0">
                    {content.headline && (
                      <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left mb-4">
                        {content.headline}
                      </h1>
                    )}
                    {content.tagline && (
                      <h2 className="text-lg md:text-xl text-center md:text-left mb-4">
                        {content.tagline}
                      </h2>
                    )}
                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-6">
                      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Buy Now
                      </button>
                      {content.manualLink ? (
                        <Link
                          href={content.manualLink}
                          target="_blank"
                          className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          Download Manual
                        </Link>
                      ) : (
                        <a
                          href="tel:+254700000000"
                          className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          Call To Order
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="w-full md:w-[48%]">
                    <iframe
                      className="w-full aspect-video rounded-lg"
                      src={`https://www.youtube.com/embed/${content.videoId}`}
                      title={content.headline || "Video"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })}
    </div>
  );
}
