import React, { useEffect, useRef } from 'react';

/**
 * Accessible confirmation dialog with focus trap, Esc to cancel,
 * and Enter to confirm on primary button.
 *
 * Props:
 * - open: boolean - whether the dialog is visible
 * - title: string - dialog title
 * - body: string - dialog body text
 * - confirmText: string - label for the confirm button
 * - cancelText: string - label for the cancel button
 * - onConfirm: function - called when user confirms
 * - onCancel: function - called when user cancels or closes
 */
export default function ConfirmDialog({
  open,
  title = 'Confirm',
  body = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const confirmButtonRef = useRef(null);
  const lastFocusableRef = useRef(null);
  const previousActiveRef = useRef(null);

  // Trap focus and handle Escape key
  useEffect(() => {
    if (open) {
      previousActiveRef.current = document.activeElement;
      // Focus confirm button by default for Enter activation
      const toFocus = confirmButtonRef.current || dialogRef.current;
      toFocus?.focus();

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onCancel?.();
        } else if (e.key === 'Tab') {
          // Basic focus trap
          const focusable = [
            firstFocusableRef.current,
            confirmButtonRef.current,
            lastFocusableRef.current,
          ].filter(Boolean);
          if (focusable.length < 1) return;
          const currentIndex = focusable.indexOf(document.activeElement);
          if (e.shiftKey) {
            if (document.activeElement === focusable[0] || currentIndex === -1) {
              e.preventDefault();
              focusable[focusable.length - 1].focus();
            }
          } else {
            if (document.activeElement === focusable[focusable.length - 1] || currentIndex === -1) {
              e.preventDefault();
              focusable[0].focus();
            }
          }
        } else if (e.key === 'Enter') {
          // Enter confirms
          e.preventDefault();
          onConfirm?.();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        // Restore focus to previously active element
        previousActiveRef.current?.focus?.();
      };
    }
    return undefined;
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      aria-hidden={!open}
      onClick={(e) => {
        // Click outside dialog closes
        if (e.target === e.currentTarget) onCancel?.();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-body"
        ref={dialogRef}
      >
        {/* Focus trap start */}
        <span tabIndex="0" ref={firstFocusableRef} aria-hidden="true" />
        <h2 id="confirm-title" className="modal-title">{title}</h2>
        <p id="confirm-body" className="modal-body">{body}</p>
        <div className="modal-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            aria-label="Cancel"
            ref={lastFocusableRef}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="btn-danger btn-danger-solid"
            onClick={onConfirm}
            aria-label={confirmText}
            ref={confirmButtonRef}
          >
            {confirmText}
          </button>
        </div>
        {/* Focus trap end */}
        <span tabIndex="0" aria-hidden="true" />
      </div>
    </div>
  );
}
