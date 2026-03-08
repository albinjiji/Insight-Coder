'use client';

import React, { useEffect, useRef } from 'react';
import styles from '../styles/components/confirm-dialog.module.css';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = 'Switch Mode',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);

    // Trap focus and handle Escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };

        document.addEventListener('keydown', handleKeyDown);
        dialogRef.current?.focus();

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div
                ref={dialogRef}
                className={styles.dialog}
                onClick={(e) => e.stopPropagation()}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                aria-describedby="confirm-message"
                tabIndex={-1}
            >
                <div className={styles.iconRow}>
                    <div className={styles.warningIcon}>⚠️</div>
                </div>
                <h3 id="confirm-title" className={styles.title}>{title}</h3>
                <p id="confirm-message" className={styles.message}>{message}</p>
                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onCancel}>
                        {cancelLabel}
                    </button>
                    <button className={styles.confirmBtn} onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
