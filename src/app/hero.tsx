"use client";

import Image from "next/image";
import { Typography } from "@material-tailwind/react";
import { getImagePrefix } from "../../utils/utils";
import { FaYoutube, FaXTwitter } from "react-icons/fa6";

function Hero() {
  return (
    <header className="bg-white p-8">
      <div className="container mx-auto grid min-h-[60vh] w-full grid-cols-1 items-center gap-10 lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="row-start-2 lg:row-auto">
          <Typography
            variant="h1"
            color="blue-gray"
            className="mb-4 text-3xl lg:text-5xl !leading-tight"
          >
            Welcome to ADRIAN TECH
          </Typography>

          <Typography
            variant="lead"
            className="mb-6 !text-gray-500 md:pr-16 xl:pr-28"
          >
            Hi, I&apos;m ADRIAN TECH. I review a wide range of products and projects—from
            tech gadgets and apps to lifestyle and beauty. My goal is to give honest insights so you can make informed choices and discover the best options out there.
          </Typography>

          {/* SOCIAL LINKS */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.youtube.com/@ADRIANTECH212"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-red-600 hover:text-white"
            >
              <FaYoutube className="text-lg" />
              @ADRIANTECH212
            </a>

            <a
              href="https://x.com/ADRIANTECH212"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-black hover:text-white"
            >
              <FaXTwitter className="text-lg" />
              @ADRIANTECH212
            </a>
          </div>
        </div>

        {/* RIGHT SIDE (IMAGE) */}
        <Image
          width={500}
          height={500}
          alt="team work"
          src={`${getImagePrefix()}image/avt.png`}
          className="mx-auto w-80 h-80 rounded-2xl object-cover shadow-lg"
        />
      </div>
    </header>
  );
}

export default Hero;
