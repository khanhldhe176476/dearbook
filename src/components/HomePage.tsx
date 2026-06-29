import { useState, useEffect } from 'react';
import hanoiImg from 'figma:asset/d7b475113023469e96cb19c4ee78d3ffb04dfa29.png';
import loveImg from 'figma:asset/4f81f59175575b9ebba78ca1d45401cd109f1941.png';
import familyImg from 'figma:asset/03ef3be4e5a9d3f6b0010356d756eeaf3c80bb4c.png';
import showcaseBirthday from '../assets/showcase_birthday.jpg';
import showcaseTravel from '../assets/showcase_travel.jpg';
import showcaseExplore from '../assets/showcase_explore.jpg';
import { InteractiveLogoutButton } from './InteractiveLogoutButton';
import {
  Heart,
  BookOpen,
  Sparkles,
  Star,
  ArrowRight,
  ArrowLeft,
  Check,
  Gift,
  HelpCircle,
} from 'lucide-react';

interface HomePageProps {
  user?: any;
  onGetStarted: () => void;
  onLogout?: () => void;
}

/* ═══════════════════════════════════════════════════════════
   CSS-in-JS styles for hover effects & animations
   ═══════════════════════════════════════════════════════════ */
const styles = `
  /* ── Keyframes ── */
  @keyframes floatSlow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  @keyframes floatMedium {
    0%, 100% { transform: translateY(0) rotate(-1deg); }
    50% { transform: translateY(-4px) rotate(0.5deg); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(185, 66, 58, 0.3); }
    50% { box-shadow: 0 0 40px rgba(185, 66, 58, 0.6); }
  }
  @keyframes scaleIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes slideInLeft {
    from { transform: translateX(-40px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideInRight {
    from { transform: translateX(40px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes butterflyTravel {
    0% {
      opacity: 0;
      transform: translate3d(-14vw, 0, 0) rotate(var(--butterfly-start-rotate, -8deg)) scale(var(--butterfly-scale, 1));
    }
    9%, 86% { opacity: var(--butterfly-opacity, 0.7); }
    24% {
      transform: translate3d(22vw, var(--butterfly-curve-1, 7vh), 0) rotate(var(--butterfly-rotate-1, 10deg)) scale(var(--butterfly-scale, 1));
    }
    50% {
      transform: translate3d(52vw, var(--butterfly-curve-2, -8vh), 0) rotate(var(--butterfly-rotate-2, -7deg)) scale(var(--butterfly-scale, 1));
    }
    76% {
      transform: translate3d(82vw, var(--butterfly-curve-3, 5vh), 0) rotate(var(--butterfly-rotate-3, 8deg)) scale(var(--butterfly-scale, 1));
    }
    100% {
      opacity: 0;
      transform: translate3d(116vw, var(--butterfly-drift, -80px), 0) rotate(var(--butterfly-end-rotate, 14deg)) scale(var(--butterfly-scale, 1));
    }
  }
  @keyframes butterflyBob {
    0%, 100% { translate: 0 0; }
    50% { translate: 0 -20px; }
  }
  @keyframes wingFlutterLeft {
    0%, 100% { transform: rotate(-2deg) scaleX(1); }
    50% { transform: rotate(-13deg) scaleX(0.48) skewY(2deg); }
  }
  @keyframes wingFlutterRight {
    0%, 100% { transform: rotate(2deg) scaleX(1); }
    50% { transform: rotate(13deg) scaleX(0.48) skewY(-2deg); }
  }
  @keyframes petalFall {
    0% {
      opacity: 0;
      transform: translate3d(var(--petal-start-x, 10vw), -10vh, 0) rotate(0deg);
    }
    12%, 78% { opacity: var(--petal-opacity, 0.45); }
    100% {
      opacity: 0;
      transform: translate3d(calc(var(--petal-start-x, 10vw) + var(--petal-drift, 16vw)), 112vh, 0) rotate(420deg);
    }
  }
  @keyframes twinkleFloat {
    0%, 100% {
      opacity: 0.12;
      transform: translateY(0) scale(0.82);
    }
    50% {
      opacity: 0.58;
      transform: translateY(-14px) scale(1.08);
    }
  }
  @keyframes brandAura {
    0%, 100% {
      opacity: 0.28;
      transform: translateX(-3px) scale(0.96);
    }
    50% {
      opacity: 0.72;
      transform: translateX(5px) scale(1.04);
    }
  }
  @keyframes logoSheen {
    0%, 16% {
      opacity: 0;
      transform: translateX(-60px) skewX(-18deg);
    }
    32% {
      opacity: 0.82;
    }
    54%, 100% {
      opacity: 0;
      transform: translateX(250px) skewX(-18deg);
    }
  }
  @keyframes glintDrift {
    0% {
      opacity: 0;
      transform: translate3d(0, 0, 0) rotate(0deg) scale(0.55);
    }
    18%, 72% {
      opacity: var(--glint-opacity, 0.62);
    }
    100% {
      opacity: 0;
      transform: translate3d(var(--glint-drift-x, 22px), var(--glint-drift-y, -26px), 0) rotate(42deg) scale(1.12);
    }
  }

  .animate-float-slow { animation: floatSlow 6s ease-in-out infinite; }
  .animate-float-medium { animation: floatMedium 4s ease-in-out infinite; }
  .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
  .animate-scale-in { animation: scaleIn 0.6s ease-out forwards; }
  .animate-slide-left { animation: slideInLeft 0.7s ease-out forwards; }
  .animate-slide-right { animation: slideInRight 0.7s ease-out forwards; }

  /* ── Product Card Hover ── */
  .product-card {
    transition: all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
    overflow: hidden;
  }
  .product-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 1;
    pointer-events: none;
  }
  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 38px -22px rgba(59, 41, 37, 0.35);
  }
  .product-card:hover::before {
    opacity: 1;
  }

  /* ── Image hover zoom ── */
  .img-zoom {
    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.6s ease;
  }
  .group:hover .img-zoom {
    transform: scale(1.03);
    filter: brightness(1.02);
  }

  /* ── Badge pulse on hover ── */
  .price-badge {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .price-badge:hover {
    transform: scale(1.04);
  }

  /* ── Tier card ── */
  .tier-card {
    transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
  }
  .tier-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 50%;
    width: 0; height: 3px;
    background: linear-gradient(90deg, #E6C7B8, #B9423A, #E6C7B8);
    transition: all 0.5s ease;
    transform: translateX(-50%);
    border-radius: 2px;
  }
  .tier-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 44px -26px rgba(59, 41, 37, 0.4);
  }
  .tier-card:hover::after {
    width: 80%;
  }

  /* ── Book mockup hover ── */
  .book-mockup {
    transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .book-mockup:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 28px -18px rgba(59, 41, 37, 0.32);
  }

  /* ── Blind box hover ── */
  .blind-box-card {
    transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
  }
  .blind-box-card::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(230,199,184,0.4), transparent, rgba(185,66,58,0.4));
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
  }
  .blind-box-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 42px -26px rgba(59, 41, 37, 0.38);
  }
  .blind-box-card:hover::after {
    opacity: 1;
  }

  /* ── Fanned Cards Showcase ── */
  .fanned-container {
    position: relative;
    width: 100%;
    max-width: 540px;
    height: 340px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.4s ease;
  }
  .fanned-card {
    position: absolute;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), z-index 0.4s ease;
    transform-origin: bottom center;
  }
  .fanned-card:hover {
    transform: translate(var(--card-x), -16px) rotate(0deg) scale(1.03) !important;
    z-index: 50 !important;
  }
  @media (max-width: 640px) {
    .fanned-container {
      transform: scale(0.65);
      margin-top: -60px;
      margin-bottom: -60px;
    }
  }
  @media (max-width: 400px) {
    .fanned-container {
      transform: scale(0.55);
      margin-top: -80px;
      margin-bottom: -80px;
    }
  }

  /* ── Nav link underline effect ── */
  .nav-link {
    position: relative;
    transition: color 0.3s ease;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0;
    width: 0; height: 2px;
    background: linear-gradient(90deg, #B9423A, #E6C7B8);
    transition: width 0.3s ease;
    border-radius: 1px;
  }
  .nav-link:hover {
    color: #B9423A;
  }
  .nav-link:hover::after {
    width: 100%;
  }

  /* ── CTA Button ── */
  .cta-btn {
    position: relative;
    overflow: hidden;
    transition: all 0.4s ease;
  }
  .cta-btn::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 0; height: 0;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    transition: width 0.6s ease, height 0.6s ease;
    transform: translate(-50%, -50%);
  }
  .cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(150, 51, 46, 0.2);
  }
  .cta-btn:hover::before {
    width: 300px; height: 300px;
  }

  /* ── Shimmer text ── */
  .shimmer-text {
    background: linear-gradient(90deg, #B9423A, #E6C7B8, #F7E2D4, #E6C7B8, #B9423A);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  /* ── Glassmorphism ── */
  .glass {
    background: rgba(255, 253, 249, 0.94);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(59, 41, 37, 0.08);
  }
  .brand-logo-frame {
    position: relative;
    width: clamp(188px, 13vw, 238px);
    height: 58px;
    flex: 0 0 auto;
    overflow: hidden;
    margin-left: -8px;
    border-radius: 999px;
    isolation: isolate;
  }
  .brand-logo-frame::before {
    content: '';
    position: absolute;
    inset: 8px 18px 7px 8px;
    border-radius: 999px;
    background:
      radial-gradient(ellipse at 28% 50%, rgba(185, 66, 58, 0.20), transparent 58%),
      linear-gradient(90deg, rgba(255, 245, 238, 0), rgba(255, 236, 224, 0.74), rgba(255, 245, 238, 0));
    filter: blur(10px);
    animation: brandAura 5.4s ease-in-out infinite;
    z-index: -1;
  }
  .brand-logo-frame::after {
    content: '';
    position: absolute;
    top: 10px;
    left: 0;
    width: 42px;
    height: 38px;
    border-radius: 999px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.78), transparent);
    mix-blend-mode: screen;
    animation: logoSheen 5.8s ease-in-out infinite;
    pointer-events: none;
  }
  .brand-logo-img {
    position: absolute;
    left: clamp(-34px, -1.7vw, -25px);
    top: 50%;
    width: clamp(224px, 16vw, 284px);
    height: auto;
    max-width: none;
    transform: translateY(-50%);
    filter: drop-shadow(0 7px 14px rgba(185, 66, 58, 0.18));
    transition: transform 0.35s ease, filter 0.35s ease;
  }
  .brand-logo-frame:hover .brand-logo-img {
    transform: translateY(-50%) scale(1.045);
    filter: drop-shadow(0 9px 18px rgba(185, 66, 58, 0.28));
  }

  /* ── Photo strip hover ── */
  .photo-strip {
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .photo-strip:hover {
    transform: rotate(0deg) translateY(-4px) !important;
    box-shadow: 0 16px 30px -18px rgba(59, 41, 37, 0.28);
  }

  /* ── Scroll reveal ── */
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Section divider ── */
  .section-divider {
    background: linear-gradient(90deg, transparent, rgba(59, 41, 37, 0.12), transparent);
    height: 1px;
  }

  /* ── Decorative dot pattern ── */
  .dot-pattern {
    background-image: radial-gradient(circle, rgba(185, 66, 58, 0.08) 1px, transparent 1px);
    background-size: 24px 24px;
  }

  .ambient-layer {
    position: fixed;
    inset: 0;
    z-index: 12;
    pointer-events: none;
    overflow: hidden;
    contain: layout paint;
  }
  .ambient-layer::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 15% 24%, rgba(230, 199, 184, 0.18), transparent 26%),
      radial-gradient(circle at 84% 68%, rgba(185, 66, 58, 0.10), transparent 24%);
    opacity: 0.42;
  }
  .ambient-butterfly {
    position: absolute;
    top: var(--butterfly-y, 20vh);
    left: 0;
    width: 76px;
    height: 58px;
    animation: butterflyTravel var(--travel-duration, 24s) linear infinite;
    animation-delay: var(--travel-delay, 0s);
    filter: drop-shadow(0 10px 12px rgba(92, 47, 42, 0.18));
    will-change: transform, opacity;
  }
  .ambient-butterfly-inner {
    position: absolute;
    inset: 0;
    animation: butterflyBob var(--bob-duration, 3.8s) ease-in-out infinite;
  }
  .ambient-butterfly::before {
    display: none;
  }
  .butterfly-svg {
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .butterfly-wing {
    transform-box: fill-box;
    will-change: transform;
  }
  .butterfly-wing.left {
    transform-origin: 92% 52%;
    animation: wingFlutterLeft var(--wing-speed, 0.58s) ease-in-out infinite;
  }
  .butterfly-wing.right {
    transform-origin: 8% 52%;
    animation: wingFlutterRight var(--wing-speed, 0.58s) ease-in-out infinite;
  }
  .butterfly-body {
    fill: rgba(67, 41, 36, 0.88);
  }
  .butterfly-antenna,
  .butterfly-vein {
    fill: none;
    stroke: rgba(67, 41, 36, 0.56);
    stroke-linecap: round;
  }
  .butterfly-vein {
    stroke-width: 1.1;
    opacity: 0.44;
  }
  .butterfly-antenna {
    stroke-width: 1.5;
    opacity: 0.7;
  }
  .butterfly-upper-wing {
    fill: var(--wing-main, #E8B89B);
  }
  .butterfly-lower-wing {
    fill: var(--wing-soft, #F8D8C5);
  }
  .butterfly-wing-edge {
    fill: rgba(67, 41, 36, 0.16);
  }
  .butterfly-spot {
    fill: var(--wing-spot, rgba(185, 66, 58, 0.62));
    opacity: 0.72;
  }
  .butterfly-highlight {
    fill: rgba(255, 255, 255, 0.46);
  }
  .butterfly-1 { --butterfly-y: 16vh; --travel-duration: 23s; --travel-delay: -4s; --butterfly-drift: 14vh; --butterfly-scale: 0.82; --butterfly-opacity: 0.62; --wing-main: #E9A98F; --wing-soft: #F8D7C6; --wing-spot: #B9423A; --wing-speed: 0.52s; }
  .butterfly-2 { --butterfly-y: 36vh; --travel-duration: 30s; --travel-delay: -17s; --butterfly-drift: -18vh; --butterfly-scale: 0.62; --butterfly-opacity: 0.44; --wing-main: #E6C7B8; --wing-soft: #FFF0E6; --wing-spot: #7A4A42; --wing-speed: 0.64s; }
  .butterfly-3 { --butterfly-y: 69vh; --travel-duration: 27s; --travel-delay: -8s; --butterfly-drift: -25vh; --butterfly-scale: 0.98; --butterfly-opacity: 0.54; --wing-main: #C67C73; --wing-soft: #F2BFAF; --wing-spot: #7A2E2A; --wing-speed: 0.48s; }
  .butterfly-4 { --butterfly-y: 28vh; --travel-duration: 35s; --travel-delay: -24s; --butterfly-drift: 24vh; --butterfly-scale: 0.52; --butterfly-opacity: 0.34; --wing-main: #D8B2A2; --wing-soft: #F9E3D8; --wing-spot: #9A6848; --wing-speed: 0.72s; }
  .butterfly-5 { --butterfly-y: 54vh; --travel-duration: 26s; --travel-delay: -2s; --butterfly-drift: 9vh; --butterfly-scale: 0.74; --butterfly-opacity: 0.46; --wing-main: #F0B6A4; --wing-soft: #FFE2D2; --wing-spot: #B65B50; --wing-speed: 0.56s; }
  .butterfly-6 { --butterfly-y: 82vh; --travel-duration: 38s; --travel-delay: -31s; --butterfly-drift: -31vh; --butterfly-scale: 0.46; --butterfly-opacity: 0.3; --wing-main: #E3BFAF; --wing-soft: #FFF1E8; --wing-spot: #8C6E5D; --wing-speed: 0.78s; }
  .butterfly-7 { --butterfly-y: 11vh; --travel-duration: 33s; --travel-delay: -22s; --butterfly-drift: 18vh; --butterfly-scale: 0.58; --butterfly-opacity: 0.36; --wing-main: #D69083; --wing-soft: #F7D0C2; --wing-spot: #7A4A42; --wing-speed: 0.68s; }
  .butterfly-8 { --butterfly-y: 61vh; --travel-duration: 42s; --travel-delay: -13s; --butterfly-drift: -12vh; --butterfly-scale: 0.38; --butterfly-opacity: 0.28; --wing-main: #E8CFC3; --wing-soft: #FFF7F0; --wing-spot: #A9685D; --wing-speed: 0.84s; }

  .ambient-petal {
    position: absolute;
    top: 0;
    left: 0;
    width: 12px;
    height: 18px;
    border-radius: 80% 20% 72% 28%;
    background: linear-gradient(145deg, rgba(255, 244, 235, 0.78), rgba(230, 199, 184, 0.5));
    box-shadow: 0 8px 14px rgba(92, 47, 42, 0.06);
    animation: petalFall var(--petal-duration, 22s) linear infinite;
    animation-delay: var(--petal-delay, 0s);
    will-change: transform, opacity;
  }
  .petal-1 { --petal-start-x: 8vw; --petal-drift: 18vw; --petal-duration: 24s; --petal-delay: -5s; --petal-opacity: 0.38; }
  .petal-2 { --petal-start-x: 38vw; --petal-drift: -12vw; --petal-duration: 29s; --petal-delay: -12s; --petal-opacity: 0.28; }
  .petal-3 { --petal-start-x: 66vw; --petal-drift: 14vw; --petal-duration: 26s; --petal-delay: -18s; --petal-opacity: 0.34; }
  .petal-4 { --petal-start-x: 88vw; --petal-drift: -22vw; --petal-duration: 34s; --petal-delay: -9s; --petal-opacity: 0.26; }
  .petal-5 { --petal-start-x: 24vw; --petal-drift: 9vw; --petal-duration: 31s; --petal-delay: -23s; --petal-opacity: 0.22; }
  .petal-6 { --petal-start-x: 74vw; --petal-drift: -9vw; --petal-duration: 28s; --petal-delay: -4s; --petal-opacity: 0.28; }

  .ambient-sparkle {
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 999px;
    background: transparent;
    animation: twinkleFloat var(--sparkle-duration, 4.5s) ease-in-out infinite;
    animation-delay: var(--sparkle-delay, 0s);
  }
  .ambient-sparkle::before,
  .ambient-sparkle::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    border-radius: 999px;
    background: rgba(185, 66, 58, 0.62);
    box-shadow: 0 0 18px rgba(232, 184, 155, 0.72);
    transform: translate(-50%, -50%);
  }
  .ambient-sparkle::before {
    width: 100%;
    height: 2px;
  }
  .ambient-sparkle::after {
    width: 2px;
    height: 100%;
  }
  .sparkle-1 { left: 18vw; top: 34vh; --sparkle-duration: 5.2s; --sparkle-delay: -1.2s; }
  .sparkle-2 { left: 79vw; top: 22vh; --sparkle-duration: 4.7s; --sparkle-delay: -2.8s; }
  .sparkle-3 { left: 56vw; top: 78vh; --sparkle-duration: 6.4s; --sparkle-delay: -3.4s; }
  .sparkle-4 { left: 9vw; top: 82vh; --sparkle-duration: 5.9s; --sparkle-delay: -0.8s; }
  .sparkle-5 { left: 33vw; top: 18vh; --sparkle-duration: 7.1s; --sparkle-delay: -4.1s; }
  .sparkle-6 { left: 91vw; top: 58vh; --sparkle-duration: 6.7s; --sparkle-delay: -2.2s; }

  .ambient-glint {
    position: absolute;
    left: var(--glint-x, 50vw);
    top: var(--glint-y, 50vh);
    width: var(--glint-size, 18px);
    height: var(--glint-size, 18px);
    animation: glintDrift var(--glint-duration, 7s) ease-in-out infinite;
    animation-delay: var(--glint-delay, 0s);
    will-change: transform, opacity;
  }
  .ambient-glint::before,
  .ambient-glint::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    border-radius: 999px;
    background: linear-gradient(90deg, transparent, rgba(255, 236, 210, 0.95), transparent);
    box-shadow: 0 0 16px rgba(185, 66, 58, 0.32);
    transform: translate(-50%, -50%);
  }
  .ambient-glint::before {
    width: 100%;
    height: 2px;
  }
  .ambient-glint::after {
    width: 2px;
    height: 100%;
  }
  .glint-1 { --glint-x: 15vw; --glint-y: 25vh; --glint-size: 18px; --glint-duration: 7.8s; --glint-delay: -1.6s; --glint-drift-x: 28px; --glint-drift-y: -18px; }
  .glint-2 { --glint-x: 47vw; --glint-y: 15vh; --glint-size: 14px; --glint-duration: 8.6s; --glint-delay: -4.4s; --glint-drift-x: -22px; --glint-drift-y: 26px; --glint-opacity: 0.48; }
  .glint-3 { --glint-x: 70vw; --glint-y: 34vh; --glint-size: 22px; --glint-duration: 6.9s; --glint-delay: -2.7s; --glint-drift-x: 18px; --glint-drift-y: -34px; }
  .glint-4 { --glint-x: 88vw; --glint-y: 72vh; --glint-size: 16px; --glint-duration: 9.4s; --glint-delay: -6.2s; --glint-drift-x: -26px; --glint-drift-y: -22px; --glint-opacity: 0.42; }
  .glint-5 { --glint-x: 28vw; --glint-y: 68vh; --glint-size: 12px; --glint-duration: 7.2s; --glint-delay: -5.2s; --glint-drift-x: 20px; --glint-drift-y: 20px; --glint-opacity: 0.5; }
  .glint-6 { --glint-x: 61vw; --glint-y: 84vh; --glint-size: 19px; --glint-duration: 8.1s; --glint-delay: -3.1s; --glint-drift-x: -18px; --glint-drift-y: -30px; }

  @media (max-width: 640px) {
    .ambient-layer { opacity: 0.58; }
    .butterfly-5,
    .butterfly-6,
    .butterfly-7,
    .butterfly-8,
    .petal-4,
    .petal-5,
    .petal-6,
    .sparkle-5,
    .sparkle-6,
    .sparkle-4,
    .glint-4,
    .glint-5,
    .glint-6 { display: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    .ambient-layer { display: none; }
  }
`;

