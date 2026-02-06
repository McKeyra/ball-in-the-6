import { useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Upload, X } from 'lucide-react';

// Base input styles
const baseInputStyles = `
  w-full bg-white/[0.06] border border-white/[0.06] rounded-xl text-white
  placeholder:text-white/30 transition-all duration-200
  focus:outline-none focus:border-[#c9a962]/40 focus:ring-1 focus:ring-[#c9a962]/20
  disabled:opacity-50 disabled:cursor-not-allowed
`;

const hasValueStyles = 'border-white/[0.12] bg-white/[0.08]';
const errorStyles = 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20';

// Field wrapper with label, hint, and error
function FieldWrapper({ label, hint, error, required, children, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-white/60 text-sm font-medium">
          {label}
          {required && <span className="text-[#c9a962] ml-1">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-white/40 text-xs">{hint}</p>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

// 1. TextField - Text input with validation icon
export function TextField({
  value,
  onChange,
  label,
  hint,
  error,
  required,
  disabled,
  type = 'text',
  placeholder,
  icon: Icon,
  showValidation = true,
  className = '',
  ...props
}) {
  const hasValue = value && value.length > 0;
  const isValid = hasValue && !error;

  return (
    <FieldWrapper label={label} hint={hint} error={error} required={required} className={className}>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        )}
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            ${baseInputStyles}
            ${hasValue ? hasValueStyles : ''}
            ${error ? errorStyles : ''}
            ${Icon ? 'pl-11' : 'px-4'}
            ${showValidation ? 'pr-10' : 'pr-4'}
            py-3
          `}
          {...props}
        />
        {showValidation && (
          <AnimatePresence>
            {isValid && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <Check className="w-4 h-4 text-[#c9a962]" />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </FieldWrapper>
  );
}

// 2. TextAreaField - Multi-line with auto-resize
export function TextAreaField({
  value,
  onChange,
  label,
  hint,
  error,
  required,
  disabled,
  placeholder,
  minRows = 3,
  maxRows = 10,
  className = '',
  ...props
}) {
  const textareaRef = useRef(null);
  const hasValue = value && value.length > 0;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';

    // Calculate line height (approximately 24px)
    const lineHeight = 24;
    const minHeight = minRows * lineHeight;
    const maxHeight = maxRows * lineHeight;

    // Set height based on content, clamped to min/max
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${newHeight}px`;
  }, [value, minRows, maxRows]);

  return (
    <FieldWrapper label={label} hint={hint} error={error} required={required} className={className}>
      <textarea
        ref={textareaRef}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          ${baseInputStyles}
          ${hasValue ? hasValueStyles : ''}
          ${error ? errorStyles : ''}
          px-4 py-3 resize-none
        `}
        style={{ minHeight: `${minRows * 24}px` }}
        {...props}
      />
    </FieldWrapper>
  );
}

// 3. SelectField - Styled dropdown with chevron
export function SelectField({
  value,
  onChange,
  label,
  hint,
  error,
  required,
  disabled,
  placeholder = 'Select an option',
  options = [],
  className = '',
  ...props
}) {
  const hasValue = value && value !== '';

  return (
    <FieldWrapper label={label} hint={hint} error={error} required={required} className={className}>
      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            ${baseInputStyles}
            ${hasValue ? hasValueStyles : ''}
            ${error ? errorStyles : ''}
            px-4 py-3 pr-10 appearance-none cursor-pointer
            ${!hasValue ? 'text-white/30' : ''}
          `}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-[#1a1a1a] text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
      </div>
    </FieldWrapper>
  );
}

// 4. PillsField - Multi-select pills with maxSelect limit
export function PillsField({
  value = [],
  onChange,
  label,
  hint,
  error,
  required,
  disabled,
  options = [],
  maxSelect,
  className = '',
}) {
  const handleToggle = (optionValue) => {
    if (disabled) return;

    const isSelected = value.includes(optionValue);

    if (isSelected) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      if (maxSelect && value.length >= maxSelect) {
        // Remove first item and add new one
        onChange([...value.slice(1), optionValue]);
      } else {
        onChange([...value, optionValue]);
      }
    }
  };

  return (
    <FieldWrapper label={label} hint={hint} error={error} required={required} className={className}>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value.includes(option.value);
          return (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => handleToggle(option.value)}
              disabled={disabled}
              whileHover={{ scale: disabled ? 1 : 1.02 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${isSelected
                  ? 'bg-[#c9a962] text-[#0f0f0f]'
                  : 'bg-white/[0.06] text-white/70 border border-white/[0.06] hover:border-white/[0.12]'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {option.label}
            </motion.button>
          );
        })}
      </div>
      {maxSelect && (
        <p className="text-white/40 text-xs mt-2">
          Select up to {maxSelect} {value.length > 0 && `(${value.length}/${maxSelect})`}
        </p>
      )}
    </FieldWrapper>
  );
}

