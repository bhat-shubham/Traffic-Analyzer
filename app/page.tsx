"use client";
// import { motion , useTransform, useScroll } from "framer-motion";
import { FileUpload } from "../components/ui/file-upload";
import { WobbleCard } from "../components/ui/wobble-card";
import Image from "next/image";
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import Horizontalscroll from "../components/ui/horizontalscroll";
gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

export default function Home() {
const headline = useRef(null);
const feature = useRef(null);
const working = useRef(null);
const para = useRef(null);

useGSAP(() => {
  let parasplit;
  const split = SplitText.create(headline.current, { type: "chars" });
  // paragraph split
  SplitText.create(para.current, { type: "words,lines",
    linesClass: "line",
    autoSplit: true,
    mask: "lines",
    onSplit: (self) => {
      parasplit = gsap.from(self.lines, {
        duration: 0.8,
        yPercent: 100,
        opacity: 0,
        stagger: 0.3,
        ease: "power2.out",
      });
      return parasplit;
    }
     });

  gsap.from(split.chars, {
    x: 50,
    autoAlpha: 0, // handles opacity + visibility
    stagger: 0.05,
    duration: 0.5,
    ease: "ealstic.in",
  });
  gsap.from(feature.current, {
    scrollTrigger: feature.current, // start animation when enters the viewport
    y: 200,
    stagger: 0.05,
    duration:1,
    ease: "back.out(1.7)",
    scrub: 0.5,
});
gsap.from(working.current, {
  scrollTrigger: working.current,
  filter: "blur(20px)",
  opacity: 0,
  duration: 2,
  ease: "power2.out",
});

  return () => {
    split.revert(); // clean up on unmount
  };
});

  return (
    
    <div
      className="bg-gradient-to-r from-[#1B3A31] to-[#253E36]
font-[Poppins] font-extrabold"
    >
      <div className="navbar bg-opacity-100">
        <div className="flex-1">
          <a className="ml-8 text-xl">Packet Analyzer</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-15 gap-10">
            <li>
              <a>Home</a>
            </li>
            <li>
              <a>About</a>
            </li>
            <li>
              <a>Feedback</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="h-screen flex justify-between mx-10 items-center">
        <div  className="h-1/2 w-1/2 rounded-md flex flex-col ">
          <h1 ref={headline} className="text-7xl bg-gradient-to-r from-[#A1FFCE] to-[#AFAFD1] bg-clip-text text-green-200">
            AI Powered Packet Analyzer
          </h1>
          <p ref={para} className="mt-5 text-green-200">
            Our cutting-edge platform leverages artificial intelligence to
            simplify and enhance the analysis of PCAP and CAP files. Instantly
            upload your packet captures and let our intelligent engine detect
            anomalies, suspicious patterns, and potential threats—no manual
            inspection needed. Designed for security professionals, researchers,
            and students, our tool provides actionable insights with speed,
            accuracy, and ease. Stay ahead of cyber threats with real-time
            analysis, visualizations, and recommendations powered by AI.
          </p>
        </div>
        <div className="w-1/ rounded-md ">
          <div className="bg-transparent flex flex-col justify-between w-full max-w-4xl  border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
            <FileUpload />
            <button className="mt-2 btn btn-dash text-xl">
              Analyse My Packet
            </button>

            {/* </FileUpload> */}
          </div>
        </div>
      </div>
      <h1 className="bg-gradient-to-r from-[#A1FFCE] to-[#AFAFD1] bg-clip-text text-transparent text-6xl mb-5 text-center">
        Features
      </h1>
      <div ref={feature} className="p-2 grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-7xl mx-auto w-full">
        <WobbleCard
          containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
          className=""
        >
          <div className="max-w-xs">
            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              🔍 AI-Powered Packet Analysis
            </h2>
            <p className="mt-4 text-left  text-base/6 text-neutral-200">
              Upload .pcap or .cap files and let our AI instantly scan for
              threats, anomalies, and unusual traffic patterns—no manual
              inspection required.
            </p>
          </div>
          <Image
            src="/search.png"
            width={500}
            height={500}
            alt="linear demo image"
            className="absolute -right-4 lg:-right-[10%]  filter -bottom-30 object-contain"
          />
        </WobbleCard>
        <WobbleCard containerClassName="col-span-1 min-h-[300px]">
          <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            ⚡ Real-Time Threat Insights
          </h2>
          <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
            Get actionable insights in seconds with a dashboard that highlights
            suspicious behavior, protocol misuse, and potential intrusions.
          </p>
          <Image
            src="/bolt1.png"
            width={500}
            height={500}
            alt="linear demo image"
            className="-z-1 absolute -right-15 lg:-right-[40%]  filter -bottom-20 object-contain"
          />
        </WobbleCard>
        <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
          <div className="max-w-4xl flex gap-25 overflow-hidden">
            <div>
              <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                🔒 Privacy-First Architecture
              </h2>
              <p className="mt-4 max-w-[23rem] text-left  text-base/6 text-neutral-200">
                Your data stays yours. All file processing happens securely,
                ensuring confidentiality and compliance with modern
                cybersecurity standards.
              </p>
            </div>
            <Image
              src="/lock.png"
              width={500}
              height={500}
              alt="linear demo image"
              className="absolute -right-4 lg:-right-[10%] -bottom-30 object-contain"
            />
          </div>
        </WobbleCard>
      </div>
      <div ref={working} className="h-[50x]">
      <h1 className="bg-gradient-to-r from-[#A1FFCE] to-[#AFAFD1] mt-10 bg-clip-text text-transparent text-6xl text-center">
        How This Works?
      </h1>
       <Horizontalscroll />
      </div>
      <div className="h-screen bg-amber-50 text-center text-2xl mt-10 mb-5">
        shubham
      </div>
      
      {/* background-image: linear-gradient(to right, var(--tw-gradient-stops)); */}
      
    </div>
  );
  
}
