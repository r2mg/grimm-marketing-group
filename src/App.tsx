import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

const EMAIL = "patrick@xxxxxx.com";
const PODCAST_MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(
  "I would like to be a guest on the podcast.",
)}`;
const CONTACT_MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(
  "I'd like to learn more about Grimm Marketing Group",
)}`;

const SERVICES: { code: string; label: string; band: "broadcast" | "digital" | "strategy" }[] = [
  { code: "01", label: "Television Placement", band: "broadcast" },
  { code: "02", label: "Radio Placement", band: "broadcast" },
  { code: "03", label: "Outdoor Placement", band: "broadcast" },
  { code: "04", label: "Digital & Web Design Services", band: "digital" },
  { code: "05", label: "Social Media & Marketing Services", band: "digital" },
  { code: "06", label: "Strategic Marketing Guidance", band: "strategy" },
];

const NAV = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

/**
 * Optional photography for the About + Services column (file in `public/`, e.g. `"/team.jpg"`).
 * When unset, a textural brand panel (rings + gradient) is shown instead of a raster image.
 */
const ABOUT_SECTION_IMAGE: string | null = null;

/** Vertical scroll (px) past which the back-to-top control is shown. */
const BACK_TO_TOP_AFTER_PX = 400;

const PALETTE_STORAGE_KEY = "gmg-palette";

type PaletteMode = "heritage" | "brand";

function readStoredPalette(): PaletteMode {
  if (typeof window === "undefined") return "heritage";
  return localStorage.getItem(PALETTE_STORAGE_KEY) === "brand" ? "brand" : "heritage";
}

/**
 * Testimonial decorative rings are absolutely positioned with negative `bottom`, so they extend
 * past the section’s layout box. `getBoundingClientRect()` on `#testimonials` ends above that
 * overflow; include extra space below so pointer-over-rings still counts as “in section.”
 */
const TESTIMONIAL_MOUSE_EXTRA_BELOW_PX = 280;

function cn(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/** Brand marks for footer social links (SVG, currentColor). */
function SocialLogoX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SocialLogoFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function SocialLogoLinkedIn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function SignalRingSeal({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none select-none", className)} aria-hidden>
      <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
        <circle cx="100" cy="100" r="96" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="100" cy="100" r="78" stroke="currentColor" strokeWidth="0.5" opacity="0.65" />
        <circle cx="100" cy="100" r="58" stroke="currentColor" strokeWidth="0.5" opacity="0.45" />
        <circle cx="100" cy="100" r="38" stroke="currentColor" strokeWidth="0.35" opacity="0.35" />
      </svg>
    </div>
  );
}

function SectionShell({
  id,
  children,
  className,
  innerClassName,
  as: Tag = "section",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  as?: "section" | "div" | "footer";
}) {
  const Comp = Tag;
  return (
    <Comp id={id} className={cn("scroll-mt-24 md:scroll-mt-28", className)}>
      <div className={cn("mx-auto w-full max-w-content px-5 sm:px-8 lg:px-10", innerClassName)}>
        {children}
      </div>
    </Comp>
  );
}

function PrimaryButton({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center border border-ink bg-ink px-6 py-3 text-sm font-semibold tracking-wide text-parchment transition-colors duration-200",
        "hover:border-heritage hover:bg-heritage hover:text-ink",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heritage",
        className,
      )}
    >
      {children}
    </a>
  );
}

