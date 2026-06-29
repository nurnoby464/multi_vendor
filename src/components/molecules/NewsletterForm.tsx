"use client";

import * as React from "react";
import { Mail, CheckCircle } from "lucide-react";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import type { ColorProp, SizeToken } from "@/lib/types";

export interface NewsletterFormProps {
  /** Controlled email value. */
  email?: string;
  onEmailChange?: (email: string) => void;
  onSubmit?: (email: string) => void | Promise<void>;
  placeholder?: string;
  buttonLabel?: string;
  /** Displayed above the form. */
  heading?: string;
  subheading?: string;
  /** Privacy/terms note below the form. */
  disclaimer?: string;
  /** Layout direction. "row" = inline, "col" = stacked. */
  layout?: "row" | "col";
  color?: ColorProp;
  size?: SizeToken;
  successMessage?: string;
  className?: string;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function NewsletterForm({
  email,
  onEmailChange,
  onSubmit,
  placeholder = "your@email.com",
  buttonLabel = "Subscribe",
  heading,
  subheading,
  disclaimer,
  layout = "row",
  color = "primary",
  size = "md",
  successMessage = "You're in! Check your inbox.",
  className,
}: NewsletterFormProps) {
  const [internalEmail, setInternalEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [touched, setTouched] = React.useState(false);
  const [serverError, setServerError] = React.useState("");

  const currentEmail = email !== undefined ? email : internalEmail;
  const hasError = touched && !isValidEmail(currentEmail);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    if (email === undefined) setInternalEmail(v);
    onEmailChange?.(v);
    if (touched && isValidEmail(v)) setTouched(false); // clear error once valid
  }

  async function handleSubmit() {
    setTouched(true);
    if (!isValidEmail(currentEmail)) return;
    setStatus("loading");
    setServerError("");
    try {
      await onSubmit?.(currentEmail);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={cn("flex flex-col items-center gap-2 text-center py-2", className)}>
        <CheckCircle
          size={32}
          className="text-success"
          aria-hidden
        />
        <p className="text-sm font-medium text-text">{successMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Heading block */}
      {(heading || subheading) && (
        <div className="flex flex-col gap-1">
          {heading && <p className="font-semibold text-text text-sm">{heading}</p>}
          {subheading && <p className="text-xs text-text-muted leading-relaxed">{subheading}</p>}
        </div>
      )}

      {/* Input + Button */}
      <div
        className={cn(
          "flex gap-2",
          layout === "col" ? "flex-col" : "flex-row items-start",
        )}
      >
        <div className="flex flex-1 flex-col gap-1 min-w-0">
          <Input
            type="email"
            inputMode="email"
            autoComplete="email"
            leftIcon={Mail}
            placeholder={placeholder}
            value={currentEmail}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
            color={color}
            size={size}
            error={hasError}
            disabled={status === "loading"}
            aria-label="Email address"
            aria-invalid={hasError}
            aria-describedby={hasError ? "nl-email-error" : serverError ? "nl-server-error" : undefined}
            className="w-full"
          />
          {hasError && (
            <p id="nl-email-error" className="text-xs text-danger" role="alert">
              Please enter a valid email address.
            </p>
          )}
        </div>

        <Button
          color={color}
          size={size}
          status={status}
          label={buttonLabel}
          loadingLabel="Subscribing…"
          disabled={hasError}
          onClick={handleSubmit}
          className={layout === "col" ? "w-full" : "shrink-0"}
        >
          {buttonLabel}
        </Button>
      </div>

      {/* Server error */}
      {serverError && (
        <p id="nl-server-error" className="text-xs text-danger" role="alert">
          {serverError}
        </p>
      )}

      {/* Disclaimer */}
      {disclaimer && (
        <p className="text-[11px] text-text-muted leading-relaxed">{disclaimer}</p>
      )}
    </div>
  );
}
