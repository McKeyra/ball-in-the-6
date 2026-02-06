import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// Predefined color palettes for different entity types
export const CARD_COLORS = {
  // Teams - vibrant, energetic colors
  team: [
    '#c9a962', // Gold (primary)
    '#4A90E2', // Blue
    '#E25C5C', // Red
    '#8BC9A8', // Green
    '#9B59B6', // Purple
    '#FFB088', // Orange
    '#F4DD8E', // Yellow
    '#B8D4E8', // Light Blue
  ],
  // Leagues - cooler, professional tones
  league: [
    '#4A90E2', // Blue
    '#3498DB', // Lighter Blue
    '#2980B9', // Darker Blue
    '#1ABC9C', // Teal
    '#16A085', // Dark Teal
  ],
  // Organizations - sophisticated, corporate
  organization: [
    '#9B59B6', // Purple
    '#8E44AD', // Darker Purple
    '#C8BFE7', // Light Purple
    '#5C6BC0', // Indigo
    '#3F51B5', // Deep Indigo
  ],
  // Programs - warm, inviting
  program: [
    '#FFB088', // Peach
    '#F4DD8E', // Yellow
    '#8BC9A8', // Mint
    '#B8D4E8', // Sky
  ],
};

// Get color based on entity type and index
export function getEntityColor(type, index = 0) {
  const colors = CARD_COLORS[type] || CARD_COLORS.team;
  return colors[index % colors.length];
}

export default function B6ColorCard({
  label,
  title,
  description,
  bgColor = '#c9a962',
  features = [],
  icon,
  expandable = true,
  expandedContent,
  onClick,
  className = '',
}) {
  const [expanded, setExpanded] = useState(false);

  // Determine text colors based on background brightness
  const isLightBg = ['#F4DD8E', '#B8D4E8', '#C8BFE7', '#FFB088', '#8BC9A8'].includes(bgColor);
  const textColor = isLightBg ? '#1A1A1A' : '#FFFFFF';
  const labelColor = isLightBg ? '#6B6B6B' : 'rgba(255,255,255,0.6)';
  const featureBg = isLightBg ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.15)';

  const Icon = icon ? (LucideIcons[icon] || LucideIcons.Circle) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_8px_rgba(0,0,0,0.04),0_12px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06),0_16px_32px_rgba(0,0,0,0.1)] ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Label */}
      {label && (
        <div className="mb-4 flex items-center gap-2">
          {Icon && (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: featureBg }}
            >
              <Icon className="w-4 h-4" style={{ color: textColor }} />
            </div>
          )}
          <span
            className="text-[11px] font-semibold tracking-[0.5px] uppercase"
            style={{ color: labelColor }}
          >
            {label}
          </span>
        </div>
      )}

      {/* Title */}
      <h2
        className="font-serif text-[24px] sm:text-[28px] leading-[1.15] mb-3"
        style={{ color: textColor }}
      >
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p
          className="text-[15px] sm:text-[16px] leading-[1.5] mb-5"
          style={{ color: labelColor }}
        >
          {description}
        </p>
      )}

      {/* Features List */}
      {features.length > 0 && (
        <div className="space-y-2.5 mb-5">
          {features.map((feature, index) => {
            const FeatureIcon = feature.icon
              ? (LucideIcons[feature.icon] || LucideIcons.Check)
              : LucideIcons.Check;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: featureBg }}
                >
                  <FeatureIcon className="w-3.5 h-3.5" style={{ color: textColor }} />
                </div>
                <span
                  className="text-[14px] font-medium"
                  style={{ color: textColor }}
                >
                  {feature.text}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Expandable Button */}
      {expandable && expandedContent && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="w-full px-6 py-3 rounded-full font-medium text-[15px] transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
            style={{
              backgroundColor: featureBg,
              color: textColor,
            }}
          >
            Learn more
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                {expandedContent}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Arrow indicator for clickable cards without expandable content */}
      {onClick && !expandable && (
        <div className="flex justify-end mt-4">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: featureBg }}
          >
            <ChevronRight className="w-4 h-4" style={{ color: textColor }} />
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Compact version for grids
export function B6MiniColorCard({
  title,
  subtitle,
  bgColor = '#c9a962',
  icon,
  onClick,
  className = '',
}) {
  const isLightBg = ['#F4DD8E', '#B8D4E8', '#C8BFE7', '#FFB088', '#8BC9A8'].includes(bgColor);
  const textColor = isLightBg ? '#1A1A1A' : '#FFFFFF';
  const subtitleColor = isLightBg ? '#6B6B6B' : 'rgba(255,255,255,0.6)';
  const iconBg = isLightBg ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.15)';

  const Icon = icon ? (LucideIcons[icon] || LucideIcons.Circle) : null;

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full rounded-[20px] p-5 text-left transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: iconBg }}
          >
            <Icon className="w-5 h-5" style={{ color: textColor }} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-[15px] truncate"
            style={{ color: textColor }}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              className="text-[12px] truncate mt-0.5"
              style={{ color: subtitleColor }}
            >
              {subtitle}
            </p>
          )}
        </div>
        <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: subtitleColor }} />
      </div>
    </motion.button>
  );
}
