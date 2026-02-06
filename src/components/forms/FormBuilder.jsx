import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

// ============================================================================
// CONSTANTS & UTILITIES
// ============================================================================

const THEME = {
  background: '#0f0f0f',
  card: 'bg-white/[0.07]',
  border: 'border-white/[0.06]',
  accent: '#c9a962',
  accentHover: '#d4b872',
  text: {
    primary: 'text-white',
    secondary: 'text-white/60',
    muted: 'text-white/40',
  },
  success: 'text-emerald-400',
};

const debounce = (fn, ms) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
};

const getIcon = (iconName) => {
  if (!iconName) return null;
  const Icon = LucideIcons[iconName];
  return Icon || null;
};

// ============================================================================
// FIELD COMPONENTS
// ============================================================================

const TextField = ({ field, value, onChange }) => (
  <input
    type="text"
    id={field.id}
    value={value || ''}
    onChange={(e) => onChange(field.id, e.target.value)}
    placeholder={field.placeholder}
    className={`
      w-full px-4 py-3 rounded-lg
      bg-white/[0.05] ${THEME.border} border
      ${THEME.text.primary} placeholder:${THEME.text.muted}
      focus:outline-none focus:border-[${THEME.accent}] focus:ring-1 focus:ring-[${THEME.accent}]/50
      transition-all duration-200
    `}
  />
);

const TextareaField = ({ field, value, onChange }) => (
  <textarea
    id={field.id}
    value={value || ''}
    onChange={(e) => onChange(field.id, e.target.value)}
    placeholder={field.placeholder}
    rows={field.rows || 4}
    className={`
      w-full px-4 py-3 rounded-lg resize-none
      bg-white/[0.05] ${THEME.border} border
      ${THEME.text.primary} placeholder:${THEME.text.muted}
      focus:outline-none focus:border-[${THEME.accent}] focus:ring-1 focus:ring-[${THEME.accent}]/50
      transition-all duration-200
    `}
  />
);

const SelectField = ({ field, value, onChange }) => (
  <div className="relative">
    <select
      id={field.id}
      value={value || ''}
      onChange={(e) => onChange(field.id, e.target.value)}
      className={`
        w-full px-4 py-3 rounded-lg appearance-none cursor-pointer
        bg-white/[0.05] ${THEME.border} border
        ${THEME.text.primary}
        focus:outline-none focus:border-[${THEME.accent}] focus:ring-1 focus:ring-[${THEME.accent}]/50
        transition-all duration-200
      `}
    >
      <option value="" className="bg-[#1a1a1a]">
        {field.placeholder || 'Select an option'}
      </option>
      {field.options?.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-[#1a1a1a]">
          {opt.label}
        </option>
      ))}
    </select>
    <LucideIcons.ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
  </div>
);