// 5. CardsField - Visual card grid selection
export function CardsField({
  value,
  onChange,
  label,
  hint,
  error,
  required,
  disabled,
  options = [],
  columns = 3,
  multiple = false,
  className = '',
}) {
  const handleSelect = (optionValue) => {
    if (disabled) return;

    if (multiple) {
      const currentValue = value || [];
      const isSelected = currentValue.includes(optionValue);

      if (isSelected) {
        onChange(currentValue.filter((v) => v !== optionValue));
      } else {
        onChange([...currentValue, optionValue]);
      }
    } else {
      onChange(value === optionValue ? null : optionValue);
    }
  };

  const isSelected = (optionValue) => {
    if (multiple) {
      return (value || []).includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <FieldWrapper label={label} hint={hint} error={error} required={required} className={className}>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {options.map((option) => {
          const selected = isSelected(option.value);
          return (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              disabled={disabled}
              whileHover={{ scale: disabled ? 1 : 1.02 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              className={`
                relative p-4 rounded-xl border-2 text-left transition-all duration-200
                ${selected
                  ? 'border-[#c9a962] bg-[#c9a962]/10'
                  : 'border-white/[0.06] bg-white/[0.04] hover:border-white/[0.12]'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {option.image && (
                <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-white/[0.06]">
                  <img
                    src={option.image}
                    alt={option.label}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {option.icon && (
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${selected ? 'bg-[#c9a962]/20' : 'bg-white/[0.06]'}`}>
                  <option.icon className={`w-5 h-5 ${selected ? 'text-[#c9a962]' : 'text-white/60'}`} />
                </div>
              )}
              <p className={`font-medium ${selected ? 'text-white' : 'text-white/80'}`}>
                {option.label}
              </p>
              {option.description && (
                <p className="text-white/40 text-sm mt-1">{option.description}</p>
              )}
              {selected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#c9a962] flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-[#0f0f0f]" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </FieldWrapper>
  );
}

// 6. CheckboxField - Checkbox with label and description
export function CheckboxField({
  value,
  onChange,
  label,
  hint,
  error,
  required,
  disabled,
  description,
  className = '',
}) {
  return (
    <FieldWrapper hint={hint} error={error} className={className}>
      <motion.label
        whileHover={{ scale: disabled ? 1 : 1.01 }}
        whileTap={{ scale: disabled ? 1 : 0.99 }}
        className={`
          flex items-start gap-3 cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="relative mt-0.5">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only"
          />
          <motion.div
            animate={{
              backgroundColor: value ? '#c9a962' : 'rgba(255, 255, 255, 0.06)',
              borderColor: value ? '#c9a962' : 'rgba(255, 255, 255, 0.12)',
            }}
            className={`
              w-5 h-5 rounded-md border-2 flex items-center justify-center
              transition-colors duration-200
            `}
          >
            <AnimatePresence>
              {value && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                >
                  <Check className="w-3 h-3 text-[#0f0f0f]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        <div className="flex-1">
          <span className="text-white/80 text-sm font-medium">
            {label}
            {required && <span className="text-[#c9a962] ml-1">*</span>}
          </span>
          {description && (
            <p className="text-white/40 text-xs mt-1">{description}</p>
          )}
        </div>
      </motion.label>
    </FieldWrapper>
  );
}

// 7. CheckboxGroup - Grid of checkboxes with descriptions
export function CheckboxGroup({
  value = [],
  onChange,
  label,
  hint,
  error,
  required,
  disabled,
  options = [],
  columns = 2,
  className = '',
}) {
  const handleToggle = (optionValue) => {
    if (disabled) return;

    const isSelected = value.includes(optionValue);

    if (isSelected) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <FieldWrapper label={label} hint={hint} error={error} required={required} className={className}>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {options.map((option) => {
          const isSelected = value.includes(option.value);
          return (
            <motion.label
              key={option.value}
              whileHover={{ scale: disabled ? 1 : 1.01 }}
              whileTap={{ scale: disabled ? 1 : 0.99 }}
              className={`
                flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200
                ${isSelected
                  ? 'border-[#c9a962]/40 bg-[#c9a962]/5'
                  : 'border-white/[0.06] bg-white/[0.04] hover:border-white/[0.12]'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggle(option.value)}
                  disabled={disabled}
                  className="sr-only"
                />
                <motion.div
                  animate={{
                    backgroundColor: isSelected ? '#c9a962' : 'rgba(255, 255, 255, 0.06)',
                    borderColor: isSelected ? '#c9a962' : 'rgba(255, 255, 255, 0.12)',
                  }}
                  className="w-5 h-5 rounded-md border-2 flex items-center justify-center"
                >
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        <Check className="w-3 h-3 text-[#0f0f0f]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
              <div className="flex-1">
                <span className="text-white/80 text-sm font-medium">{option.label}</span>
                {option.description && (
                  <p className="text-white/40 text-xs mt-1">{option.description}</p>
                )}
              </div>
            </motion.label>
          );
        })}
      </div>
    </FieldWrapper>
  );
}

// 8. UploadField - Drag-and-drop upload zone
export function UploadField({
  value,
  onChange,
  label,
  hint,
  error,
  required,
  disabled,
  accept,
  multiple = false,
  maxSize, // in bytes
  className = '',
}) {
  const inputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const handleFiles = useCallback((files) => {
    if (disabled) return;

    const fileList = Array.from(files);

    // Filter by accepted types if specified
    let validFiles = fileList;
    if (accept) {
      const acceptedTypes = accept.split(',').map((t) => t.trim());
      validFiles = fileList.filter((file) => {
        return acceptedTypes.some((type) => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          }
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.replace('/*', '/'));
          }
          return file.type === type;
        });
      });
    }

    // Filter by max size if specified
    if (maxSize) {
      validFiles = validFiles.filter((file) => file.size <= maxSize);
    }

    if (multiple) {
      onChange([...(value || []), ...validFiles]);
    } else {
      onChange(validFiles[0] || null);
    }
  }, [disabled, accept, maxSize, multiple, value, onChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.remove('border-[#c9a962]');

    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      dropZoneRef.current?.classList.add('border-[#c9a962]');
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.remove('border-[#c9a962]');
  }, []);

  const removeFile = (index) => {
    if (multiple) {
      const newValue = [...value];
      newValue.splice(index, 1);
      onChange(newValue);
    } else {
      onChange(null);
    }
  };

  const files = multiple ? (value || []) : (value ? [value] : []);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <FieldWrapper label={label} hint={hint} error={error} required={required} className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
        className="sr-only"
      />

      <motion.div
        ref={dropZoneRef}
        onClick={() => !disabled && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        whileHover={{ scale: disabled ? 1 : 1.01 }}
        whileTap={{ scale: disabled ? 1 : 0.99 }}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
          transition-all duration-200
          ${error ? 'border-red-500/50' : 'border-white/[0.12] hover:border-white/[0.2]'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center">
            <Upload className="w-6 h-6 text-white/40" />
          </div>
          <p className="text-white/60 text-sm">
            <span className="text-[#c9a962]">Click to upload</span> or drag and drop
          </p>
          {accept && (
            <p className="text-white/40 text-xs">
              {accept.split(',').join(', ')}
            </p>
          )}
          {maxSize && (
            <p className="text-white/40 text-xs">
              Max size: {formatFileSize(maxSize)}
            </p>
          )}
        </div>
      </motion.div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => (
            <motion.div
              key={`${file.name}-${index}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.06] border border-white/[0.06]"
            >
              <div className="flex-1 min-w-0">
                <p className="text-white/80 text-sm truncate">{file.name}</p>
                <p className="text-white/40 text-xs">{formatFileSize(file.size)}</p>
              </div>
              <motion.button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 rounded-md hover:bg-white/[0.1] text-white/40 hover:text-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </FieldWrapper>
  );
}
