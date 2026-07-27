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
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const total = slides.length;

  useEffect(() => {
    setLoaded(true);

    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.src;
    });

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        goTo(current + 1);
      }

      if (e.key === "ArrowLeft") {
        goTo(current - 1);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [current]);

  function goTo(index: number) {
    if (
      index < 0 ||
      index > total - 1 ||
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

  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);

  return (
    <main
      id="stage"
      onTouchStart={(e) => {
        setTouchStartX(e.changedTouches[0].screenX);
        setTouchStartY(e.changedTouches[0].screenY);
      }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].screenX - touchStartX;
        const dy = e.changedTouches[0].screenY - touchStartY;

        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) goTo(current + 1);
          else goTo(current - 1);
        }
      }}
    >
      <style jsx>{`
        :global(html),
        :global(body) {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          background: #000;
          overflow: hidden;
          overscroll-behavior: none;
          font-family:
            "SF Mono",
            ui-monospace,
            "SFMono-Regular",
            Menlo,
            Consolas,
            monospace;
        }

        #stage {
          position: fixed;
          inset: 0;
          background: #000;
          touch-action: pan-y;
        }

        .slide {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          z-index: 1;
          transition:
            opacity 1.1s cubic-bezier(0.22, 0.61, 0.36, 1),
            visibility 1.1s;
        }

        .slide.active {
          opacity: 1;
          visibility: visible;
          z-index: 2;
        }

        .slide img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: 100%;
          object-fit: contain;
          user-select: none;
          pointer-events: none;
          transform: scale(1.035);
          transition:
            transform 1.4s cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        .slide.active img {
          transform: scale(1);
        }

        /* FIRST SLIDE ENTRANCE ANIMATION */
        @keyframes imessage-in {
          0% {
            opacity: 0;
            transform: translateY(46px) scale(0.82);
          }

          55% {
            opacity: 1;
            transform: translateY(-6px) scale(1.04);
          }

          75% {
            transform: translateY(2px) scale(0.99);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .slide:first-child img {
          opacity: 0;
          transform: translateY(46px) scale(0.82);
        }

        .slide:first-child.active img {
          animation: imessage-in 1.1s cubic-bezier(0.32, 0.72, 0.33, 1.15)
            0.35s both;
        }

        .arrow {
          position: fixed;
          top: 0;
          bottom: 0;
          width: 25%;
          max-width: 140px;
          display: flex;
          align-items: center;
          z-index: 10;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: opacity 0.6s ease;
        }

        .prev {
          left: 0;
          justify-content: flex-start;
        }

        .next {
          right: 0;
          justify-content: flex-end;
        }

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,.75);
          margin: 0 18px;
          background: rgba(255,255,255,.06);
          backdrop-filter: blur(3px);
        }

        svg {
          width: 22px;
          height: 22px;
          stroke: white;
          stroke-width: 1.75;
          fill: none;
        }

        .hidden {
          opacity: 0;
          pointer-events: none;
        }

        #progress {
          position: fixed;
          bottom: max(22px, env(safe-area-inset-bottom));
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,.22);
          transition: .5s ease;
        }

        .dot.active {
          background: white;
          transform: scale(1.3);
        }

        @media(max-width:600px){
          .arrow {
            width:22%;
          }

          .icon {
            width:48px;
            height:48px;
            margin:0 10px;
          }
        }
      `}</style>

      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={`slide ${
            current === index ? "active" : ""
          }`}
        >
          <img src={slide.src} alt={slide.alt} />
        </div>
      ))}

      <button
        className={`arrow prev ${current === 0 ? "hidden" : ""}`}
        onClick={() => goTo(current - 1)}
      >
        <span className="icon">
          <svg viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      <button
        className={`arrow next ${current === total - 1 ? "hidden" : ""}`}
        onClick={() => goTo(current + 1)}
      >
        <span className="icon">
          <svg viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      <div id="progress">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`dot ${
              current === index ? "active" : ""
            }`}
          />
        ))}
      </div>
    </main>
  );
}
