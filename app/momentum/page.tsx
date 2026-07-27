"use client";

import { useEffect, useState } from "react";

const slides = [
  { src: "/1.webp", alt: "Prayer room welcome" },
  { src: "/2_1.webp", alt: "What the prayer room is" },
  { src: "/3.webp", alt: "What to do in a prayer room" },
  { src: "/4.webp", alt: "Prayer partners map" },
  { src: "/5.webp", alt: "Worship team map" },
  { src: "/6.webp", alt: "Lobby installation map" },
  { src: "/7.webp", alt: "Behold the Lamb" },
];

export default function MomentumPage() {
  const [mounted, setMounted] = useState(false);
  const [intro, setIntro] = useState(true);
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const total = slides.length;

  useEffect(() => {
    setMounted(true);

    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.src;
    });

    const timer = setTimeout(() => {
      setIntro(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        goTo(current + 1);
      }

      if (e.key === "ArrowLeft") {
        goTo(current - 1);
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () =>
      window.removeEventListener("keydown", handleKeyboard);
  }, [current]);


  function goTo(index: number) {
    if (
      index < 0 ||
      index >= total ||
      index === current ||
      transitioning
    ) {
      return;
    }

    setTransitioning(true);
    setCurrent(index);

    setTimeout(() => {
      setTransitioning(false);
    }, 650);
  }


  if (!mounted) {
    return null;
  }


  return (
    <main id="stage">

      <style jsx>{`

        :global(html),
        :global(body) {
          margin:0;
          padding:0;
          width:100%;
          height:100%;
          background:#000;
          overflow:hidden;
          overscroll-behavior:none;
        }


        #stage {
          position:fixed;
          inset:0;
          background:#000;
        }


        .slide {
          position:absolute;
          inset:0;

          display:flex;
          align-items:center;
          justify-content:center;

          opacity:0;
          visibility:hidden;

          z-index:1;

          transition:
            opacity 1.1s cubic-bezier(.22,.61,.36,1);
        }


        .slide.active {
          opacity:1;
          visibility:visible;
          z-index:2;
        }


        .slide img {
          height:100%;
          max-width:100%;

          object-fit:contain;

          pointer-events:none;
          user-select:none;
        }


        @keyframes intro {

          0% {
            opacity:0;
            transform:
              translateY(46px)
              scale(.82);
          }


          55% {
            opacity:1;
            transform:
              translateY(-6px)
              scale(1.04);
          }


          75% {
            transform:
              translateY(2px)
              scale(.99);
          }


          100% {
            opacity:1;
            transform:
              translateY(0)
              scale(1);
          }

        }


        .intro {
          animation:
            intro
            1.1s
            cubic-bezier(.32,.72,.33,1.15)
            .35s
            both;
        }


        .arrow {

          position:fixed;
          top:0;
          bottom:0;

          width:25%;
          max-width:140px;

          display:flex;
          align-items:center;

          background:none;
          border:none;

          z-index:10;

          cursor:pointer;
        }


        .prev {
          left:0;
          justify-content:flex-start;
        }


        .next {
          right:0;
          justify-content:flex-end;
        }


        .hidden {
          opacity:0;
          pointer-events:none;
        }


        .icon {

          width:56px;
          height:56px;

          border-radius:50%;

          border:
            1.5px solid
            rgba(255,255,255,.75);

          margin:0 18px;

          display:flex;
          align-items:center;
          justify-content:center;

          background:
            rgba(255,255,255,.06);

          backdrop-filter:blur(3px);
        }


        svg {
          width:22px;
          height:22px;

          stroke:white;
          stroke-width:1.75;
          fill:none;
        }


        #progress {

          position:fixed;

          bottom:22px;
          left:50%;

          transform:translateX(-50%);

          display:flex;
          gap:8px;

          z-index:10;
        }


        .dot {

          width:6px;
          height:6px;

          border-radius:50%;

          background:
            rgba(255,255,255,.25);
        }


        .dot.active {
          background:white;
          transform:scale(1.3);
        }


      `}</style>


      {slides.map((slide,index)=>(
        <div
          key={slide.src}
          className={
            `slide ${
              current === index
              ? "active"
              : ""
            }`
          }
        >

          <img
            className={
              intro && index === 0
              ? "intro"
              : ""
            }
            src={slide.src}
            alt={slide.alt}
          />

        </div>
      ))}



      <button
        className={
          `arrow prev ${
            current === 0
            ? "hidden"
            : ""
          }`
        }
        onClick={()=>goTo(current-1)}
      >

        <span className="icon">

          <svg viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6"/>
          </svg>

        </span>

      </button>



      <button
        className={
          `arrow next ${
            current === total-1
            ? "hidden"
            : ""
          }`
        }
        onClick={()=>goTo(current+1)}
      >

        <span className="icon">

          <svg viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6"/>
          </svg>

        </span>

      </button>



      <div id="progress">

        {slides.map((_,index)=>(

          <div
            key={index}
            className={
              `dot ${
                current===index
                ? "active"
                : ""
              }`
            }
          />

        ))}

      </div>


    </main>
  );
}
