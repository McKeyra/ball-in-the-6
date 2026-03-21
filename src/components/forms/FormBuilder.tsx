'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Check, Eye, FileText, Upload, X } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface FieldOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'pills' | 'cards' | 'checkboxes' | 'upload';
  label: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  options?: FieldOption[];
  maxSelect?: number;
  columns?: number;
  rows?: number;
  accept?: string;
  multiple?: boolean;
}

export interface FormSection {
  id: string;
  label: string;
  icon?: string;
  description?: string;
  fields: FormField[];
}

export interface FormBuilderProps {
  title: string;
  subtitle?: string;
  sections: FormSection[];
  initialData?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
  onSave?: (data: Record<string, unknown>) => void;
  showPreview?: boolean;
  previewComponent?: React.ComponentType<{ data: Record<string, unknown> }>;
  submitLabel?: string;
  skipLabel?: string;
  defaultMode?: 'form' | 'wizard';
}

// ============================================================================
// FORM BUILDER COMPONENT
// ============================================================================

export function FormBuilder({
  title,
  subtitle,
  sections,
  initialData = {},
  onSubmit,
  onSave,
  submitLabel = 'Submit',
  skipLabel = 'Save as Draft',
  defaultMode = 'form',
}: FormBuilderProps): React.ReactElement {
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData);
  const [currentSection, setCurrentSection] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = useCallback((fieldId: string, value: unknown): void => {
    setFormData((prev) => {
      const next = { ...prev, [fieldId]: value };
      if (onSave) onSave(next);
      return next;
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  }, [onSave]);

  const toggleArrayValue = useCallback((fieldId: string, value: string, maxSelect?: number): void => {
    setFormData((prev) => {
      const current = (prev[fieldId] as string[]) || [];
      let next: string[];
      if (current.includes(value)) {
        next = current.filter((v) => v !== value);
      } else {
        if (maxSelect && current.length >= maxSelect) {
          next = [...current.slice(1), value];
        } else {
          next = [...current, value];
        }
      }
      const updated = { ...prev, [fieldId]: next };
      if (onSave) onSave(updated);
      return updated;
    });
  }, [onSave]);

  const validateSection = useCallback((sectionIndex: number): boolean => {
    const section = sections[sectionIndex];
    const newErrors: Record<string, string> = {};
    let valid = true;

    for (const field of section.fields) {
      if (field.required) {
        const value = formData[field.id];
        if (
          value === undefined ||
          value === null ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        ) {
          newErrors[field.id] = `${field.label} is required`;
          valid = false;
        }
      }
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return valid;
  }, [sections, formData]);

  const handleNext = useCallback((): void => {
    if (validateSection(currentSection) && currentSection < sections.length - 1) {
      setCurrentSection((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentSection, sections.length, validateSection]);

  const handlePrev = useCallback((): void => {
    if (currentSection > 0) {
      setCurrentSection((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentSection]);

  const handleSubmit = useCallback((): void => {
    // Validate all sections
    let allValid = true;
    for (let i = 0; i < sections.length; i++) {
      if (!validateSection(i)) {
        allValid = false;
        setCurrentSection(i);
        break;
      }
    }
    if (allValid) {
      onSubmit(formData);
    }
  }, [sections, validateSection, onSubmit, formData]);

  const progress = useMemo((): number => {
    return ((currentSection + 1) / sections.length) * 100;
  }, [currentSection, sections.length]);

  const currentSectionData = sections[currentSection];

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-neutral-200/60">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>}

          {/* Progress Bar */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c8ff00] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-neutral-400">
              {currentSection + 1}/{sections.length}
            </span>
          </div>

          {/* Section Tabs */}
          <div className="mt-3 flex gap-1 overflow-x-auto no-scrollbar pb-1">
            {sections.map((section, i) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(i)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  i === currentSection
                    ? 'bg-[#c8ff00] text-neutral-900'
                    : i < currentSection
                      ? 'bg-neutral-100 text-neutral-600'
                      : 'bg-neutral-50 text-neutral-400'
                }`}
              >
                {i < currentSection && <Check className="w-3 h-3 inline mr-1" />}
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm overflow-hidden">
          {/* Section Header */}
          <div className="px-6 py-5 border-b border-neutral-100">
            <h2 className="text-lg font-bold text-neutral-900">{currentSectionData.label}</h2>
            {currentSectionData.description && (
              <p className="text-sm text-neutral-500 mt-1">{currentSectionData.description}</p>
            )}
          </div>

          {/* Fields */}
          <div className="px-6 py-5 space-y-6">
            {currentSectionData.fields.map((field) => (
              <FormFieldRenderer
                key={field.id}
                field={field}
                value={formData[field.id]}
                error={errors[field.id]}
                onChange={(value) => updateField(field.id, value)}
                onToggle={(value, maxSelect) => toggleArrayValue(field.id, value, maxSelect)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-xl border-t border-neutral-200/60 safe-bottom">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={currentSection === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {currentSection < sections.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-bold bg-[#c8ff00] text-neutral-900 hover:bg-[#b8ef00] transition-all shadow-sm"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-bold bg-[#c8ff00] text-neutral-900 hover:bg-[#b8ef00] transition-all shadow-sm"
            >
              {submitLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FORM FIELD RENDERER
// ============================================================================

interface FormFieldRendererProps {
  field: FormField;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
  onToggle: (value: string, maxSelect?: number) => void;
}

function FormFieldRenderer({ field, value, error, onChange, onToggle }: FormFieldRendererProps): React.ReactElement {
  const renderField = (): React.ReactElement => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8ff00]/50 focus:border-[#c8ff00] transition-all"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8ff00]/50 focus:border-[#c8ff00] transition-all resize-none"
          />
        );

      case 'select':
        return (
          <select
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8ff00]/50 focus:border-[#c8ff00] transition-all appearance-none"
          >
            <option value="">{field.placeholder || 'Select...'}</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'pills':
        return (
          <div className="flex flex-wrap gap-2">
            {field.options?.map((opt) => {
              const selected = Array.isArray(value) && (value as string[]).includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onToggle(opt.value, field.maxSelect)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selected
                      ? 'bg-[#c8ff00] text-neutral-900 shadow-sm'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        );

      case 'cards':
        return (
          <div className={`grid gap-3 ${
            field.columns === 1 ? 'grid-cols-1'
              : field.columns === 3 ? 'grid-cols-3'
                : field.columns === 5 ? 'grid-cols-5'
                  : field.columns === 11 ? 'grid-cols-5 sm:grid-cols-11'
                    : 'grid-cols-2'
          }`}>
            {field.options?.map((opt) => {
              const selected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange(opt.value)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    selected
                      ? 'border-[#c8ff00] bg-[#c8ff00]/10 shadow-sm'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div className="font-semibold text-sm text-neutral-900">{opt.label}</div>
                  {opt.description && (
                    <div className="text-xs text-neutral-500 mt-1">{opt.description}</div>
                  )}
                </button>
              );
            })}
          </div>
        );

      case 'checkboxes':
        return (
          <div className="space-y-2">
            {field.options?.map((opt) => {
              const checked = Array.isArray(value) && (value as string[]).includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    checked
                      ? 'border-[#c8ff00] bg-[#c8ff00]/5'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      checked
                        ? 'bg-[#c8ff00] border-[#c8ff00]'
                        : 'border-neutral-300'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 text-neutral-900" />}
                  </div>
                  <div className="flex-1" onClick={() => onToggle(opt.value)}>
                    <div className="font-semibold text-sm text-neutral-900">{opt.label}</div>
                    {opt.description && (
                      <div className="text-xs text-neutral-500 mt-0.5">{opt.description}</div>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        );

      case 'upload':
        return (
          <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-6 text-center hover:border-[#c8ff00] transition-all">
            <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-sm text-neutral-600 font-medium">
              Click to upload or drag and drop
            </p>
            {field.accept && (
              <p className="text-xs text-neutral-400 mt-1">
                Accepted: {field.accept}
              </p>
            )}
            <input
              type="file"
              accept={field.accept}
              multiple={field.multiple}
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  onChange(field.multiple ? Array.from(files) : files[0]);
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              style={{ position: 'relative' }}
            />
            {value != null && (
              <div className="mt-3 text-xs text-[#3d6b00] font-medium">
                {value instanceof File
                  ? value.name
                  : Array.isArray(value)
                    ? `${(value as File[]).length} file(s) selected`
                    : String('File selected')}
              </div>
            )}
          </div>
        );

      default:
        return <></>;
    }
  };

  return (
    <div>
      <label className="block mb-2">
        <span className="text-sm font-semibold text-neutral-900">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </span>
        {field.hint && (
          <span className="block text-xs text-neutral-400 mt-0.5">{field.hint}</span>
        )}
      </label>
      {renderField()}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
