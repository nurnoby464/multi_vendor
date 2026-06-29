"use client";

import * as React from "react";
import { ShoppingCart, Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { SearchBar } from "@/components/molecules/SearchBar";
import { NavLink } from "@/components/molecules/NavLink";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Avatar } from "@/components/atoms/Avatar";
import { ThemeToggle } from "@/components/atoms/ThemeToggle"; // ← atom
import { cn, customColorVars } from "@/lib/utils";
import {
  isCustomColor,
  type ColorProp,
  type ColorToken,
  type SizeToken,
} from "@/lib/types";
import Link from "next/link";

/* ─── Types ──────────────────────────────────────────────────── */

export interface NavItem {
  label: string;
  href?: string;
  active?: boolean;
  /** Sub-menu links */
  children?: Omit<NavItem, "children">[];
  onClick?: () => void;
}

export interface NavbarUser {
  name: string;
  avatarSrc?: string;
}

export interface NavbarProps {
  /** Brand logo — image URL or React node */
  logo?: React.ReactNode;
  /** Brand name shown when no logo image provided */
  brandName?: string;
  navItems?: NavItem[];
  /** Search bar config */
  searchPlaceholder?: string;
  searchSuggestions?: string[];
  onSearch?: (value: string) => void;
  /** Icon counts */
  cartCount?: number;
  wishlistCount?: number;
  /** Authenticated user — shows avatar; otherwise shows Sign In button */
  user?: NavbarUser;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
  onUserClick?: () => void;
  onSignInClick?: () => void;
  /** Whether the bar is stuck to the top (scroll-aware sticky) */
  sticky?: boolean;
  /**
   * Show the light/dark mode toggle button in the icon action row.
   * Defaults to true. Pass false to hide it (e.g. when you render
   * <ThemeToggle /> somewhere else in the layout).
   */
  showThemeToggle?: boolean;
  color?: ColorProp;
  size?: SizeToken;
  className?: string;
}

/* ─── Size maps ──────────────────────────────────────────────── */

const barHeight: Record<SizeToken, string> = {
  xs: "h-12",
  sm: "h-14",
  md: "h-16",
  lg: "h-18",
  xl: "h-20",
};

const iconBtn: Record<SizeToken, string> = {
  xs: "h-7 w-7",
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-10 w-10",
  xl: "h-11 w-11",
};

const iconPx: Record<SizeToken, number> = {
  xs: 16,
  sm: 18,
  md: 20,
  lg: 22,
  xl: 24,
};

const tokenBgMap: Record<ColorToken, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  neutral: "bg-neutral",
};

/* ─── Sub-components ─────────────────────────────────────────── */

