// src/components/ui/Modal.jsx
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Accessible modal with:
 * - Portal to <body>
 * - ESC/backdrop to close
 * - Focus trap
 * - Scroll lock
 *
 * Props:
 *  - isOpen, onClose, title, children
 *  - initialFocusRef?: React.RefObject<HTMLElement>
 *  - size?: 'sm' | 'md' | 'lg'
 *  - closeOnBackdrop?: boolean (default true)
 *  - closeOnEsc?: boolean (default true)
 */
const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
};

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    initialFocusRef,
    size = "md",
    closeOnBackdrop = true,
    closeOnEsc = true,
}) {
    // refs
    const dialogRef = useRef(null);
    const backdropRef = useRef(null);
    const lastActiveRef = useRef(null);
    const pointerDownOnBackdrop = useRef(false);
    const titleId = useId();

    // EFFECT 1: open/close lifecycle (scroll lock + focus in, then restore)
    useEffect(() => {
        if (!isOpen) return; // run only when opened

        // remember opener focus
        lastActiveRef.current = document.activeElement;

        // lock scroll
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        // focus inside dialog
        const focusFirst = () => {
            const node =
                initialFocusRef?.current ||
                getFocusable(dialogRef.current)[0] ||
                dialogRef.current;
            setTimeout(() => node?.focus(), 0);
        };
        focusFirst();

        // cleanup on close
        return () => {
            document.body.style.overflow = prevOverflow;
            const last = lastActiveRef.current;
            if (last && typeof last.focus === "function") last.focus();
        };
    }, [isOpen, initialFocusRef]);

    // EFFECT 2: keyboard (ESC + focus trap) — attach only while open
    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape" && closeOnEsc) {
                e.stopPropagation();
                onClose?.();
                return;
            }
            if (e.key === "Tab") {
                const focusables = getFocusable(dialogRef.current);
                if (focusables.length === 0) {
                    e.preventDefault();
                    return;
                }
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                const active = document.activeElement;

                if (e.shiftKey && active === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && active === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener("keydown", onKeyDown, true);
        return () => document.removeEventListener("keydown", onKeyDown, true);
    }, [isOpen, onClose, closeOnEsc]);

    // backdrop click handling
    const handleBackdropMouseDown = (e) => {
        pointerDownOnBackdrop.current = e.target === e.currentTarget;
    };
    const handleBackdropMouseUp = (e) => {
        const clickedBackdrop = e.target === e.currentTarget;
        if (isOpen && closeOnBackdrop && pointerDownOnBackdrop.current && clickedBackdrop) {
            onClose?.();
        }
    };

    // If not open, render nothing (AFTER hooks are declared)
    if (!isOpen) return null;

    // Portaled UI
    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            aria-hidden="false"
            data-modal=""
        >
            {/* Backdrop */}
            <div
                ref={backdropRef}
                className="absolute inset-0 bg-black/40"
                onMouseDown={handleBackdropMouseDown}
                onMouseUp={handleBackdropMouseUp}
            />

            {/* Dialog */}
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
                className={[
                    "relative z-[101] w-[92vw] rounded-2xl bg-white shadow-xl border",
                    "p-4 sm:p-5",
                    sizeClasses[size] || sizeClasses.md,
                ].join(" ")}
            >
                <div className="flex items-start justify-between mb-3">
                    <h2 id={titleId} className="text-h5 font-semibold">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-xl border hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand"
                    >
                        ×
                    </button>
                </div>

                <div>{children}</div>
            </div>
        </div>,
        document.body
    );
}

/** Get focusable elements inside the dialog */
function getFocusable(root) {
    if (!root) return [];
    const selector = [
        "a[href]",
        "area[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[tabindex]:not([tabindex='-1'])",
        "[contenteditable='true']",
    ].join(",");
    const nodes = Array.from(root.querySelectorAll(selector));
    return nodes.filter((el) => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return (
            style.visibility !== "hidden" &&
            style.display !== "none" &&
            rect.width > 0 &&
            rect.height > 0
        );
    });
}
