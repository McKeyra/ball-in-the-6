'use client';

import { useState, useRef, useCallback, useEffect, type KeyboardEvent, type ClipboardEvent } from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const CODE_LENGTH = 6;
const VALID_CODE = '123456';

type ValidationState = 'idle' | 'valid' | 'invalid';

interface VerificationCodeInputProps {
  onComplete?: (code: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  onComplete,
  onValidationChange,
}) => {
  const [digits, setDigits] = useState<string[]>(Array.from({ length: CODE_LENGTH }, () => ''));
  const [validationState, setValidationState] = useState<ValidationState>('idle');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = useCallback((index: number): void => {
    const clamped = Math.max(0, Math.min(index, CODE_LENGTH - 1));
    inputRefs.current[clamped]?.focus();
  }, []);

  const handleChange = useCallback(
    (index: number, value: string): void => {
      const digit = value.replace(/\D/g, '').slice(-1);
      const next = [...digits];
      next[index] = digit;
      setDigits(next);
      setValidationState('idle');

      if (digit && index < CODE_LENGTH - 1) {
        focusInput(index + 1);
      }

      const fullCode = next.join('');
      if (fullCode.length === CODE_LENGTH) {
        const isValid = fullCode === VALID_CODE;
        setValidationState(isValid ? 'valid' : 'invalid');
        onValidationChange?.(isValid);
        onComplete?.(fullCode);
      }
    },
    [digits, focusInput, onComplete, onValidationChange],
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Backspace') {
        if (!digits[index] && index > 0) {
          const next = [...digits];
          next[index - 1] = '';
          setDigits(next);
          setValidationState('idle');
          focusInput(index - 1);
        } else {
          const next = [...digits];
          next[index] = '';
          setDigits(next);
          setValidationState('idle');
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        focusInput(index - 1);
      } else if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
        focusInput(index + 1);
      }
    },
    [digits, focusInput],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>): void => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
      if (pasted.length === 0) return;

      const next = Array.from({ length: CODE_LENGTH }, () => '');
      for (let i = 0; i < pasted.length; i++) {
        next[i] = pasted[i] ?? '';
      }
      setDigits(next);
      focusInput(Math.min(pasted.length, CODE_LENGTH - 1));

      if (pasted.length === CODE_LENGTH) {
        const isValid = pasted === VALID_CODE;
        setValidationState(isValid ? 'valid' : 'invalid');
        onValidationChange?.(isValid);
        onComplete?.(pasted);
      }
    },
    [focusInput, onComplete, onValidationChange],
  );

  useEffect(() => {
    if (validationState === 'invalid') {
      const timer = setTimeout(() => setValidationState('idle'), 1500);
      return () => clearTimeout(timer);
    }
  }, [validationState]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2.5">
        {digits.map((digit, i) => (
          <motion.div
            key={i}
            animate={
              validationState === 'invalid'
                ? { x: [0, -4, 4, -4, 4, 0] }
                : validationState === 'valid'
                  ? { scale: [1, 1.05, 1] }
                  : {}
            }
            transition={
              validationState === 'invalid'
                ? { duration: 0.4 }
                : { duration: 0.3 }
            }
          >
            <input
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              aria-label={`Digit ${i + 1} of ${CODE_LENGTH}`}
              className={cn(
                'flex h-14 w-11 items-center justify-center rounded-[14px] border-2 text-center text-lg font-bold font-[family-name:var(--font-mono)]',
                'bg-white outline-none transition-all duration-200',
                'focus:border-lime focus:ring-2 focus:ring-lime/20',
                validationState === 'valid'
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                  : validationState === 'invalid'
                    ? 'border-red-400 bg-red-50 text-red-700'
                    : digit
                      ? 'border-neutral-300 text-neutral-900'
                      : 'border-neutral-200 text-neutral-900',
              )}
            />
          </motion.div>
        ))}
      </div>

      {/* Validation feedback */}
      {validationState === 'valid' && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-1.5 text-sm font-semibold text-emerald-600"
        >
          <Check className="h-4 w-4" strokeWidth={2.5} />
          Code verified
        </motion.div>
      )}
      {validationState === 'invalid' && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-1.5 text-sm font-semibold text-red-500"
        >
          <X className="h-4 w-4" strokeWidth={2.5} />
          Invalid code. Please try again.
        </motion.div>
      )}
    </div>
  );
};
