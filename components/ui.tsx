"use client";

import { createContext, startTransition, useActionState, useContext, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type FormState = { ok?: boolean; error?: string; message?: string } | undefined;
type Action = (state: FormState, formData: FormData) => Promise<FormState>;

const FormCtx = createContext<{ pending: boolean; state: FormState } | null>(null);

/**
 * فرم مبتنی بر Server Action که برخلاف رفتار پیش‌فرض React، پس از خطا مقادیر وارد شده را پاک نمی‌کند.
 */
export function ActionForm({
  action, children, className, resetOnSuccess = false,
}: { action: Action; children: React.ReactNode; className?: string; resetOnSuccess?: boolean }) {
  const [state, run, pending] = useActionState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (resetOnSuccess && state?.ok) ref.current?.reset();
  }, [state, resetOnSuccess]);
  return (
    <FormCtx.Provider value={{ pending, state }}>
      <form
        ref={ref}
        className={className}
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          startTransition(() => run(fd));
        }}
      >
        {children}
      </form>
    </FormCtx.Provider>
  );
}

export function SubmitButton({
  children, className = "btn-primary", pendingText = "در حال ارسال...",
}: { children: React.ReactNode; className?: string; pendingText?: string }) {
  const ctx = useContext(FormCtx);
  const status = useFormStatus();
  const pending = ctx ? ctx.pending : status.pending;
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? (<><Loader2 className="size-4 animate-spin" /> {pendingText}</>) : children}
    </button>
  );
}

export function FormMessage({ state: explicit }: { state?: FormState }) {
  const ctx = useContext(FormCtx);
  const state = explicit ?? ctx?.state;
  if (!state?.error && !state?.message) return null;
  return (
    <div
      role="alert"
      data-form-message
      className={cn(
        "rounded-xl px-4 py-3 text-sm font-medium",
        state.error ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
      )}
    >
      {state.error ?? state.message}
    </div>
  );
}

/** دکمه‌ای که پیش از ارسال فرم، تأیید می‌گیرد */
export function ConfirmButton({
  children, message = "آیا مطمئن هستید؟", className = "btn-danger btn-sm",
}: { children: React.ReactNode; message?: string; className?: string }) {
  return (
    <button type="submit" className={className} onClick={(e) => { if (!confirm(message)) e.preventDefault(); }}>
      {children}
    </button>
  );
}