/* ═══════════════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════════════ */

const PriceTag = ({ price, size = 'md' }: { price: string; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeMap = {
    sm: 'w-16 h-16 text-base',
    md: 'w-24 h-24 text-xl',
    lg: 'w-28 h-28 text-3xl',
  };

  return (
    <div
      className={`price-badge ${sizeMap[size]} relative flex items-center justify-center cursor-pointer`}
      style={{
        filter: 'drop-shadow(0 10px 18px rgba(84, 45, 25, 0.28))',
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="priceTagBrown" x1="20" y1="12" x2="82" y2="92" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9A6848" />
            <stop offset="52%" stopColor="#7A472B" />
            <stop offset="100%" stopColor="#63361F" />
          </linearGradient>
        </defs>

        <path
          d="
            M50 8
            C58 8 62 18 65 26
            C72 21 84 17 90 24
            C96 31 88 42 80 48
            C90 52 98 62 94 71
            C90 80 77 78 68 73
            C67 83 60 94 50 94
            C40 94 33 83 32 73
            C23 78 10 80 6 71
            C2 62 10 52 20 48
            C12 42 4 31 10 24
            C16 17 28 21 35 26
            C38 18 42 8 50 8
            Z
          "
          fill="url(#priceTagBrown)"
          stroke="#E8B89B"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />

        <path
          d="
            M50 14
            C56 14 59 23 62 31
            C69 26 79 24 84 29
            C89 35 82 44 74 50
            C84 54 90 62 87 68
            C84 75 73 73 65 67
            C64 77 57 87 50 87
            C43 87 36 77 35 67
            C27 73 16 75 13 68
            C10 62 16 54 26 50
            C18 44 11 35 16 29
            C21 24 31 26 38 31
            C41 23 44 14 50 14
            Z
          "
          fill="none"
          stroke="rgba(255, 224, 204, 0.88)"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />

        <circle cx="50" cy="18" r="5.4" fill="#3A1E12" />
      </svg>

      <span
        className="absolute left-1/2 top-1/2 z-10 font-serif font-bold text-white leading-none whitespace-nowrap pointer-events-none"
        style={{
          fontSize: size === 'lg' ? '24px' : size === 'md' ? '20px' : '16px',
          transform: 'translate(-50%, -50%) translateY(8px)',
          textShadow: '0 2px 4px rgba(0,0,0,0.32)',
        }}
      >
        {price}
      </span>
    </div>
  );
};

const BlindBagCard = ({ imgUrl, title, subtitle }: { imgUrl: string; title: string; subtitle: string }) => (
  <div className="blind-box-card w-52 bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group flex flex-col justify-between"
    style={{ border: '1px solid rgba(59, 41, 37, 0.12)' }}>
    <div>
      {/* Top stripe */}
      <div className="h-1.5 bg-[#B9423A]" />

      <div className="p-4 flex flex-col items-center">
        <div className="w-full h-36 rounded-lg overflow-hidden mb-3 relative"
          style={{ border: '3px solid #FFF8F1' }}>
          <img src={imgUrl} className="w-full h-full object-cover img-zoom" alt="" />
        </div>

        <p className="text-xs text-[#6B4B43] tracking-widest uppercase mb-1">{subtitle}</p>
        <p
          className="text-2xl text-[#B9423A] text-center leading-tight"
          style={{ fontFamily: '"Pinyon Script", "Great Vibes", cursive', fontWeight: '400', fontSize: '1.6rem' }}
        >{title}</p>
      </div>
    </div>

    {/* Bottom stripe */}
    <div className="h-1.5 bg-[#B9423A]" />
  </div>
);

const PhotoBoothStrip = ({ images, rotation }: { images: string[]; rotation: number }) => (
  <div className="photo-strip bg-white p-2 pb-8 shadow-lg border border-gray-100 rounded-sm cursor-pointer"
    style={{ transform: `rotate(${rotation}deg)`, width: '100px' }}>
    <div className="space-y-2">
      {images.map((img: string, i: number) => (
        <div key={i} className="aspect-[3/2] bg-gray-200 overflow-hidden rounded-sm">
          <img src={img} className="w-full h-full object-cover img-zoom" alt="" />
        </div>
      ))}
    </div>
    <div className="text-center mt-4">
      <p
        style={{ fontFamily: '"Pinyon Script", "Great Vibes", cursive', color: '#B9423A', fontSize: '1rem', lineHeight: 1.2 }}
      >dear<br />memories</p>
    </div>
  </div>
);

const AutoFlipRightPage = ({ pages, bgColor }: { pages: any[]; bgColor: string }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setActiveIndex(i => (i + 1) % pages.length), 3000);
    return () => clearInterval(timer);
  }, [pages.length]);

  return (
    <div className="w-44 h-56 overflow-hidden relative rounded-r-lg" style={{ backgroundColor: bgColor }}>
      <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/20 to-transparent z-20 pointer-events-none" />
      {pages.map((page, index) => (
        <div key={index}
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            opacity: activeIndex === index ? 1 : 0,
            transform: activeIndex === index ? 'translateX(0)' : 'translateX(10px)',
            zIndex: activeIndex === index ? 10 : 0,
          }}>
          {page}
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Main HomePage
   ═══════════════════════════════════════════════════════════ */

const ButterflySvg = () => (
  <svg className="butterfly-svg" viewBox="0 0 96 72" aria-hidden="true" focusable="false">
    <g className="butterfly-wing left">
      <path
        className="butterfly-upper-wing"
        d="M46 35 C35 9 13 0 6 15 C-2 32 17 49 45 39 Z"
      />
      <path
        className="butterfly-lower-wing"
        d="M46 39 C31 39 14 50 20 63 C28 77 43 58 48 42 Z"
      />
      <path
        className="butterfly-wing-edge"
        d="M44 36 C29 17 13 8 8 18 C3 31 19 43 44 38 Z"
      />
      <ellipse className="butterfly-highlight" cx="24" cy="23" rx="8" ry="5" transform="rotate(24 24 23)" />
      <ellipse className="butterfly-spot" cx="31" cy="43" rx="4" ry="3.2" transform="rotate(-18 31 43)" />
      <ellipse className="butterfly-spot" cx="20" cy="34" rx="2.6" ry="2.1" />
      <path className="butterfly-vein" d="M45 37 C34 30 24 23 12 17" />
      <path className="butterfly-vein" d="M45 39 C34 39 27 47 22 59" />
    </g>

    <g className="butterfly-wing right">
      <path
        className="butterfly-upper-wing"
        d="M50 35 C61 9 83 0 90 15 C98 32 79 49 51 39 Z"
      />
      <path
        className="butterfly-lower-wing"
        d="M50 39 C65 39 82 50 76 63 C68 77 53 58 48 42 Z"
      />
      <path
        className="butterfly-wing-edge"
        d="M52 36 C67 17 83 8 88 18 C93 31 77 43 52 38 Z"
      />
      <ellipse className="butterfly-highlight" cx="72" cy="23" rx="8" ry="5" transform="rotate(-24 72 23)" />
      <ellipse className="butterfly-spot" cx="65" cy="43" rx="4" ry="3.2" transform="rotate(18 65 43)" />
      <ellipse className="butterfly-spot" cx="76" cy="34" rx="2.6" ry="2.1" />
      <path className="butterfly-vein" d="M51 37 C62 30 72 23 84 17" />
      <path className="butterfly-vein" d="M51 39 C62 39 69 47 74 59" />
    </g>

    <path className="butterfly-antenna" d="M48 20 C42 11 36 9 31 11" />
    <path className="butterfly-antenna" d="M48 20 C54 11 60 9 65 11" />
    <ellipse className="butterfly-body" cx="48" cy="38" rx="4.2" ry="17" />
    <circle className="butterfly-body" cx="48" cy="21" r="4" />
    <path className="butterfly-highlight" d="M48 26 C50 33 50 43 48 52 C46 43 46 33 48 26 Z" />
  </svg>
);

const AmbientMotion = () => (
  <div className="ambient-layer" aria-hidden="true">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
      <span key={`butterfly-${item}`} className={`ambient-butterfly butterfly-${item}`}>
        <span className="ambient-butterfly-inner">
          <ButterflySvg />
        </span>
      </span>
    ))}
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <span key={`petal-${item}`} className={`ambient-petal petal-${item}`} />
    ))}
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <span key={`sparkle-${item}`} className={`ambient-sparkle sparkle-${item}`} />
    ))}
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <span key={`glint-${item}`} className={`ambient-glint glint-${item}`} />
    ))}
  </div>
);