function AboutSectionVisual({ palette }: { palette: PaletteMode }) {
  if (ABOUT_SECTION_IMAGE) {
    return (
      <div className="overflow-hidden rounded-sm border border-stone-200 bg-stone-100 shadow-sm">
        <img
          src={ABOUT_SECTION_IMAGE}
          alt="Grimm Marketing Group"
          className="aspect-[4/5] w-full object-cover sm:max-lg:aspect-[16/10]"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-sm border border-stone-300 bg-gradient-to-br from-stone-800 via-stone-900 to-ink shadow-md"
      role="img"
      aria-label="Brand motif: gold signal rings on a deep neutral field"
    >
      <div
        className={
          palette === "brand"
            ? "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_25%,rgba(212,175,55,0.18),transparent_55%)]"
            : "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_25%,rgba(201,162,39,0.14),transparent_55%)]"
        }
      />
      <SignalRingSeal
        className={cn(
          "absolute -right-[22%] top-1/2 h-[125%] min-h-[16rem] w-[125%] min-w-[16rem] -translate-y-1/2",
          palette === "brand" ? "text-lineStrong/55" : "text-heritage/35",
        )}
      />
      <div className="relative flex aspect-[4/5] flex-col justify-end gap-2 p-6 sm:aspect-[16/10] sm:max-lg:p-8 lg:aspect-[4/5] lg:p-7">
        <p
          className={cn(
            "font-mono text-[10px] uppercase tracking-[0.28em]",
            palette === "brand" ? "text-heritage" : "text-heritage-soft/95",
          )}
        >
          Services snapshot
        </p>
        <p className="max-w-[20ch] font-display text-[1.35rem] font-semibold leading-snug tracking-tight text-parchment sm:text-xl">
          Placement, digital, and guidance in one relationship.
        </p>
        <div
          className={cn(
            "mt-4 h-px max-w-[4.5rem] bg-gradient-to-r to-transparent",
            palette === "brand" ? "from-heritage-muted" : "from-heritage",
          )}
        />
      </div>
    </div>
  );
}

const SERVICE_GROUP_LABELS: {
  band: (typeof SERVICES)[number]["band"];
  title: string;
}[] = [
  { band: "broadcast", title: "Broadcast & outdoor" },
  { band: "digital", title: "Digital" },
  { band: "strategy", title: "Strategy" },
];

function ServicesGrouped() {
  return (
    <div
      id="services"
      className="scroll-mt-24 space-y-9 border-t border-stone-200 pt-9 md:scroll-mt-28 lg:space-y-10 lg:border-0 lg:pt-0"
    >
      {SERVICE_GROUP_LABELS.map((group) => {
        const rows = SERVICES.filter((s) => s.band === group.band);
        return (
          <section key={group.band} aria-labelledby={`svc-${group.band}`}>
            <h3 id={`svc-${group.band}`} className="flex items-center gap-3">
              <span className="h-px w-6 bg-heritage/80" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-500">{group.title}</span>
            </h3>
            <ul className="mt-4 space-y-3 text-stone-800">
              {rows.map((svc) => (
                <li key={svc.code} className="flex gap-3 sm:gap-4">
                  <span className="mt-0.5 shrink-0 font-mono text-[11px] tabular-nums text-heritage-muted">{svc.code}</span>
                  <span className="font-display text-lg font-medium leading-snug tracking-tight text-ink">{svc.label}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

type PointerOffset = { x: number; y: number };

export default function App() {
  const [palette, setPalette] = useState<PaletteMode>(readStoredPalette);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const menuId = useId();
  const headerRef = useRef<HTMLElement | null>(null);
  const lastScrollY = useRef(0);

  /** Hero rings: offset normalized to the viewport (full browser width/height), not the narrow content column. */
  const [ringOffset, setRingOffset] = useState<PointerOffset>({ x: 0, y: 0 });
  const ringRaf = useRef<number | null>(null);
  const ringTarget = useRef<PointerOffset>({ x: 0, y: 0 });
  const reduceMotion = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useLayoutEffect(() => {
    document.documentElement.dataset.palette = palette;
    try {
      localStorage.setItem(PALETTE_STORAGE_KEY, palette);
    } catch {
      /* ignore quota / private mode */
    }
  }, [palette]);

  const scrollToTop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({
      top: 0,
      behavior: reduceMotion.current ? "auto" : "smooth",
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || reduceMotion.current) return;

    const flush = () => {
      if (ringRaf.current != null) return;
      ringRaf.current = requestAnimationFrame(() => {
        ringRaf.current = null;
        setRingOffset({ ...ringTarget.current });
      });
    };

    const onMove = (e: MouseEvent) => {
      const home = document.getElementById("home");
      const testimonials = document.getElementById("testimonials");
      const homeRect = home?.getBoundingClientRect();
      const inHeroVertically =
        !!homeRect && e.clientY >= homeRect.top && e.clientY <= homeRect.bottom;
      const tt = testimonials?.getBoundingClientRect();
      const inTestimonialVertically =
        !!tt &&
        e.clientY >= tt.top &&
        e.clientY <= tt.bottom + TESTIMONIAL_MOUSE_EXTRA_BELOW_PX;

      if (!inHeroVertically && !inTestimonialVertically) {
        if (ringTarget.current.x !== 0 || ringTarget.current.y !== 0) {
          ringTarget.current = { x: 0, y: 0 };
          flush();
        }
        return;
      }

      const w = Math.max(window.innerWidth, 1);
      const h = Math.max(window.innerHeight, 1);
      ringTarget.current = {
        x: ((e.clientX / w) - 0.5) * 2,
        y: ((e.clientY / h) - 0.5) * 2,
      };
      flush();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (ringRaf.current != null) {
        cancelAnimationFrame(ringRaf.current);
        ringRaf.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) setNavHidden(false);
  }, [menuOpen]);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    setHeaderHeight(el.offsetHeight);
  }, [menuOpen]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const sync = () => setHeaderHeight(el.offsetHeight);
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [menuOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const y0 = window.scrollY;
    lastScrollY.current = y0;
    setShowBackToTop(y0 > BACK_TO_TOP_AFTER_PX);
    const edge = 6;
    const topReveal = 48;
    const onScroll = () => {
      const y = window.scrollY;
      setShowBackToTop(y > BACK_TO_TOP_AFTER_PX);
      if (menuOpen) {
        lastScrollY.current = y;
        return;
      }
      const delta = y - lastScrollY.current;
      lastScrollY.current = y;
      if (y < topReveal) {
        setNavHidden(false);
        return;
      }
      if (delta > edge) setNavHidden(true);
      else if (delta < -edge) setNavHidden(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-parchment">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-parchment focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      <div aria-hidden className="shrink-0" style={{ height: headerHeight }} />

      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b border-stone-200/80 bg-parchment/95 backdrop-blur supports-[backdrop-filter]:bg-parchment/90",
          !reduceMotion.current && "transition-transform duration-300 ease-out",
          navHidden && !menuOpen && "-translate-y-full",
        )}
      >
        <div className="mx-auto flex max-w-content items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-10">
          <a
            href="#home"
            className="inline-flex min-w-0 max-w-[calc(100vw-8.5rem)] shrink-0 items-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heritage sm:max-w-none"
          >
            <img
              src="/gmg-logo-rings.png"
              alt="Grimm Marketing Group"
              width={40}
              height={40}
              className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10 lg:hidden"
              decoding="async"
            />
            <img
              src="/gmg-logo.png"
              alt="Grimm Marketing Group"
              width={240}
              height={48}
              className="hidden h-10 w-auto max-h-11 object-contain object-left lg:block"
              decoding="async"
            />
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-stone-600 transition-colors hover:text-ink"
              >
                {item.label}
              </a>
            ))}
            <PrimaryButton href="#contact" className="px-5 py-2.5 text-xs uppercase tracking-wider">
              Request a Consultation
            </PrimaryButton>
          </nav>

          <div className="flex items-center gap-3 md:hidden">
            <PrimaryButton href="#contact" className="px-4 py-2 text-xs uppercase tracking-wider">
              Request a Consultation
            </PrimaryButton>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center border border-stone-300 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-parchment"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="sr-only">{menuOpen ? "Close" : "Menu"}</span>
              <span className="flex flex-col gap-1.5" aria-hidden>
                <span
                  className={cn(
                    "block h-0.5 w-5 bg-current transition-[transform] will-change-transform",
                    !reduceMotion.current && "duration-300 ease-in-out",
                    menuOpen && "translate-y-2 rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 w-5 bg-current transition-opacity",
                    !reduceMotion.current && "duration-300 ease-in-out",
                    menuOpen && "opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 w-5 bg-current transition-[transform] will-change-transform",
                    !reduceMotion.current && "duration-300 ease-in-out",
                    menuOpen && "-translate-y-2 -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>

        <div
          className={cn(
            "relative z-10 grid md:hidden",
            !reduceMotion.current && "transition-[grid-template-rows] duration-300 ease-in-out",
            menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              id={menuId}
              className={cn(
                "border-t border-stone-200 bg-parchment",
                !menuOpen && "pointer-events-none",
              )}
              aria-hidden={!menuOpen}
            >
              <nav className="mx-auto flex max-w-content flex-col gap-1 px-5 py-4" aria-label="Mobile primary">
                {NAV.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="border-b border-stone-100 py-3 text-base font-medium text-stone-700 last:border-b-0 hover:text-ink"
                    onClick={closeMenu}
                    tabIndex={menuOpen ? undefined : -1}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero — rings use window mouse + viewport math (edge‑to‑edge); #home is full browser width */}
        <SectionShell
          id="home"
          as="div"
          className="relative overflow-hidden border-b border-stone-200 bg-parchment"
          innerClassName="relative py-20 sm:py-24 lg:py-28"
        >
          {/* Viewport-based min-height + flex centers copy and absolutely positioned rings on mobile, tablet, and desktop */}
          <div className="relative flex min-h-[min(72svh,28rem)] flex-col justify-center sm:min-h-[min(68svh,32rem)] lg:min-h-[min(62svh,36rem)]">
            <div
              className={cn(
                "pointer-events-none absolute -right-[41%] top-1/2 z-0 h-[min(100vw,55rem)] w-[min(100vw,55rem)] -translate-y-1/2 select-none sm:-right-[26%] sm:h-[min(220vw,60rem)] sm:w-[min(220vw,60rem)] lg:-right-[10%] lg:h-[min(130vw,70rem)] lg:w-[min(130vw,70rem)]",
                /* Classic: original gold rings + slightly higher group opacity so they stay visible on parchment. */
                palette === "brand" ? "opacity-100" : "opacity-[0.32]",
              )}
              aria-hidden
            >
              {palette === "brand" ? (
                <>
                  <div
                    className="absolute inset-0 rounded-full border-2 border-lineStrong/88 will-change-transform"
                    style={{
                      transform: `translate3d(${ringOffset.x * 10}px, ${ringOffset.y * 8}px, 0)`,
                      transition: reduceMotion.current ? undefined : "transform 50ms linear",
                    }}
                  />
                  <div
                    className="absolute inset-[16.85%] rounded-full border-2 border-lineStrong/78 will-change-transform"
                    style={{
                      transform: `translate3d(${ringOffset.x * 20}px, ${ringOffset.y * 13}px, 0)`,
                      transition: reduceMotion.current ? undefined : "transform 50ms linear",
                    }}
                  />
                  <div
                    className="absolute inset-[27.9%] rounded-full border-2 border-lineStrong/66 will-change-transform"
                    style={{
                      transform: `translate3d(${ringOffset.x * 30}px, ${ringOffset.y * 20}px, 0)`,
                      transition: reduceMotion.current ? undefined : "transform 50ms linear",
                    }}
                  />
                </>
              ) : (
                <>
                  <div
                    className="absolute inset-0 rounded-full border-2 border-heritage-muted will-change-transform"
                    style={{
                      transform: `translate3d(${ringOffset.x * 10}px, ${ringOffset.y * 8}px, 0)`,
                      transition: reduceMotion.current ? undefined : "transform 50ms linear",
                    }}
                  />
                  <div
                    className="absolute inset-[16.85%] rounded-full border-2 border-heritage will-change-transform"
                    style={{
                      transform: `translate3d(${ringOffset.x * 20}px, ${ringOffset.y * 13}px, 0)`,
                      transition: reduceMotion.current ? undefined : "transform 50ms linear",
                    }}
                  />
                  <div
                    className="absolute inset-[27.9%] rounded-full border-2 border-heritage-soft will-change-transform"
                    style={{
                      transform: `translate3d(${ringOffset.x * 30}px, ${ringOffset.y * 20}px, 0)`,
                      transition: reduceMotion.current ? undefined : "transform 50ms linear",
                    }}
                  />
                </>
              )}
            </div>
            <div className="relative z-10 max-w-3xl">
              <h1 className="max-w-[20ch] font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Marketing Support Built Around Your Business
              </h1>
              <p className="mt-8 max-w-measure text-lg leading-relaxed text-stone-600 sm:text-xl">
                Grimm Marketing Group helps businesses clarify their message, strengthen their visibility, and build
                marketing efforts that fit their goals, audience, and budget.
              </p>
              <p className="mt-6 max-w-measure text-base leading-relaxed text-stone-600">
                With experience across traditional and digital channels, we provide personalized marketing support focused
                on clear communication, practical strategy, and strong client relationships.
              </p>
              <div className="mt-10">
                <PrimaryButton href="#contact">Request a Consultation</PrimaryButton>
              </div>
            </div>
          </div>
        </SectionShell>

        {/* About + Services — visual column is photo OR brand panel; services are grouped lists (not the former “signal rail”) */}
        <SectionShell className="border-b border-stone-200 bg-stone-50" innerClassName="py-20 sm:py-24">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16 lg:items-start">
            <div id="about" className="scroll-mt-24 md:scroll-mt-28">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:max-w-[18ch]">
                Marketing That’s Personal, Practical, and Built to Fit
              </h2>
              <div className="mt-8 space-y-6 text-base leading-relaxed text-stone-600">
                <p>
                  Grimm Marketing Group is built around personalized service and customized marketing support. The focus
                  is on helping clients communicate clearly, choose the right marketing channels, and build a plan that
                  fits their business and budget.
                </p>
                <p className="font-medium text-stone-700">
                  Services may include support across traditional and digital media, depending on the client’s needs:
                </p>
              </div>
            </div>
            <div className="grid gap-10 sm:gap-12 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] lg:gap-10 xl:gap-12">
              <AboutSectionVisual palette={palette} />
              <div className="flex min-h-0 flex-col">
                <ServicesGrouped />
                <p className="mt-10 max-w-measure border-t border-stone-200 pt-10 text-base leading-relaxed text-stone-600">
                  Whether the need is broad visibility, stronger messaging, or a more coordinated marketing effort, the
                  work is shaped around what makes the most sense for the client.
                </p>
              </div>
            </div>
          </div>
        </SectionShell>

        {/* Why */}
        <SectionShell className="border-b border-stone-200 bg-parchment" innerClassName="py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Why Clients Work With Grimm Marketing Group
              </h2>
            </div>
            <div className="lg:col-span-7">
              <div className="space-y-6 text-base leading-relaxed text-stone-600">
                <p>
                  Grimm Marketing Group is a relationship-driven agency centered on direct communication, personalized
                  attention, and customized service.
                </p>
                <p>
                  Clients work directly with Patrick Grimm to develop marketing efforts that reflect their goals, market,
                  and message. Rather than offering a one-size-fits-all approach, the emphasis is on listening carefully,
                  building strong working relationships, and creating marketing support that feels practical and
                  tailored.
                </p>
              </div>
              <ul className="mt-10 space-y-4 border-t border-stone-200 pt-10">
                {[
                  "Direct, one-on-one client relationship",
                  "Customized support based on your business and budget",
                  "Experience across traditional and digital media",
                  "A practical, personal approach to marketing",
                ].map((line) => (
                  <li key={line} className="flex gap-4 text-base text-stone-700">
                    <span className="mt-1.5 h-2 w-2 shrink-0 bg-heritage" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionShell>

        {/* Testimonial — rings reuse hero parallax (see mousemove + #testimonials bounds) */}
        <SectionShell
          id="testimonials"
          className="relative overflow-hidden border-b border-stone-200 bg-stone-50"
          innerClassName="py-20 sm:py-24"
        >
          <div
            className="pointer-events-none absolute -left-28 bottom-[-4rem] h-80 w-80 select-none sm:h-96 sm:w-96 lg:left-[-6%] lg:bottom-[-18%]"
            aria-hidden
          >
            {palette === "brand" ? (
              <>
                <div
                  className="absolute inset-0 rounded-full border border-lineStrong/82 will-change-transform"
                  style={{
                    transform: `translate3d(${ringOffset.x * 8}px, ${ringOffset.y * 6}px, 0)`,
                    transition: reduceMotion.current ? undefined : "transform 50ms linear",
                  }}
                />
                <div
                  className="absolute inset-[16.85%] rounded-full border border-lineStrong/74 will-change-transform"
                  style={{
                    transform: `translate3d(${ringOffset.x * 16}px, ${ringOffset.y * 11}px, 0)`,
                    transition: reduceMotion.current ? undefined : "transform 50ms linear",
                  }}
                />
                <div
                  className="absolute inset-[27.9%] rounded-full border border-lineStrong/66 will-change-transform"
                  style={{
                    transform: `translate3d(${ringOffset.x * 24}px, ${ringOffset.y * 16}px, 0)`,
                    transition: reduceMotion.current ? undefined : "transform 50ms linear",
                  }}
                />
              </>
            ) : (
              <>
                <div
                  className="absolute inset-0 rounded-full border border-heritage-muted/50 will-change-transform"
                  style={{
                    transform: `translate3d(${ringOffset.x * 8}px, ${ringOffset.y * 6}px, 0)`,
                    transition: reduceMotion.current ? undefined : "transform 50ms linear",
                  }}
                />
                <div
                  className="absolute inset-[16.85%] rounded-full border border-heritage/45 will-change-transform"
                  style={{
                    transform: `translate3d(${ringOffset.x * 16}px, ${ringOffset.y * 11}px, 0)`,
                    transition: reduceMotion.current ? undefined : "transform 50ms linear",
                  }}
                />
                <div
                  className="absolute inset-[27.9%] rounded-full border border-heritage-soft/40 will-change-transform"
                  style={{
                    transform: `translate3d(${ringOffset.x * 24}px, ${ringOffset.y * 16}px, 0)`,
                    transition: reduceMotion.current ? undefined : "transform 50ms linear",
                  }}
                />
              </>
            )}
          </div>
          <div className="relative">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              What Clients Have Said
            </h2>
            <figure className="mt-12 max-w-3xl">
              <blockquote className="font-display text-2xl font-medium leading-snug text-ink sm:text-3xl">
                {`"Hands down, the best advertising agency I have ever worked with. Grimm Marketing Group has without a doubt improved our bottom line and helped our business grow."`}
              </blockquote>
              <figcaption className="mt-8 border-l-2 border-heritage pl-6 text-sm text-stone-600">
                <span className="font-semibold text-ink">Steve Vucovich</span>
                <span className="mx-2 text-stone-400">·</span>
                Owner, Apple Athletic Club
              </figcaption>
            </figure>
          </div>
        </SectionShell>

        {/* Podcast */}
        <SectionShell className="border-b border-stone-200 bg-ink text-parchment" innerClassName="py-20 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
            <div>
              <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                New Conversations. New Platforms. Same Commitment to Story.
              </h2>
              <div
                className={cn(
                  "mt-8 space-y-6 text-base leading-relaxed",
                  palette === "brand" ? "text-parchment/85" : "text-stone-200",
                )}
              >
                <p>
                  We are always exploring new ways to create and share meaningful conversations through long-form
                  storytelling, so we’re starting a podcast!
                </p>
                <p>
                  As that platform develops, it will reflect the same values behind our work: insight, relationship-building,
                  resilience, and message clarity. We are currently looking for business leaders and other experts to join
                  us as guests of the show. If you&apos;re interested, contact us below.
                </p>
              </div>
            </div>
            <div className="flex items-end border border-stone-600 bg-stone-800/40 p-8 sm:p-10">
              <a
                href={PODCAST_MAILTO}
                className={cn(
                  "inline-flex w-full items-center justify-center border px-6 py-3 text-center text-sm font-semibold transition-colors",
                  palette === "brand"
                    ? "border-heritage bg-heritage text-ink hover:brightness-110"
                    : "border-heritage bg-heritage text-ink hover:bg-heritage-soft hover:text-ink",
                )}
              >
                Be a Guest
              </a>
            </div>
          </div>
        </SectionShell>

        {/* Contact */}
        <SectionShell id="contact" className="bg-parchment" innerClassName="py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Let’s Talk</h2>
              <p className="mt-6 max-w-measure text-base leading-relaxed text-stone-600">
                If you are looking for personalized marketing support and a plan that fits your business, Grimm Marketing
                Group would be glad to start the conversation.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="border border-stone-200 bg-panel p-8 sm:p-10">
                <dl className="space-y-5 text-base text-stone-700">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">Name</dt>
                    <dd className="mt-1 font-display text-xl text-ink">Patrick Grimm</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">Phone</dt>
                    <dd className="mt-1 text-ink">208-XXX-XXXX</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">Email</dt>
                    <dd className="mt-1">
                      <a className="break-all hover:text-ink" href={`mailto:${EMAIL}`}>
                        patrick@xxxxxx.com
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">Web</dt>
                    <dd className="mt-1">
                      <a className="break-all hover:text-ink" href="https://www.xxxxxx.com">
                        www.xxxxxx.com
                      </a>
                    </dd>
                  </div>
                </dl>
                <div className="mt-10">
                  <PrimaryButton href={CONTACT_MAILTO} className="w-full sm:w-auto">
                    Send a Message
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        </SectionShell>
      </main>

      <footer className="border-t border-stone-200 bg-stone-50">
        <SectionShell as="footer" innerClassName="py-14 sm:py-16">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-md">
              <a
                href="#home"
                className="inline-flex rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heritage"
              >
                <img
                  src="/gmg-logo-footer.png"
                  alt="Grimm Marketing Group"
                  width={280}
                  height={52}
                  className="h-9 w-auto max-w-[min(100%,18rem)] object-contain object-left sm:h-10 sm:max-w-none"
                  decoding="async"
                />
              </a>
              <p className="mt-4 text-sm leading-relaxed text-stone-600">
                Personalized marketing support built around strategy, communication, and client relationships.
              </p>
            </div>
            <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-stone-600" aria-label="Footer">
              {NAV.map((item) => (
                <a key={item.href} href={item.href} className="hover:text-ink">
                  {item.label}
                </a>
              ))}
            </nav>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">Social</p>
              <div className="mt-3 flex items-center gap-2 sm:gap-3">
                <a
                  className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-ink transition-colors hover:text-heritage-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heritage"
                  href="https://x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                >
                  <SocialLogoX className="h-5 w-5" />
                </a>
                <a
                  className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-ink transition-colors hover:text-heritage-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heritage"
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <SocialLogoFacebook className="h-5 w-5" />
                </a>
                <a
                  className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-ink transition-colors hover:text-heritage-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heritage"
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <SocialLogoLinkedIn className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-stone-200 pt-8">
            <button
              type="button"
              onClick={() => setPalette((p) => (p === "heritage" ? "brand" : "heritage"))}
              className="text-left text-sm font-medium text-stone-600 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-ink"
              aria-label={
                palette === "heritage"
                  ? "Switch to the original yellow and black brand colors"
                  : "Switch back to the classic site color palette"
              }
            >
              {palette === "heritage"
                ? "Original brand colors (yellow & black)"
                : "Classic site palette"}
            </button>
          </div>
        </SectionShell>
      </footer>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        tabIndex={showBackToTop ? 0 : -1}
        className={cn(
          "fixed bottom-6 right-5 z-40 flex h-11 w-11 items-center justify-center border border-ink bg-ink text-parchment shadow-lg",
          "hover:border-heritage hover:bg-heritage hover:text-ink",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heritage",
          !reduceMotion.current && "transition-opacity duration-200",
          showBackToTop ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <svg
          className="h-5 w-5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
