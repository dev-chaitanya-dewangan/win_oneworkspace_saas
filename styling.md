# OneWorkspace Global CSS Styling Guide

## Overview
This comprehensive styling guide provides the complete CSS system for OneWorkspace, a React application built with Tailwind CSS and Radix UI components. The design system emphasizes metallic, glassmorphism effects with a dark-first approach.

## 🎨 Global CSS Variables & Theme System

### CSS Custom Properties
```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* === CORE COLORS === */
    --background: 13 13 13; /* #0d0d0d */
    --foreground: 245 245 245; /* #f5f5f5 */
    
    /* === SURFACE COLORS === */
    --card: 26 26 26; /* #1a1a1a */
    --card-foreground: 245 245 245; /* #f5f5f5 */
    --popover: 26 26 26; /* #1a1a1a */
    --popover-foreground: 245 245 245; /* #f5f5f5 */
    
    /* === INTERACTIVE COLORS === */
    --primary: 111 255 176; /* #6fffb0 - Neon Green */
    --primary-foreground: 13 13 13; /* #0d0d0d */
    --secondary: 38 38 38; /* #262626 */
    --secondary-foreground: 245 245 245; /* #f5f5f5 */
    
    /* === ACCENT COLORS === */
    --accent-green: 111 255 176; /* #6fffb0 */
    --accent-yellow: 255 224 102; /* #ffe066 */
    --accent-pink: 255 105 180; /* #ff69b4 */
    --accent-orange: 255 179 71; /* #ffb347 */
    --accent-blue: 96 165 250; /* #60a5fa */
    
    /* === STATE COLORS === */
    --muted: 38 38 38; /* #262626 */
    --muted-foreground: 160 160 160; /* #a0a0a0 */
    --accent: 38 38 38; /* #262626 */
    --accent-foreground: 245 245 245; /* #f5f5f5 */
    --destructive: 239 68 68; /* #ef4444 */
    --destructive-foreground: 245 245 245; /* #f5f5f5 */
    
    /* === BORDER & OUTLINE === */
    --border: 46 46 46; /* #2e2e2e */
    --input: 46 46 46; /* #2e2e2e */
    --ring: 111 255 176; /* #6fffb0 */
    
    /* === METALLIC GRADIENTS === */
    --metallic-dark: linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%);
    --metallic-medium: linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%);
    --metallic-light: linear-gradient(145deg, #3a3a3a 0%, #2a2a2a 100%);
    
    /* === GLASSMORPHISM === */
    --glass-bg: rgba(255, 255, 255, 0.05);
    --glass-border: rgba(255, 255, 255, 0.1);
    --glass-blur: blur(20px);
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    
    /* === SHADOWS === */
    --shadow-soft: 0 4px 24px rgba(0, 0, 0, 0.4);
    --shadow-medium: 0 8px 32px rgba(0, 0, 0, 0.6);
    --shadow-hard: 0 12px 40px rgba(0, 0, 0, 0.7);
    --shadow-glow: 0 0 20px rgba(255, 255, 255, 0.05);
    
    /* === ANIMATIONS === */
    --transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-normal: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    
    /* === SPACING SCALE === */
    --space-xs: 0.25rem; /* 4px */
    --space-sm: 0.5rem; /* 8px */
    --space-md: 1rem; /* 16px */
    --space-lg: 1.5rem; /* 24px */
    --space-xl: 2rem; /* 32px */
    --space-2xl: 3rem; /* 48px */
    
    /* === BORDER RADIUS === */
    --radius-sm: 0.375rem; /* 6px */
    --radius-md: 0.5rem; /* 8px */
    --radius-lg: 0.75rem; /* 12px */
    --radius-xl: 1rem; /* 16px */
    --radius-2xl: 1.5rem; /* 24px */
    --radius-full: 9999px;
  }

  /* === LIGHT THEME OVERRIDES === */
  .light {
    --background: 255 255 255; /* #ffffff */
    --foreground: 26 26 26; /* #1a1a1a */
    --card: 248 249 250; /* #f8f9fa */
    --card-foreground: 26 26 26; /* #1a1a1a */
    --popover: 255 255 255; /* #ffffff */
    --popover-foreground: 26 26 26; /* #1a1a1a */
    --secondary: 241 243 244; /* #f1f3f4 */
    --secondary-foreground: 26 26 26; /* #1a1a1a */
    --muted: 241 243 244; /* #f1f3f4 */
    --muted-foreground: 107 114 128; /* #6b7280 */
    --accent: 241 243 244; /* #f1f3f4 */
    --accent-foreground: 26 26 26; /* #1a1a1a */
    --border: 229 231 235; /* #e5e7eb */
    --input: 229 231 235; /* #e5e7eb */
    --glass-bg: rgba(0, 0, 0, 0.02);
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    --shadow-soft: 0 4px 24px rgba(0, 0, 0, 0.1);
    --shadow-medium: 0 8px 32px rgba(0, 0, 0, 0.15);
    --shadow-hard: 0 12px 40px rgba(0, 0, 0, 0.2);
  }
}

/* === BASE STYLES === */
@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground font-sans antialiased;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
  
  /* === SCROLLBAR STYLING === */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    @apply bg-muted/20;
  }
  
  ::-webkit-scrollbar-thumb {
    @apply bg-muted-foreground/30 rounded-full;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-muted-foreground/50;
  }
  
  /* === SELECTION STYLING === */
  ::selection {
    @apply bg-primary/20 text-primary-foreground;
  }
  
  /* === FOCUS STYLES === */
  :focus-visible {
    @apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background;


  }
}





mettalic component styling @layer components {
  /* === METALLIC CONTAINER === */
  .metallic-container {
    background: var(--metallic-dark);
    border: 1px solid var(--glass-border);
    backdrop-filter: var(--glass-blur);
    box-shadow: 
      var(--shadow-medium),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      var(--shadow-glow);
    transition: var(--transition-normal);
  }
  
  .metallic-container:hover {
    box-shadow: 
      var(--shadow-hard),
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      0 0 30px rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  /* === DYNAMIC ISLAND SHAPE === */
  .dynamic-island {
    @apply metallic-container;
    border-radius: clamp(30px, 4vh, 40px);
    width: clamp(320px, 60vw, 500px);
    height: clamp(60px, 8vh, 80px);
    position: relative;
    overflow: hidden;
  }
  
  .dynamic-island.expanded {
    width: clamp(400px, 80vw, 700px);
    height: auto;
    min-height: clamp(120px, 15vh, 160px);
    border-radius: clamp(20px, 3vh, 30px);
  }
  
  /* === METALLIC BUTTON === */
  .metallic-button {
    background: var(--metallic-medium);
    border: 2px solid var(--glass-border);
    box-shadow: 
      var(--shadow-soft),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transition: var(--transition-fast);
    position: relative;
    overflow: hidden;
  }
  
  .metallic-button:hover {
    transform: scale(1.05);
    box-shadow: 
      0 6px 20px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      var(--shadow-glow);
  }
  
  .metallic-button:active {
    transform: scale(0.98);
  }
  
  .metallic-button.active {
    border-color: rgb(var(--accent-green));
    box-shadow: 
      0 6px 20px rgba(111, 255, 176, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      0 0 20px rgba(111, 255, 176, 0.5);
  }
  
  /* === GLASSMORPHISM INPUT === */
  .glass-input {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: var(--glass-blur);
    transition: var(--transition-normal);
  }
  
  .glass-input:focus {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  }
  
  /* === NEON GLOW EFFECTS === */
  .neon-green {
    color: rgb(var(--accent-green));
    text-shadow: 0 0 10px rgba(111, 255, 176, 0.5);
  }
  
  .neon-yellow {
    color: rgb(var(--accent-yellow));
    text-shadow: 0 0 10px rgba(255, 224, 102, 0.5);
  }
  
  .neon-pink {
    color: rgb(var(--accent-pink));
    text-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
  }
  
  .neon-blue {
    color: rgb(var(--accent-blue));
    text-shadow: 0 0 10px rgba(96, 165, 250, 0.5);
  }
  
  /* === ANIMATED GRADIENTS === */
  .gradient-animated {
    background: linear-gradient(
      45deg,
      rgb(var(--accent-green)),
      rgb(var(--accent-blue)),
      rgb(var(--accent-pink)),
      rgb(var(--accent-yellow))
    );
    background-size: 400% 400%;
    animation: gradientShift 8s ease infinite;
  }
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  /* === FLOATING ANIMATION === */
  .float-animation {
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  /* === PULSE GLOW === */
  .pulse-glow {
    animation: pulseGlow 2s ease-in-out infinite alternate;
  }
  
  @keyframes pulseGlow {
    from {
      box-shadow: 0 0 20px rgba(111, 255, 176, 0.3);
    }
    to {
      box-shadow: 0 0 30px rgba(111, 255, 176, 0.6);
    }
  }
}

@layer components {
  /* === RADIX DIALOG === */
  .dialog-overlay {
    @apply fixed inset-0 z-50 bg-black/80 backdrop-blur-sm;
    animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  .dialog-content {
    @apply metallic-container;
    @apply fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2;
    @apply rounded-xl p-6;
    animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  @keyframes overlayShow {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes contentShow {
    from {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
  
  /* === RADIX DROPDOWN MENU === */
  .dropdown-content {
    @apply metallic-container;
    @apply min-w-[220px] rounded-lg p-1;
    animation: scaleIn 100ms ease-out;
    transform-origin: var(--radix-dropdown-menu-content-transform-origin);
  }
  
  .dropdown-item {
    @apply relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm;
    @apply text-foreground outline-none transition-colors;
    @apply hover:bg-accent hover:text-accent-foreground;
    @apply focus:bg-accent focus:text-accent-foreground;
    @apply data-[disabled]:pointer-events-none data-[disabled]:opacity-50;
  }
  
  .dropdown-separator {
    @apply -mx-1 my-1 h-px bg-border;
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  /* === RADIX TOOLTIP === */
  .tooltip-content {
    @apply metallic-container;
    @apply rounded-md px-3 py-2 text-xs text-foreground;
    animation: slideUpAndFade 100ms ease-out;
  }
  
  @keyframes slideUpAndFade {
    from {
      opacity: 0;
      transform: translateY(2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* === RADIX SWITCH === */
  .switch-root {
    @apply relative h-6 w-11 cursor-pointer rounded-full bg-muted outline-none;
    @apply focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2;
    @apply data-[state=checked]:bg-primary;
    transition: var(--transition-fast);
  }
  
  .switch-thumb {
    @apply block h-5 w-5 rounded-full bg-background shadow-lg transition-transform;
    @apply data-[state=checked]:translate-x-5;
    transform: translateX(2px);
  }
  
  /* === RADIX SLIDER === */
  .slider-root {
    @apply relative flex h-5 w-full touch-none select-none items-center;
  }
  
  .slider-track {
    @apply relative h-2 w-full grow overflow-hidden rounded-full bg-muted;
  }
  
  .slider-range {
    @apply absolute h-full bg-primary;
  }
  
  .slider-thumb {
    @apply block h-5 w-5 rounded-full border-2 border-primary bg-background;
    @apply ring-offset-background transition-colors;
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2;
    @apply disabled:pointer-events-none disabled:opacity-50;
  }
}