function IconButton({
  label,
  icon: Icon,
  count,
  size = "md",
  color,
  onClick,
  className,
}: {
  label: string;
  icon: React.ElementType;
  count?: number;
  size?: SizeToken;
  color?: ColorProp;
  onClick?: () => void;
  className?: string;
}) {
  const isCustom = isCustomColor(color);
  const colorToken = isCustom
    ? "primary"
    : ((color as ColorToken) ?? "primary");

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full",
        "text-text-muted hover:text-text transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        iconBtn[size],
        className,
      )}
    >
      <Icon size={iconPx[size]} aria-hidden />
      {typeof count === "number" && count > 0 && (
        <span
          className={cn(
            "absolute -top-0.5 -right-0.5 flex h-4 min-w-[1rem] items-center",
            "justify-center rounded-full px-0.5 text-[9px] font-bold text-white",
            isCustom ? "bg-[var(--ds-bg)]" : tokenBgMap[colorToken],
          )}
          style={isCustom ? customColorVars(color) : undefined}
          aria-label={`${count} items`}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */

export function Navbar({
  logo,
  brandName = "Brand",
  navItems = [],
  searchPlaceholder = "Search products…",
  searchSuggestions = [],
  onSearch,
  cartCount,
  wishlistCount,
  user,
  onCartClick,
  onWishlistClick,
  onUserClick,
  onSignInClick,
  sticky = true,
  showThemeToggle = true,
  color = "primary",
  size = "md",
  className,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const [scrolled, setScrolled] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  /* Scroll shadow */
  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 4);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close dropdown on outside click */
  React.useEffect(() => {
    function handleOut(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleOut);
    return () => document.removeEventListener("mousedown", handleOut);
  }, []);

  /* Close mobile on resize */
  React.useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setMobileOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isCustom = isCustomColor(color);

  return (
    <>
      <header
        className={cn(
          "w-full z-40 bg-surface border-b border-border",
          sticky && "sticky top-0",
          scrolled && "shadow-[0_2px_12px_rgba(46,50,48,0.08)]",
          "transition-shadow duration-200",
          className,
        )}
        style={isCustom ? customColorVars(color) : undefined}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={cn("flex items-center gap-3 sm:gap-4", barHeight[size])}
          >
            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className={cn(
                "md:hidden inline-flex items-center justify-center rounded-md text-text-muted",
                "hover:text-text hover:bg-bg transition-colors",
                iconBtn[size],
              )}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? (
                <X size={iconPx[size]} aria-hidden />
              ) : (
                <Menu size={iconPx[size]} aria-hidden />
              )}
            </button>

            {/* Logo */}
            <Link
              href="/"
              aria-label={`${brandName} home`}
              className="shrink-0 flex items-center gap-2 font-bold text-text text-lg leading-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded-sm"
            >
              {logo ?? (
                <span
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold",
                    isCustom
                      ? "bg-[var(--ds-bg)]"
                      : tokenBgMap[(color as ColorToken) ?? "primary"],
                  )}
                  style={isCustom ? customColorVars(color) : undefined}
                >
                  {brandName.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="hidden sm:block">{brandName}</span>
            </Link>

            {/* Desktop nav links */}
            {navItems.length > 0 && (
              <nav
                ref={dropdownRef}
                aria-label="Main navigation"
                className="hidden md:flex items-center gap-1"
              >
                {navItems.map((item) => (
                  <div key={item.label} className="relative">
                    {item.children?.length ? (
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdown((d) =>
                            d === item.label ? null : item.label,
                          )
                        }
                        className={cn(
                          "inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md",
                          "text-text-muted hover:text-text hover:bg-bg transition-colors",
                          item.active && "text-text",
                        )}
                        aria-expanded={openDropdown === item.label}
                        aria-haspopup="menu"
                      >
                        {item.label}
                        <ChevronDown
                          size={14}
                          className={cn(
                            "transition-transform duration-200",
                            openDropdown === item.label && "rotate-180",
                          )}
                          aria-hidden
                        />
                      </button>
                    ) : (
                      <NavLink
                        href={item.href}
                        color={color}
                        size={size}
                        asButton={!item.href}
                        className="px-3 py-1.5"
                        {...(item.active !== undefined && {
                          active: item.active,
                        })}
                        {...(item.onClick !== undefined && {
                          onClick: item.onClick,
                        })}
                      >
                        {item.label}
                      </NavLink>
                    )}

                    {/* Dropdown panel */}
                    {item.children?.length && openDropdown === item.label && (
                      <div
                        role="menu"
                        className={cn(
                          "absolute left-0 top-full mt-1 z-50 min-w-[180px]",
                          "rounded-[var(--radius-ds-md)] border border-border bg-surface",
                          "shadow-[0_4px_20px_rgba(46,50,48,0.10)] py-1",
                        )}
                      >
                        {item.children.map((child) => (
                          <a
                            key={child.label}
                            href={child.href}
                            role="menuitem"
                            onClick={() => {
                              child.onClick?.();
                              setOpenDropdown(null);
                            }}
                            className={cn(
                              "block px-4 py-2 text-sm text-text-muted hover:bg-bg hover:text-text",
                              "transition-colors",
                              child.active && "text-text font-medium",
                            )}
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            )}

            {/* Search bar — grows */}
            <div className="flex-1 min-w-0">
              <SearchBar
                radius="50px"
                placeholder={searchPlaceholder}
                suggestions={searchSuggestions}
                onSearch={onSearch}
                color={color}
                size={size === "xl" ? "lg" : size === "xs" ? "xs" : "sm"}
                wrapperClassName="w-full"
              />
            </div>

            {/* Icon actions */}
            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
              <IconButton
                label={`Wishlist${wishlistCount ? ` (${wishlistCount})` : ""}`}
                icon={Heart}
                size={size}
                color={color}
                {...(wishlistCount !== undefined && { count: wishlistCount })}
                {...(onWishlistClick !== undefined && {
                  onClick: onWishlistClick,
                })}
              />
              <IconButton
                label={`Cart${cartCount ? ` (${cartCount})` : ""}`}
                icon={ShoppingCart}
                size={size}
                color={color}
                {...(cartCount !== undefined && { count: cartCount })}
                {...(onCartClick !== undefined && { onClick: onCartClick })}
              />

              {/* ── Theme toggle atom ── */}
              {showThemeToggle && (
                <ThemeToggle
                  size={size}
                  className={cn(
                    // match the icon button sizing so it sits flush with Heart/Cart
                    iconBtn[size],
                  )}
                />
              )}

              {/* Divider between toggle and user action */}
              {showThemeToggle && (
                <span
                  className="hidden sm:block w-px h-5 bg-border mx-0.5 shrink-0"
                  aria-hidden
                />
              )}

              {user ? (
                <button
                  type="button"
                  aria-label={`Account: ${user.name}`}
                  onClick={onUserClick}
                  className="ml-1 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <Avatar
                    // src={user.avatarSrc}
                    name={user.name}
                    color={color}
                    size={size === "xl" ? "md" : size === "xs" ? "xs" : "sm"}
                    {...(user.avatarSrc !== undefined && {
                      src: user.avatarSrc,
                    })}
                  />
                </button>
              ) : (
                <Button
                  variant="outline"
                  color={color}
                  size={size === "xl" ? "sm" : "xs"}
                  icon={User}
                  iconPosition="left"
                  onClick={onSignInClick}
                  className="hidden sm:inline-flex ml-1"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div
          className={cn(
            "md:hidden fixed inset-x-0 z-30 bg-surface border-b border-border",
            "shadow-[0_4px_20px_rgba(46,50,48,0.10)]",
            sticky ? "top-[var(--navbar-height,4rem)]" : "top-0",
          )}
        >
          <nav
            aria-label="Mobile navigation"
            className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1"
          >
            {navItems.map((item) => (
              <React.Fragment key={item.label}>
                <NavLink
                  href={item.href}
                  color={color}
                  size="md"
                  asButton={!item.href}
                  onClick={() => {
                    item.onClick?.();
                    setMobileOpen(false);
                  }}
                  className="py-2"
                  {...(item.active !== undefined && { active: item.active })}
                >
                  {item.label}
                </NavLink>
                {item.children?.map((child) => (
                  <NavLink
                    key={child.label}
                    href={child.href}
                    color={color}
                    size="sm"
                    asButton={!child.href}
                    onClick={() => {
                      child.onClick?.();
                      setMobileOpen(false);
                    }}
                    className="pl-4 py-1.5 text-text-muted"
                    {...(child.active !== undefined && {
                      active: child.active,
                    })}
                  >
                    {child.label}
                  </NavLink>
                ))}
              </React.Fragment>
            ))}

            {/* Theme toggle in mobile drawer — bottom of nav list */}
            {showThemeToggle && (
              <div className="flex items-center gap-2 pt-2 mt-1 border-t border-border">
                <ThemeToggle size={size === "xl" ? "md" : size} />
                <span className="text-sm text-text-muted select-none">
                  Toggle theme
                </span>
              </div>
            )}

            {!user && (
              <Button
                variant="outline"
                color={color}
                size="sm"
                icon={User}
                className="mt-2 self-start"
                onClick={() => {
                  onSignInClick?.();
                  setMobileOpen(false);
                }}
              >
                Sign In
              </Button>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
