'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authPageValues } from '@/constants/frontend-constants';
import { LightBulbIcon } from '@/components/Icons';
import styles from '@/styles/pages/signup.module.css';
import { createClient } from '@/lib/supabase/client';

const SignUpPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};

    if (!email.trim()) {
      newErrors.email = authPageValues.errorEmailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = authPageValues.errorEmailInvalid;
    }

    if (!password) {
      newErrors.password = authPageValues.errorPasswordRequired;
    } else if (password.length < 6) {
      newErrors.password = authPageValues.errorPasswordLength;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = authPageValues.errorConfirmPasswordRequired;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = authPageValues.errorPasswordMismatch;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setServerError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setServerError(error.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    router.push('/home-page');
  };

  return (
    <div className={styles.container}>
      <div className={styles.glowLeft} aria-hidden />
      <div className={styles.glowRight} aria-hidden />

      <div className={styles.wrapper}>
        <div className={styles.logo}>
          <LightBulbIcon height="36px" width="36px" />
          <span className={styles.logoText}>InsightCoder</span>
        </div>

        <div className={styles.card}>
          <h1 className={styles.title}>{authPageValues.signUpTitle}</h1>
          <p className={styles.subtitle}>{authPageValues.signUpSubtitle}</p>

          {serverError && (
            <p className={styles.errorText} style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <span>⚠</span> {serverError}
            </p>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Email */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>{authPageValues.emailLabel}</label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); setServerError(''); }}
                placeholder={authPageValues.emailPlaceholder}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              />
              {errors.email && (
                <p className={styles.errorText}><span>⚠</span> {errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>{authPageValues.passwordLabel}</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })); setServerError(''); }}
                placeholder={authPageValues.passwordPlaceholder}
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              />
              {errors.password && (
                <p className={styles.errorText}><span>⚠</span> {errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>{authPageValues.confirmPasswordLabel}</label>
              <input
                id="signup-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors((prev) => ({ ...prev, confirmPassword: undefined })); setServerError(''); }}
                placeholder={authPageValues.confirmPasswordPlaceholder}
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
              />
              {errors.confirmPassword && (
                <p className={styles.errorText}><span>⚠</span> {errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="signup-submit"
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading && (
                <svg className={styles.spinner} viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {isLoading ? authPageValues.signingUp : authPageValues.signUpButton}
            </button>
          </form>

          <p className={styles.footerText}>
            {authPageValues.hasAccount}{' '}
            <Link href="/signin" className={styles.link}>
              {authPageValues.signInLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