const PillsField = ({ field, value = [], onChange }) => {
  const selected = Array.isArray(value) ? value : [];

  const togglePill = (optValue) => {
    let newSelected;
    if (selected.includes(optValue)) {
      newSelected = selected.filter((v) => v !== optValue);
    } else {
      if (field.maxSelect && selected.length >= field.maxSelect) {
        newSelected = [...selected.slice(1), optValue];
      } else {
        newSelected = [...selected, optValue];
      }
    }
    onChange(field.id, newSelected);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {field.options?.map((opt) => {
        const isSelected = selected.includes(opt.value);
        return (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => togglePill(opt.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-200 border
              ${isSelected
                ? `bg-[${THEME.accent}]/20 border-[${THEME.accent}] text-[${THEME.accent}] shadow-[0_0_12px_rgba(201,169,98,0.3)]`
                : `bg-white/[0.05] border-white/[0.06] text-white/60 hover:bg-white/[0.08] hover:text-white`
              }
            `}
            style={isSelected ? {
              backgroundColor: 'rgba(201, 169, 98, 0.2)',
              borderColor: THEME.accent,
              color: THEME.accent,
              boxShadow: '0 0 12px rgba(201, 169, 98, 0.3)',
            } : {}}
          >
            {opt.label}
          </motion.button>
        );
      })}
      {field.maxSelect && (
        <span className="text-white/40 text-xs self-center ml-2">
          {selected.length}/{field.maxSelect}
        </span>
      )}
    </div>
  );
};

const CardsField = ({ field, value, onChange }) => {
  const columns = field.columns || 2;

  return (
    <div className={`grid gap-3 ${columns === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {field.options?.map((opt) => {
        const isSelected = value === opt.value;
        const OptIcon = opt.icon ? getIcon(opt.icon) : null;

        return (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => onChange(field.id, opt.value)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`
              p-4 rounded-xl text-left border
              transition-all duration-200
              ${isSelected
                ? 'border-[#c9a962] bg-[#c9a962]/10'
                : 'border-white/[0.06] bg-white/[0.05] hover:bg-white/[0.08]'
              }
            `}
            style={isSelected ? {
              borderColor: THEME.accent,
              backgroundColor: 'rgba(201, 169, 98, 0.1)',
              boxShadow: '0 0 20px rgba(201, 169, 98, 0.15)',
            } : {}}
          >
            <div className="flex items-start gap-3">
              {OptIcon && (
                <div
                  className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${isSelected ? 'bg-[#c9a962]/20' : 'bg-white/[0.05]'}
                  `}
                  style={isSelected ? { backgroundColor: 'rgba(201, 169, 98, 0.2)' } : {}}
                >
                  <OptIcon
                    className="w-5 h-5"
                    style={{ color: isSelected ? THEME.accent : 'rgba(255,255,255,0.6)' }}
                  />
                </div>
              )}
              <div className="flex-1">
                <h4
                  className="font-medium mb-1"
                  style={{ color: isSelected ? THEME.accent : 'white' }}
                >
                  {opt.label}
                </h4>
                {opt.description && (
                  <p className="text-sm text-white/50">{opt.description}</p>
                )}
              </div>
              {isSelected && (
                <LucideIcons.Check
                  className="w-5 h-5"
                  style={{ color: THEME.accent }}
                />
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

const CheckboxesField = ({ field, value = [], onChange }) => {
  const selected = Array.isArray(value) ? value : [];

  const toggleCheckbox = (optValue) => {
    const newSelected = selected.includes(optValue)
      ? selected.filter((v) => v !== optValue)
      : [...selected, optValue];
    onChange(field.id, newSelected);
  };

  return (
    <div className="space-y-3">
      {field.options?.map((opt) => {
        const isChecked = selected.includes(opt.value);
        const OptIcon = opt.icon ? getIcon(opt.icon) : null;

        return (
          <motion.label
            key={opt.value}
            whileHover={{ scale: 1.005 }}
            className={`
              flex items-start gap-3 p-3 rounded-lg cursor-pointer
              border transition-all duration-200
              ${isChecked
                ? 'border-[#c9a962]/50 bg-[#c9a962]/5'
                : 'border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05]'
              }
            `}
            style={isChecked ? {
              borderColor: 'rgba(201, 169, 98, 0.5)',
              backgroundColor: 'rgba(201, 169, 98, 0.05)',
            } : {}}
          >
            <div
              className={`
                w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                transition-all duration-200
              `}
              style={{
                borderColor: isChecked ? THEME.accent : 'rgba(255,255,255,0.2)',
                backgroundColor: isChecked ? THEME.accent : 'transparent',
              }}
            >
              {isChecked && <LucideIcons.Check className="w-3 h-3 text-black" />}
            </div>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => toggleCheckbox(opt.value)}
              className="sr-only"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {OptIcon && <OptIcon className="w-4 h-4 text-white/60" />}
                <span className="text-white font-medium">{opt.label}</span>
              </div>
              {opt.description && (
                <p className="text-sm text-white/50 mt-1">{opt.description}</p>
              )}
            </div>
          </motion.label>
        );
      })}
    </div>
  );
};

const UploadField = ({ field, value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const files = Array.isArray(value) ? value : value ? [value] : [];

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      onChange(field.id, field.multiple ? [...files, ...droppedFiles] : droppedFiles[0]);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      onChange(field.id, field.multiple ? [...files, ...selectedFiles] : selectedFiles[0]);
    }
  };

  const removeFile = (index) => {
    if (field.multiple) {
      const newFiles = files.filter((_, i) => i !== index);
      onChange(field.id, newFiles);
    } else {
      onChange(field.id, null);
    }
  };

  return (
    <div className="space-y-3">
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        animate={{ scale: isDragging ? 1.01 : 1 }}
        className={`
          relative border-2 border-dashed rounded-xl p-8
          flex flex-col items-center justify-center gap-3
          transition-all duration-200 cursor-pointer
          ${isDragging
            ? 'border-[#c9a962] bg-[#c9a962]/5'
            : 'border-white/[0.1] hover:border-white/[0.2] bg-white/[0.02]'
          }
        `}
        style={isDragging ? {
          borderColor: THEME.accent,
          backgroundColor: 'rgba(201, 169, 98, 0.05)',
        } : {}}
      >
        <input
          type="file"
          id={field.id}
          onChange={handleFileSelect}
          multiple={field.multiple}
          accept={field.accept}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <LucideIcons.Upload className="w-8 h-8 text-white/40" />
        <div className="text-center">
          <p className="text-white/60">
            Drag & drop or <span style={{ color: THEME.accent }}>browse</span>
          </p>
          {field.hint && (
            <p className="text-sm text-white/40 mt-1">{field.hint}</p>
          )}
        </div>
      </motion.div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.05] border border-white/[0.06]"
            >
              <LucideIcons.File className="w-5 h-5 text-white/40" />
              <span className="flex-1 text-white/80 truncate">
                {file.name || 'Uploaded file'}
              </span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 rounded hover:bg-white/[0.1] text-white/40 hover:text-white transition-colors"
              >
                <LucideIcons.X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Field renderer
const FormField = ({ field, value, onChange }) => {
  const fieldComponents = {
    text: TextField,
    textarea: TextareaField,
    select: SelectField,
    pills: PillsField,
    cards: CardsField,
    checkboxes: CheckboxesField,
    upload: UploadField,
  };

  const FieldComponent = fieldComponents[field.type] || TextField;

  return (
    <div className="space-y-2">
      {field.label && (
        <label htmlFor={field.id} className="block text-white font-medium">
          {field.label}
          {field.required && <span style={{ color: THEME.accent }}> *</span>}
        </label>
      )}
      <FieldComponent field={field} value={value} onChange={onChange} />
      {field.hint && field.type !== 'upload' && (
        <p className="text-sm text-white/40">{field.hint}</p>
      )}
    </div>
  );
};

// ============================================================================
// SECTION COMPONENT
// ============================================================================

const FormSection = ({
  section,
  isExpanded,
  onToggle,
  formData,
  onChange,
  completionStatus,
}) => {
  const Icon = getIcon(section.icon);
  const isComplete = completionStatus.completed === completionStatus.total && completionStatus.total > 0;

  return (
    <motion.div
      layout
      className={`
        rounded-xl border overflow-hidden
        ${THEME.card} ${THEME.border}
      `}
    >
      <motion.button
        type="button"
        onClick={onToggle}
        className={`
          w-full px-5 py-4 flex items-center gap-3
          hover:bg-white/[0.02] transition-colors
        `}
      >
        {Icon && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(201, 169, 98, 0.1)' }}
          >
            <Icon className="w-4 h-4" style={{ color: THEME.accent }} />
          </div>
        )}
        <span className="flex-1 text-left text-white font-medium">{section.label}</span>

        {isComplete ? (
          <div className="flex items-center gap-2">
            <LucideIcons.CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-emerald-400">Complete</span>
          </div>
        ) : (
          <span className="text-sm text-white/40">
            {completionStatus.completed}/{completionStatus.total}
          </span>
        )}

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <LucideIcons.ChevronDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-5 space-y-5 border-t border-white/[0.06]">
              <div className="h-5" />
              {section.fields?.map((field) => (
                <FormField
                  key={field.id}
                  field={field}
                  value={formData[field.id]}
                  onChange={onChange}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================================================
// MODE COMPONENTS
// ============================================================================

const WizardMode = ({
  sections,
  formData,
  onChange,
  currentStep,
  setCurrentStep,
  getSectionCompletion,
  submitLabel,
  skipLabel,
  onSubmit,
}) => {
  const currentSection = sections[currentStep];
  const isLastStep = currentStep === sections.length - 1;
  const isFirstStep = currentStep === 0;

  const goNext = () => {
    if (!isLastStep) setCurrentStep(currentStep + 1);
  };

  const goPrev = () => {
    if (!isFirstStep) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="space-y-6">
      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {sections.map((section, index) => {
          const completion = getSectionCompletion(section);
          const isActive = index === currentStep;
          const isCompleted = completion.completed === completion.total && completion.total > 0;

          return (
            <React.Fragment key={section.id}>
              <button
                type="button"
                onClick={() => setCurrentStep(index)}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'text-black'
                    : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/[0.05] text-white/40 border border-white/[0.06]'
                  }
                `}
                style={isActive ? {
                  backgroundColor: THEME.accent,
                  boxShadow: '0 0 20px rgba(201, 169, 98, 0.4)',
                } : {}}
              >
                {isCompleted && !isActive ? (
                  <LucideIcons.Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </button>
              {index < sections.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 rounded
                    ${index < currentStep ? 'bg-emerald-500/50' : 'bg-white/[0.1]'}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Current section */}
      <motion.div
        key={currentSection.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-5"
      >
        <div>
          <h3 className="text-xl font-semibold text-white">{currentSection.label}</h3>
          {currentSection.description && (
            <p className="text-white/60 mt-1">{currentSection.description}</p>
          )}
        </div>

        {currentSection.fields?.map((field) => (
          <FormField
            key={field.id}
            field={field}
            value={formData[field.id]}
            onChange={onChange}
          />
        ))}
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
        <button
          type="button"
          onClick={goPrev}
          disabled={isFirstStep}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-200
            ${isFirstStep
              ? 'opacity-0 pointer-events-none'
              : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
            }
          `}
        >
          <span className="flex items-center gap-2">
            <LucideIcons.ChevronLeft className="w-4 h-4" />
            Back
          </span>
        </button>

        <div className="flex items-center gap-3">
          {skipLabel && !isLastStep && (
            <button
              type="button"
              onClick={goNext}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white/40 hover:text-white/60 transition-colors"
            >
              {skipLabel}
            </button>
          )}

          {isLastStep ? (
            <button
              type="button"
              onClick={onSubmit}
              className="px-6 py-2 rounded-lg text-sm font-medium text-black transition-all duration-200 hover:scale-[1.02]"
              style={{
                backgroundColor: THEME.accent,
                boxShadow: '0 0 20px rgba(201, 169, 98, 0.3)',
              }}
            >
              {submitLabel}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="px-6 py-2 rounded-lg text-sm font-medium text-black transition-all duration-200 hover:scale-[1.02]"
              style={{
                backgroundColor: THEME.accent,
                boxShadow: '0 0 20px rgba(201, 169, 98, 0.3)',
              }}
            >
              <span className="flex items-center gap-2">
                Continue
                <LucideIcons.ChevronRight className="w-4 h-4" />
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const FormMode = ({
  sections,
  formData,
  onChange,
  expandedSections,
  toggleSection,
  getSectionCompletion,
  submitLabel,
  onSubmit,
}) => {
  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <FormSection
          key={section.id}
          section={section}
          isExpanded={expandedSections.includes(section.id)}
          onToggle={() => toggleSection(section.id)}
          formData={formData}
          onChange={onChange}
          completionStatus={getSectionCompletion(section)}
        />
      ))}

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onSubmit}
          className="px-6 py-3 rounded-lg font-medium text-black transition-all duration-200 hover:scale-[1.02]"
          style={{
            backgroundColor: THEME.accent,
            boxShadow: '0 0 20px rgba(201, 169, 98, 0.3)',
          }}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
};

const ChatMode = ({
  sections,
  formData,
  onChange,
  currentFieldIndex,
  setCurrentFieldIndex,
  submitLabel,
  skipLabel,
  onSubmit,
}) => {
  const allFields = useMemo(() => {
    return sections.flatMap((section) =>
      section.fields?.map((field) => ({
        ...field,
        sectionLabel: section.label,
        sectionIcon: section.icon,
      })) || []
    );
  }, [sections]);

  const currentField = allFields[currentFieldIndex];
  const isLastField = currentFieldIndex === allFields.length - 1;
  const answeredFields = allFields.slice(0, currentFieldIndex);

  const goNext = () => {
    if (!isLastField) setCurrentFieldIndex(currentFieldIndex + 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && currentField?.type !== 'textarea') {
      e.preventDefault();
      if (isLastField) {
        onSubmit();
      } else {
        goNext();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Previous answers */}
      <div className="space-y-4 max-h-[300px] overflow-y-auto">
        {answeredFields.map((field, index) => {
          const value = formData[field.id];
          const displayValue = Array.isArray(value)
            ? value.join(', ')
            : typeof value === 'object'
              ? value?.name || 'File uploaded'
              : value || 'Skipped';

          return (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                <LucideIcons.User className="w-4 h-4 text-white/40" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/40 text-sm">{field.label}</p>
                <p className="text-white mt-1 truncate">{displayValue}</p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentFieldIndex(index)}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <LucideIcons.Pencil className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Current question */}
      {currentField && (
        <motion.div
          key={currentField.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
          onKeyDown={handleKeyDown}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(201, 169, 98, 0.2)' }}
            >
              <LucideIcons.Bot className="w-4 h-4" style={{ color: THEME.accent }} />
            </div>
            <div>
              <p className="text-white/40 text-xs">{currentField.sectionLabel}</p>
              <p className="text-white text-lg mt-1">
                {currentField.label}
                {currentField.required && <span style={{ color: THEME.accent }}> *</span>}
              </p>
              {currentField.hint && (
                <p className="text-white/50 text-sm mt-1">{currentField.hint}</p>
              )}
            </div>
          </div>

          <div className="pl-11">
            <FormField
              field={currentField}
              value={formData[currentField.id]}
              onChange={onChange}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pl-11">
            {skipLabel && !currentField.required && !isLastField && (
              <button
                type="button"
                onClick={goNext}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white/40 hover:text-white/60 transition-colors"
              >
                {skipLabel}
              </button>
            )}

            <button
              type="button"
              onClick={isLastField ? onSubmit : goNext}
              className="px-6 py-2 rounded-lg text-sm font-medium text-black transition-all duration-200 hover:scale-[1.02]"
              style={{
                backgroundColor: THEME.accent,
                boxShadow: '0 0 20px rgba(201, 169, 98, 0.3)',
              }}
            >
              {isLastField ? submitLabel : 'Continue'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1">
        {allFields.map((_, index) => (
          <div
            key={index}
            className={`
              w-1.5 h-1.5 rounded-full transition-all duration-200
              ${index === currentFieldIndex
                ? 'w-4'
                : index < currentFieldIndex
                  ? 'bg-emerald-500'
                  : 'bg-white/20'
              }
            `}
            style={index === currentFieldIndex ? { backgroundColor: THEME.accent } : {}}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// PROGRESS BAR
// ============================================================================

const ProgressBar = ({ progress, showLabel = true }) => (
  <div className="space-y-2">
    {showLabel && (
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/60">Overall Progress</span>
        <span style={{ color: THEME.accent }}>{Math.round(progress)}%</span>
      </div>
    )}
    <div className="h-1.5 rounded-full bg-white/[0.1] overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${THEME.accent}, ${THEME.accentHover})`,
          boxShadow: `0 0 10px ${THEME.accent}`,
        }}
      />
    </div>
  </div>
);

// ============================================================================
// AUTO-SAVE INDICATOR
// ============================================================================

const AutoSaveIndicator = ({ status }) => {
  const states = {
    idle: { icon: LucideIcons.Cloud, text: 'All changes saved', color: 'text-white/40' },
    saving: { icon: LucideIcons.Loader2, text: 'Saving...', color: 'text-white/60', spin: true },
    saved: { icon: LucideIcons.CheckCircle, text: 'Saved', color: 'text-emerald-400' },
    error: { icon: LucideIcons.AlertCircle, text: 'Save failed', color: 'text-red-400' },
  };

  const state = states[status] || states.idle;
  const Icon = state.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-2 text-sm ${state.color}`}
    >
      <Icon className={`w-4 h-4 ${state.spin ? 'animate-spin' : ''}`} />
      <span>{state.text}</span>
    </motion.div>
  );
};

// ============================================================================
// MODE TOGGLE
// ============================================================================

const ModeToggle = ({ mode, setMode }) => {
  const modes = [
    { id: 'wizard', icon: 'Wand2', label: 'Wizard' },
    { id: 'form', icon: 'LayoutList', label: 'Form' },
    { id: 'chat', icon: 'MessageSquare', label: 'Chat' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.05] border border-white/[0.06]">
      {modes.map((m) => {
        const Icon = getIcon(m.icon);
        const isActive = mode === m.id;

        return (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
              transition-all duration-200
              ${isActive ? 'text-black' : 'text-white/60 hover:text-white hover:bg-white/[0.05]'}
            `}
            style={isActive ? {
              backgroundColor: THEME.accent,
              boxShadow: '0 0 12px rgba(201, 169, 98, 0.3)',
            } : {}}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {m.label}
          </button>
        );
      })}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const FormBuilder = ({
  title,
  subtitle,
  sections = [],
  initialData = {},
  onSubmit,
  onSave,
  showPreview = false,
  previewComponent: PreviewComponent,
  submitLabel = 'Submit',
  skipLabel,
  defaultMode = 'form',
}) => {
  const [mode, setMode] = useState(defaultMode);
  const [formData, setFormData] = useState(initialData);
  const [expandedSections, setExpandedSections] = useState([sections[0]?.id]);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState('idle');

  // Debounced save
  const debouncedSave = useMemo(
    () =>
      debounce(async (data) => {
        if (onSave) {
          setSaveStatus('saving');
          try {
            await onSave(data);
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
          } catch {
            setSaveStatus('error');
          }
        }
      }, 1000),
    [onSave]
  );

  // Handle field change
  const handleChange = useCallback(
    (fieldId, value) => {
      setFormData((prev) => {
        const newData = { ...prev, [fieldId]: value };
        debouncedSave(newData);
        return newData;
      });
    },
    [debouncedSave]
  );

  // Toggle section expansion
  const toggleSection = useCallback((sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  }, []);

  // Calculate section completion
  const getSectionCompletion = useCallback(
    (section) => {
      const requiredFields = section.fields?.filter((f) => f.required) || [];
      const completedFields = requiredFields.filter((f) => {
        const value = formData[f.id];
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'object') return value !== null;
        return value !== undefined && value !== '';
      });
      return {
        completed: completedFields.length,
        total: requiredFields.length,
      };
    },
    [formData]
  );

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const allRequiredFields = sections.flatMap(
      (s) => s.fields?.filter((f) => f.required) || []
    );
    if (allRequiredFields.length === 0) return 100;

    const completedCount = allRequiredFields.filter((f) => {
      const value = formData[f.id];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') return value !== null;
      return value !== undefined && value !== '';
    }).length;

    return (completedCount / allRequiredFields.length) * 100;
  }, [sections, formData]);

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (onSubmit) {
      onSubmit(formData);
    }
  }, [formData, onSubmit]);

  // Sync initial data
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: THEME.background }}
    >
      <div className={`max-w-4xl mx-auto ${showPreview ? 'lg:max-w-6xl' : ''}`}>
        <div className={`flex gap-6 ${showPreview ? 'lg:flex-row flex-col' : 'flex-col'}`}>
          {/* Main Form Area */}
          <div className={`flex-1 ${showPreview ? 'lg:max-w-2xl' : ''}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${THEME.card} ${THEME.border} border rounded-2xl p-6 space-y-6`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  {title && (
                    <h1 className="text-2xl font-bold text-white">{title}</h1>
                  )}
                  {subtitle && (
                    <p className="text-white/60 mt-1">{subtitle}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <AutoSaveIndicator status={saveStatus} />
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center justify-between">
                <ModeToggle mode={mode} setMode={setMode} />
              </div>

              {/* Progress Bar */}
              <ProgressBar progress={overallProgress} />

              {/* Form Content */}
              <div className="pt-2">
                {mode === 'wizard' && (
                  <WizardMode
                    sections={sections}
                    formData={formData}
                    onChange={handleChange}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    getSectionCompletion={getSectionCompletion}
                    submitLabel={submitLabel}
                    skipLabel={skipLabel}
                    onSubmit={handleSubmit}
                  />
                )}

                {mode === 'form' && (
                  <FormMode
                    sections={sections}
                    formData={formData}
                    onChange={handleChange}
                    expandedSections={expandedSections}
                    toggleSection={toggleSection}
                    getSectionCompletion={getSectionCompletion}
                    submitLabel={submitLabel}
                    onSubmit={handleSubmit}
                  />
                )}

                {mode === 'chat' && (
                  <ChatMode
                    sections={sections}
                    formData={formData}
                    onChange={handleChange}
                    currentFieldIndex={currentFieldIndex}
                    setCurrentFieldIndex={setCurrentFieldIndex}
                    submitLabel={submitLabel}
                    skipLabel={skipLabel}
                    onSubmit={handleSubmit}
                  />
                )}
              </div>
            </motion.div>
          </div>

          {/* Preview Panel */}
          {showPreview && PreviewComponent && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:w-80 w-full"
            >
              <div
                className={`${THEME.card} ${THEME.border} border rounded-2xl p-5 sticky top-6`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <LucideIcons.Eye className="w-4 h-4" style={{ color: THEME.accent }} />
                  <span className="text-white font-medium">Preview</span>
                </div>
                <PreviewComponent data={formData} />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
