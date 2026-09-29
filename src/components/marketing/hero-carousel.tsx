'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string;
  imageAlt: string;
  /** Second, lower-emphasis link shown next to the primary CTA. */
  secondaryLabel?: string;
  secondaryHref?: string;
}

// Editable marketing content for the homepage hero. Swap these for
// backend-driven promo banners later (see Store.bannerUrl) without
// touching the carousel mechanics below.
const SLIDES: HeroSlide[] = [
  {
    id: 'shop-independent',
    eyebrow: 'The marketplace',
    title: "Shop from independent stores, all in one place",
    subtitle: "Every purchase supports a real small business. Browse thousands of handpicked products from vendors you can trust.",
    ctaLabel: 'Browse all products',
    ctaHref: '/products',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1920&auto=format&fit=crop',
    imageAlt: 'Shelves of colorful handmade goods in a small shop',
  },
  {
    id: 'new-arrivals',
    eyebrow: "What's new",
    title: 'Fresh finds, every single week',
    subtitle: 'New vendors and new products join the marketplace all the time — be the first to discover them.',
    ctaLabel: 'See new arrivals',
    ctaHref: '/products?sort=newest',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1920&auto=format&fit=crop',
    imageAlt: 'Red and black gift bags laid out on a dark background',
  },
  {
    id: 'become-a-seller',
    eyebrow: 'For sellers',
    title: 'Have something to sell? Open your store today',
    subtitle: "Join thousands of vendors already growing their business here. It's free to get started.",
    ctaLabel: 'Become a seller',
    ctaHref: '/sell',
    imageUrl: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1920&auto=format&fit=crop',
    imageAlt: 'A small business owner checking out a customer at their store counter',
  },
  {
    id: 'secure-checkout',
    eyebrow: 'Shop with confidence',
    title: 'Fast, secure checkout every time',
    subtitle: 'Verified vendors, protected payments, and real support — so you can shop worry-free.',
    ctaLabel: 'Start shopping',
    ctaHref: '/products',
    secondaryLabel: 'How it works',
    secondaryHref: '/products',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1920&auto=format&fit=crop',
    imageAlt: 'Person paying for an order securely on a laptop',
  },
];

const AUTOPLAY_MS = 6000;

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = SLIDES.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    setActive(((index % count) + count) % count);
  }, [count]);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (paused) return;
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    timerRef.current = setInterval(() => {
      setActive((current) => (current + 1) % count);
    }, AUTOPLAY_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, count]);

  return (
    <section
      className="relative h-[440px] w-full overflow-hidden bg-ink sm:h-[500px] md:h-[560px] lg:h-[620px]"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
      }}
    >
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-700 ease-in-out',
            index === active ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
          aria-hidden={index !== active}
        >
          <Image
            src={slide.imageUrl}
            alt={slide.imageAlt}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/20" />

          <div className="container relative flex h-full items-center">
            <div className="max-w-xl space-y-4">
              <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
                {slide.eyebrow}
              </span>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-4xl md:text-5xl">
                {slide.title}
              </h1>
              <p className="max-w-md text-base text-white/85 sm:text-lg">{slide.subtitle}</p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button asChild size="lg">
                  <Link href={slide.ctaHref}>{slide.ctaLabel}</Link>
                </Button>
                {slide.secondaryLabel && slide.secondaryHref && (
                  <Button asChild variant="outline" size="lg" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
                    <Link href={slide.secondaryHref}>{slide.secondaryLabel}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Prev / next controls */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-2">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1} of ${count}`}
            aria-current={index === active}
            className={cn(
              'h-2 rounded-full transition-all',
              index === active ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75',
            )}
          />
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {`Slide ${active + 1} of ${count}: ${SLIDES[active]?.title ?? ''}`}
      </p>
    </section>
  );
}
