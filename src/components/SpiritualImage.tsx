import React, { useState, useEffect } from 'react';
import { Deity } from '../types';
import { EXPLICIT_DEITY_IMAGE_MAPPING } from '../data/mediaConfig';

export interface SpiritualImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  aspectRatio?: '4/5' | '16/9' | '1/1' | 'auto' | 'custom';
  focalPoint?: string;
  deity?: Deity;
  overlay?: 'subtle' | 'card' | 'hero' | 'none';
  children?: React.ReactNode;
  onClick?: () => void;
  id?: string;
}

// Infallible emergency fallback emblems when all network calls fail
const DEITY_SACRED_EMBLEMS: Record<string, { symbol: string; label: string; bgGradient: string }> = {
  Shiva: {
    symbol: '🔱',
    label: 'Mahadev',
    bgGradient: 'from-[#12141a] via-[#0d0f14] to-[#08090c]'
  },
  Krishna: {
    symbol: '🦚',
    label: 'Shri Krishna',
    bgGradient: 'from-[#0f1717] via-[#091010] to-[#050909]'
  },
  Hanuman: {
    symbol: '🕉️',
    label: 'Bajrangbali',
    bgGradient: 'from-[#19130d] via-[#120d08] to-[#0a0704]'
  },
  Universal: {
    symbol: 'ॐ',
    label: 'Ishvara',
    bgGradient: 'from-[#141210] via-[#0e0d0b] to-[#070605]'
  }
};

export const SpiritualImage: React.FC<SpiritualImageProps> = ({
  src,
  fallbackSrc,
  alt,
  className = '',
  imgClassName = '',
  aspectRatio = 'auto',
  focalPoint = 'object-center',
  deity = 'Universal',
  overlay = 'none',
  children,
  onClick,
  id
}) => {
  // Content without artwork falls back to the deity's bundled image
  const resolvedSrc =
    src ||
    EXPLICIT_DEITY_IMAGE_MAPPING[(deity || 'Universal').toLowerCase() as keyof typeof EXPLICIT_DEITY_IMAGE_MAPPING]?.deity ||
    '';
  const [currentSrc, setCurrentSrc] = useState<string>(resolvedSrc);
  const [hasTriedFallback, setHasTriedFallback] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync state when src prop changes
  useEffect(() => {
    setCurrentSrc(resolvedSrc);
    setHasTriedFallback(false);
    setIsFailed(false);
    setIsLoading(true);
  }, [resolvedSrc]);

  const handleError = () => {
    // 1. If explicit fallbackSrc provided and not yet tried
    if (!hasTriedFallback && fallbackSrc && fallbackSrc !== currentSrc) {
      setHasTriedFallback(true);
      setCurrentSrc(fallbackSrc);
      setIsLoading(true);
      return;
    }

    // 2. If deity-specific fallback exists and not yet tried
    if (!hasTriedFallback && deity && deity !== 'Universal') {
      const deityKey = deity.toLowerCase() as keyof typeof EXPLICIT_DEITY_IMAGE_MAPPING;
      const deityFallback = EXPLICIT_DEITY_IMAGE_MAPPING[deityKey]?.fallback;
      if (deityFallback && deityFallback !== currentSrc) {
        setHasTriedFallback(true);
        setCurrentSrc(deityFallback);
        setIsLoading(true);
        return;
      }
    }

    // 3. Fall back to sacred deity emblem (no broken image icon, no cross-deity mapping)
    setIsFailed(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const aspectClass =
    aspectRatio === '4/5'
      ? 'aspect-[4/5]'
      : aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : '';

  const overlayClass =
    overlay === 'subtle'
      ? 'bg-gradient-to-t from-black/70 via-black/20 to-transparent'
      : overlay === 'card'
      ? 'bg-gradient-to-t from-black/90 via-black/40 to-transparent'
      : overlay === 'hero'
      ? 'bg-gradient-to-t from-black/95 via-black/50 to-black/20'
      : '';

  const emblem = DEITY_SACRED_EMBLEMS[deity] || DEITY_SACRED_EMBLEMS.Universal;

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative overflow-hidden ${aspectClass} ${className}`}
    >
      {/* 1. Loading shimmer placeholder */}
      {isLoading && !isFailed && (
        <div className="absolute inset-0 bg-neutral-900 animate-pulse flex items-center justify-center z-10 pointer-events-none">
          <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-[#C99A4A] animate-spin opacity-40" />
        </div>
      )}

      {/* 2. Primary / Fallback Image */}
      {!isFailed ? (
        <img
          src={currentSrc}
          alt={alt}
          onError={handleError}
          onLoad={handleLoad}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover ${focalPoint} ${imgClassName} ${
            isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          } transition-all duration-500`}
        />
      ) : (
        /* 3. Infallible Emergency Fallback (Never shows broken image icon or alt text) */
        <div
          className={`w-full h-full bg-gradient-to-br ${emblem.bgGradient} flex flex-col items-center justify-center p-4 text-center select-none`}
        >
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-xl mb-2 shadow-inner">
            <span>{emblem.symbol}</span>
          </div>
          <span className="font-serif text-xs text-[#E8D8B8] font-normal tracking-wide">
            {emblem.label}
          </span>
          <span className="text-[10px] text-neutral-500 font-sans mt-0.5 max-w-[85%] truncate">
            {alt}
          </span>
        </div>
      )}

      {/* 4. Dark gradient overlay for text readability */}
      {overlay !== 'none' && (
        <div className={`absolute inset-0 pointer-events-none ${overlayClass}`} />
      )}

      {/* 5. Custom children positioned over the image */}
      {children}
    </div>
  );
};