export function HomePage({ user, onGetStarted, onLogout }: HomePageProps) {
  const [showAbout, setShowAbout] = useState(false);

  // Intersection observer for scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [showAbout]);

  const handleNavClick = (targetId: string) => {
    setShowAbout(false);
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#FFFDF9', fontFamily: '"Lora", ui-serif, Georgia, serif' }}>
      <style>{styles}</style>
      <AmbientMotion />

      {/* ── Navigation ── */}
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2">
          <div
            className="brand-logo-frame cursor-pointer"
            onClick={() => {
              setShowAbout(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img
              src="/logo.png"
              alt="dearmemories"
              className="brand-logo-img"
            />
          </div>

          <div className="hidden md:flex items-center gap-7 text-[#6B4B43] text-sm font-semibold">
            <button
              onClick={() => {
                setShowAbout(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`nav-link hover:text-[#B9423A] transition-colors focus:outline-none ${
                showAbout ? 'text-[#B9423A] font-bold' : ''
              }`}
            >
              Giới thiệu
            </button>
            <button
              onClick={() => handleNavClick('ptb-box')}
              className="nav-link hover:text-[#B9423A] transition-colors focus:outline-none"
            >
              Photobook Box
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className="nav-link hover:text-[#B9423A] transition-colors focus:outline-none"
            >
              Danh mục
            </button>
            <button
              onClick={() => handleNavClick('themes')}
              className="nav-link hover:text-[#B9423A] transition-colors focus:outline-none"
            >
              Chủ đề
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[#6B4B43] text-sm font-medium">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="font-medium text-[#6B4B43] text-sm">Chào, <strong className="text-[#3B2925]">{user.name}</strong></span>
                <button onClick={onGetStarted}
                  className="cta-btn bg-[#B9423A] text-white px-5 py-2.5 rounded-full font-medium text-sm relative z-10 hover:bg-[#96332E]">
                  Thư viện của tôi
                </button>
                <InteractiveLogoutButton
                  onLogout={onLogout}
                  variant="ghost"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={onGetStarted}
                  className="cta-btn bg-[#B9423A] text-white px-5 py-2.5 rounded-full font-medium text-sm relative z-10 hover:bg-[#96332E]">
                  Đăng nhập
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onGetStarted}
            className="md:hidden cta-btn px-4 py-2 rounded-full text-white text-sm font-semibold"
            style={{ background: '#B9423A', boxShadow: '0 8px 18px rgba(150, 51, 46, 0.16)' }}
          >
            Bắt đầu
          </button>
        </div>
      </nav>

      {showAbout && (
        <div 
          className="w-full min-h-[calc(100vh-180px)] py-16 px-4 md:px-8 relative overflow-hidden flex items-center justify-center animate-fade-in-up"
          style={{
            background: 'linear-gradient(160deg, #FFF8F1 0%, #F7E2D4 40%, #FFF8F1 100%)',
          }}
        >
          <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />

          <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-12 relative z-10">
            
            {/* Left: Beautiful stacked polaroids/photo cards */}
            <div className="flex-1 flex justify-center items-center relative min-h-[320px] md:min-h-[440px] md:-translate-x-12">
              <div className="relative w-96 h-[420px]">
                {/* Polaroid 1 (bottom layer) */}
                <div 
                  className="absolute top-0 left-0 bg-white p-4 pb-10 rounded shadow-md border border-[#E6C7B8]/30 transform -rotate-12 transition-all duration-500 hover:rotate-0 hover:scale-105 hover:z-30 cursor-pointer"
                  style={{ width: '260px' }}
                >
                  <div className="aspect-square bg-[#FFF8F1] overflow-hidden rounded-sm">
                    <img src={loveImg} className="w-full h-full object-cover" alt="" />
                  </div>
                  <p className="text-center mt-4" style={{ fontFamily: '"Pinyon Script", "Great Vibes", cursive', color: '#B9423A', fontSize: '1.7rem', lineHeight: 1 }}>love stories</p>
                </div>

                {/* Polaroid 2 (middle layer) */}
                <div 
                  className="absolute top-12 left-28 bg-white p-4 pb-10 rounded shadow-lg border border-[#E6C7B8]/30 transform rotate-6 transition-all duration-500 hover:rotate-0 hover:scale-105 hover:z-30 cursor-pointer"
                  style={{ width: '270px' }}
                >
                  <div className="aspect-square bg-[#FFF8F1] overflow-hidden rounded-sm">
                    <img src={familyImg} className="w-full h-full object-cover" alt="" />
                  </div>
                  <p className="text-center mt-4" style={{ fontFamily: '"Pinyon Script", "Great Vibes", cursive', color: '#B9423A', fontSize: '1.7rem', lineHeight: 1 }}>family moments</p>
                </div>

                {/* Polaroid 3 (top layer) */}
                <div 
                  className="absolute top-24 left-6 bg-white p-4 pb-10 rounded shadow-xl border border-[#E6C7B8]/30 transform -rotate-3 transition-all duration-500 hover:rotate-0 hover:scale-105 hover:z-30 cursor-pointer"
                  style={{ width: '260px' }}
                >
                  <div className="aspect-square bg-[#FFF8F1] overflow-hidden rounded-sm">
                    <img src={hanoiImg} className="w-full h-full object-cover" alt="" />
                  </div>
                  <p className="text-center mt-4" style={{ fontFamily: '"Pinyon Script", "Great Vibes", cursive', color: '#B9423A', fontSize: '1.7rem', lineHeight: 1 }}>dear memories</p>
                </div>
              </div>
            </div>

            {/* Right: Premium Glassmorphism content card */}
            <div className="flex-1 bg-white/80 backdrop-blur-md p-8 md:p-10 rounded-xl shadow-md border border-[#E6C7B8]/40">
              <div className="text-center md:text-left mb-6">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B9423A] block mb-2">Giới thiệu</span>

                <h3 
                  className="text-lg font-serif italic text-[#7A4A42] font-semibold mt-2"
                >
                  Every memory deserves a place to stay.
                </h3>
              </div>

              <div className="space-y-4 text-[#543A34] text-base leading-relaxed font-serif text-justify md:text-left">
                <p>
                  <strong className="text-[#B9423A] font-sans">dearmemories.</strong> là nền tảng photobook cá nhân hóa được tạo ra để giúp bạn lưu giữ những khoảnh khắc đáng nhớ theo cách riêng của mình. Chúng tôi tin rằng mỗi bức ảnh đều mang theo một câu chuyện và mỗi câu chuyện đều xứng đáng được lưu giữ lâu dài thay vì bị lãng quên trong thư viện ảnh của điện thoại.
                </p>
                <p>
                  Thông qua những mẫu thiết kế được chọn lọc sẵn cùng trải nghiệm tùy chỉnh đơn giản, <strong className="text-[#B9423A] font-sans">dearmemories.</strong> giúp bạn dễ dàng biến những kỷ niệm, cảm xúc và câu chuyện cá nhân thành một cuốn photobook mang dấu ấn riêng.
                </p>
              </div>

              <div className="mt-8 flex justify-center md:justify-start">
                <button
                  onClick={() => {
                    setShowAbout(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="cta-btn px-6 py-3 rounded-full text-white font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #B9423A, #96332E)',
                    boxShadow: '0 4px 15px rgba(185, 66, 58, 0.3)',
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại trang chủ
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      <div className={showAbout ? 'hidden' : ''}>
        {/* ══════════════════════════════════════════════════════
            SECTION 1 — Hero: Photobook Box
            ══════════════════════════════════════════════════════ */}
        <section id="ptb-box" className="relative w-full min-h-[620px] overflow-hidden flex items-center scroll-mt-24"
        style={{
          background: 'linear-gradient(160deg, #FFFDF9 0%, #F8EFE6 52%, #FFFDF9 100%)',
        }}>
        <div className="absolute inset-0 dot-pattern opacity-25 pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-14 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">

            {/* Left content */}
            <div className="flex-1 animate-slide-left" style={{ animationDelay: '0.2s' }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                style={{ background: 'rgba(185, 66, 58, 0.1)', border: '1px solid rgba(185, 66, 58, 0.2)' }}>
                <span className="w-2 h-2 rounded-full bg-[#B9423A] animate-pulse" />
                <span className="text-sm font-semibold text-[#B9423A]">Photobook Box</span>
              </div>

              <h1 className="leading-[0.95] mb-6 inline-flex flex-col items-center">
                <span
                  className="block text-4xl sm:text-5xl lg:text-6xl"
                  style={{
                    fontFamily: '"Fraunces", "Lora", Georgia, serif',
                    fontWeight: '800',
                    lineHeight: 1.05,
                    color: '#3B2925',
                    letterSpacing: '0',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Photobook Box
                </span>
                <span
                  className="block mt-3 text-xl sm:text-2xl"
                  style={{
                    fontFamily: '"Lora", Georgia, serif',
                    lineHeight: 1.35,
                    color: '#7A4A42',
                    fontWeight: '400',
                    fontStyle: 'italic',
                    letterSpacing: '0',
                    textAlign: 'center',
                  }}
                >
                  nhỏ xinh nhưng đầy cảm xúc
                </span>
              </h1>

              <div className="space-y-4 text-[#6B4B43] text-lg mb-8 font-serif">
                <p className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#B9423A]/10 flex items-center justify-center flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#B9423A]" />
                  </span>
                  1 quyển PTB
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#B9423A]/10 flex items-center justify-center flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#B9423A]" />
                  </span>
                  1 kẹo mút
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#B9423A]/10 flex items-center justify-center flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#B9423A]" />
                  </span>
                  1 thư cảm ơn
                </p>
              </div>

              <button onClick={onGetStarted}
                className="cta-btn px-8 py-3.5 rounded-full text-white font-semibold text-lg relative z-10 hover:opacity-95"
                style={{
                  background: '#B9423A',
                  boxShadow: '0 10px 22px rgba(150, 51, 46, 0.18)',
                }}>
                Tạo sách ngay →
              </button>
            </div>

            {/* Right: Product showcase */}
            <div className="flex-1 flex items-center justify-center animate-slide-right" style={{ animationDelay: '0.4s' }}>
              <div className="relative w-full max-w-[540px]">
                <div className="fanned-container">
                  {/* Card 1 */}
                  <div
                    className="fanned-card"
                    style={{
                      transform: 'translate(-160px, 16px) rotate(-10deg)',
                      zIndex: 10,
                      // @ts-ignore
                      '--card-x': '-160px',
                    }}
                  >
                    <div className="animate-float-slow" style={{ animationDelay: '0s' }}>
                      <BlindBagCard imgUrl={loveImg} title="Begin again" subtitle="You have the courage to" />
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div
                    className="fanned-card"
                    style={{
                      transform: 'translate(-80px, 4px) rotate(-5deg)',
                      zIndex: 20,
                      // @ts-ignore
                      '--card-x': '-80px',
                    }}
                  >
                    <div className="relative animate-float-medium" style={{ animationDelay: '0.3s' }}>
                      {/* Price Tag attached to Card 2 */}
                      <div className="absolute -top-10 -left-8 z-30 pointer-events-none">
                        <PriceTag price="249K" size="md" />
                      </div>
                      <BlindBagCard imgUrl={showcaseBirthday} title="Found home in you" subtitle="Happy Birthday!!" />
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div
                    className="fanned-card"
                    style={{
                      transform: 'translate(0px, 0px) rotate(0deg)',
                      zIndex: 30,
                      // @ts-ignore
                      '--card-x': '0px',
                    }}
                  >
                    <div className="animate-float-slow" style={{ animationDelay: '0.6s' }}>
                      <BlindBagCard imgUrl={showcaseTravel} title="Joy in the random" subtitle="Random Things" />
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div
                    className="fanned-card"
                    style={{
                      transform: 'translate(80px, 4px) rotate(5deg)',
                      zIndex: 20,
                      // @ts-ignore
                      '--card-x': '80px',
                    }}
                  >
                    <div className="animate-float-medium" style={{ animationDelay: '0.9s' }}>
                      <BlindBagCard imgUrl={showcaseExplore} title="Explore & Travel" subtitle="Dear Memories" />
                    </div>
                  </div>

                  {/* Card 5 */}
                  <div
                    className="fanned-card"
                    style={{
                      transform: 'translate(160px, 16px) rotate(10deg)',
                      zIndex: 10,
                      // @ts-ignore
                      '--card-x': '160px',
                    }}
                  >
                    <div className="animate-float-slow" style={{ animationDelay: '1.2s' }}>
                      <BlindBagCard imgUrl={hanoiImg} title="Always Love" subtitle="Museum of memories" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════
          SECTION 2 — Danh mục loại PTB
          ══════════════════════════════════════════════════════ */}
      <section id="categories" className="w-full py-20 relative overflow-hidden scroll-mt-24" style={{ background: '#FFFDF9' }}>
        <div className="absolute inset-0 pointer-events-none opacity-5 dot-pattern" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section title */}
          <div className="reveal text-center mb-12">
            <p className="text-[#B9423A] text-sm tracking-[0.3em] uppercase mb-3 font-semibold">Bộ sưu tập sách</p>
            <h2
              className="text-[#3B2925] mb-3 text-4xl lg:text-5xl"
              style={{ fontFamily: '"Lora", serif', fontWeight: '700', letterSpacing: '0' }}
            >Danh mục loại PTB</h2>
            <p className="text-[#6B4B43] text-lg">Nhiều lựa chọn phù hợp với nhu cầu và ngân sách của bạn</p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              { id: 1, title: 'PTB đóng gáy lò xo', description: 'Tiện lợi, dễ lật mở 360 độ. Thích hợp cho sổ tay ảnh cá nhân, lưu bút học sinh.', price: '180K', color: '#FFF', img: loveImg, secondImg: familyImg },
              { id: 2, title: 'PTB bìa mềm', description: 'Nhẹ nhàng, mỏng nhẹ, tinh tế. Dành cho các album ảnh thường ngày.', price: '245K', color: '#FFF', img: loveImg, secondImg: hanoiImg },
              { id: 3, title: 'PTB bìa cứng', description: 'Bìa cứng cáp, bền bỉ, sang trọng. Phù hợp làm quà lưu niệm lâu dài.', price: '375K', color: '#F4E5E6', img: hanoiImg, secondImg: familyImg },
              { id: 4, title: 'PTB bìa bồi liền mở phẳng', description: 'Trải rộng 180 độ không gáy, in sắc nét. Trải nghiệm xem ảnh trọn vẹn.', price: '399K', color: '#F0E5E7', img: familyImg, secondImg: loveImg },
            ].map((category) => (
              <div key={category.id}
                className="tier-card rounded-xl overflow-hidden cursor-pointer group flex flex-col justify-between"
                onClick={onGetStarted}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(59, 41, 37, 0.12)',
                  boxShadow: '0 10px 28px rgba(59, 41, 37, 0.06)',
                }}>
                <div>
                  {/* Price tag */}
                  <div className="flex justify-between items-center p-5 pb-2">
                    <PriceTag price={category.price} size="sm" />
                    <span className="text-[#6B4B43]/50 text-xs font-mono tracking-widest">#{String(category.id).padStart(2, '0')}</span>
                  </div>

                  {/* Book preview */}
                  <div className="px-5 mb-4">
                    <div className="book-mockup flex rounded-lg overflow-hidden"
                      style={{ border: '1px solid rgba(59, 41, 37, 0.12)', boxShadow: '0 10px 24px rgba(59, 41, 37, 0.08)' }}>
                      {/* Left page */}
                      <div className="w-1/2 h-44 overflow-hidden relative" style={{ backgroundColor: category.color }}>
                        <img src={category.img} className="w-full h-full object-cover img-zoom" alt="" />
                        <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-black/15 to-transparent" />
                      </div>
                      {/* Right page */}
                      <AutoFlipRightPage
                        bgColor={category.id === 4 ? '#68252C' : '#FFF'}
                        pages={
                          category.id === 1 ? [
                            <div className="p-4 h-full bg-white"><p className="font-handwriting text-2xl text-amber-600 mb-2">Spiral Book</p><img src={familyImg} className="w-full h-24 object-cover rounded shadow" alt="" /></div>,
                            <div className="p-4 h-full bg-white"><p className="font-handwriting text-2xl text-amber-700 mb-2">Memories</p><img src={hanoiImg} className="w-full h-24 object-cover rounded shadow" alt="" /></div>,
                          ] : category.id === 2 ? [
                            <div className="p-4 h-full bg-white"><p className="font-handwriting text-3xl text-pink-500 mb-2">Begin again</p><img src={hanoiImg} className="w-full h-24 object-cover rounded shadow" alt="" /></div>,
                            <div className="p-4 h-full bg-white"><p className="font-handwriting text-2xl text-rose-500 mb-2">My story</p><img src={loveImg} className="w-full h-24 object-cover rounded shadow" alt="" /></div>,
                          ] : category.id === 3 ? [
                            <div className="grid grid-cols-2 gap-2 p-3 h-full bg-white"><img src={hanoiImg} className="w-full h-20 object-cover rounded" alt="" /><img src={familyImg} className="w-full h-20 object-cover rounded" alt="" /><img src={loveImg} className="w-full h-20 object-cover rounded" alt="" /><div className="w-full h-20 bg-gray-100 rounded" /></div>,
                            <div className="p-4 h-full bg-white flex items-center justify-center"><img src={familyImg} className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-gray-100" alt="" /></div>,
                          ] : [
                            <div className="p-5 h-full bg-[#68252C]"><div className="w-full h-full bg-[#E5D2BA] shadow-inner p-3 rounded"><p className="text-xs font-serif text-center text-[#E5D2BA]">Mở phẳng 180°...</p></div></div>,
                            <div className="p-5 h-full bg-[#68252C]"><div className="w-full h-full bg-[#E5D2BA] shadow-inner p-3 rounded flex justify-center items-center"><img src={loveImg} className="w-20 h-20 rounded-full border-2 border-white" alt="" /></div></div>,
                          ]
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 pt-0 text-center flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-2xl text-[#3B2925] mb-2 group-hover:text-[#B9423A] transition-colors duration-300 font-bold">
                      {category.title}
                    </h4>
                    <p className="text-[#6B4B43] text-sm mb-4 leading-relaxed">{category.description}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); onGetStarted(); }}
                    className="w-full py-2.5 rounded-xl border border-[#B9423A] text-[#B9423A] bg-white hover:bg-[#B9423A] hover:text-white font-semibold transition duration-300">
                    Chọn loại này
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════
          SECTION 3 — Chủ đề
          ══════════════════════════════════════════════════════ */}
      <section id="themes" className="w-full py-20 relative overflow-hidden scroll-mt-24" style={{ background: '#F8EFE6' }}>
        <div className="absolute inset-0 pointer-events-none opacity-5 dot-pattern" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section title */}
          <div className="reveal text-center mb-12">
            <p className="text-[#B9423A] text-sm tracking-[0.3em] uppercase mb-3 font-semibold">Chủ đề thiết kế</p>
            <h2
              className="text-[#3B2925] mb-3 text-4xl lg:text-5xl"
              style={{ fontFamily: '"Lora", serif', fontWeight: '700', letterSpacing: '0' }}
            >Chủ đề</h2>
            <p className="text-[#6B4B43] text-lg">Mỗi chủ đề đều mang một câu chuyện và xúc cảm trọn vẹn riêng biệt</p>
          </div>

          {/* Themes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'love', title: 'Tình yêu', emoji: '💕', description: 'Hâm nóng tình cảm với câu chuyện lãng mạn.', color: 'from-pink-400 to-rose-500', image: loveImg },
              { id: 'friends', title: 'Bạn bè', emoji: '🎉', description: 'Lưu giữ kỷ niệm thanh xuân, bạn bè thân thương.', color: 'from-cyan-400 to-blue-400', image: hanoiImg },
              { id: 'family', title: 'Gia đình', emoji: '👨‍👩‍👧‍👦', description: 'Ấm áp tình thân, những khoảnh khắc sum vầy.', color: 'from-orange-400 to-rose-400', image: familyImg },
              { id: 'travel', title: 'Du lịch', emoji: '✈️', description: 'Ghi lại hành trình khám phá những vùng đất mới.', color: 'from-emerald-400 to-teal-500', image: hanoiImg },
              { id: 'graduation', title: 'Tốt nghiệp', emoji: '🎓', description: 'Kỷ niệm ngày tốt nghiệp, bạn bè và mái trường.', color: 'from-indigo-400 to-purple-500', image: familyImg },
              { id: 'birthday', title: 'Sinh nhật', emoji: '🎂', description: 'Món quà bất ngờ dành riêng cho ngày tuổi mới.', color: 'from-amber-400 to-orange-500', image: loveImg },
            ].map((theme) => (
              <div key={theme.id}
                className="blind-box-card bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group flex flex-col justify-between"
                onClick={onGetStarted}
                style={{
                  border: '1px solid rgba(59, 41, 37, 0.12)',
                  transition: 'all 0.4s ease',
                }}>
                <div>
                  {/* Top stripe */}
                  <div className="h-1.5 bg-[#B9423A]" />

                  <div className="p-6">
                    <div className="w-full h-44 rounded-lg overflow-hidden mb-4 relative">
                      <img src={theme.image} className="w-full h-full object-cover img-zoom" alt={theme.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#3B2925]/60 to-transparent flex items-end p-4">
                        <span className="text-4xl filter drop-shadow-md">{theme.emoji}</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl text-[#3B2925] font-bold mb-2 group-hover:text-[#B9423A] transition-colors duration-300">
                      {theme.title}
                    </h3>
                    <p className="text-[#6B4B43] text-sm leading-relaxed">{theme.description}</p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button onClick={(e) => { e.stopPropagation(); onGetStarted(); }}
                    className="w-full py-2 rounded-xl bg-[#B9423A] text-white hover:bg-[#96332E] font-semibold transition duration-300 text-sm">
                    Dùng chủ đề này
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="section-divider" />
      </div>

    </div>
  );
}
