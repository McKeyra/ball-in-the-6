import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, Users, Palette, Truck, CreditCard, ShoppingCart } from 'lucide-react';
import FormBuilder from '@/components/forms/FormBuilder';

// ============================================================================
// THEME CONSTANTS
// ============================================================================

const THEME = {
  accent: '#c9a962',
  background: '#0f0f0f',
};

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_TEAMS = [
  { value: 'team-001', label: 'Raptors Youth U14' },
  { value: 'team-002', label: 'Raptors Youth U16' },
  { value: 'team-003', label: 'Lakers Academy U14' },
  { value: 'team-004', label: 'Lakers Academy U16' },
  { value: 'team-005', label: 'Celtics Jr U14' },
  { value: 'team-006', label: 'Heat Elite U16' },
];

const SIZES = [
  { value: 'ys', label: 'Youth Small' },
  { value: 'ym', label: 'Youth Medium' },
  { value: 'yl', label: 'Youth Large' },
  { value: 'yxl', label: 'Youth XL' },
  { value: 'as', label: 'Adult Small' },
  { value: 'am', label: 'Adult Medium' },
  { value: 'al', label: 'Adult Large' },
  { value: 'axl', label: 'Adult XL' },
  { value: 'axxl', label: 'Adult XXL' },
];

// ============================================================================
// FORM SECTIONS CONFIGURATION
// ============================================================================

const formSections = [
  {
    id: 'team',
    label: 'Team Information',
    icon: 'Users',
    description: 'Which team is this order for?',
    fields: [
      {
        id: 'team',
        type: 'select',
        label: 'Select Team',
        placeholder: 'Choose a team...',
        options: MOCK_TEAMS,
        required: true,
      },
      {
        id: 'contactName',
        type: 'text',
        label: 'Contact Name',
        placeholder: 'Primary contact for this order',
        required: true,
      },
      {
        id: 'contactEmail',
        type: 'text',
        label: 'Contact Email',
        placeholder: 'email@example.com',
        required: true,
      },
      {
        id: 'contactPhone',
        type: 'text',
        label: 'Contact Phone',
        placeholder: '(555) 123-4567',
        required: true,
      },
    ],
  },
  {
    id: 'items',
    label: 'Equipment Items',
    icon: 'Package',
    description: 'Select items and quantities',
    fields: [
      {
        id: 'itemTypes',
        type: 'checkboxes',
        label: 'Items Needed',
        options: [
          { value: 'jerseys-home', label: 'Home Jerseys ($45 each)', icon: 'Shirt' },
          { value: 'jerseys-away', label: 'Away Jerseys ($45 each)', icon: 'Shirt' },
          { value: 'shorts', label: 'Shorts ($25 each)', icon: 'Square' },
          { value: 'warmups', label: 'Warmup Jackets ($65 each)', icon: 'Shirt' },
          { value: 'basketballs', label: 'Basketballs ($30 each)', icon: 'Circle' },
          { value: 'bags', label: 'Equipment Bags ($40 each)', icon: 'Briefcase' },
          { value: 'socks', label: 'Team Socks ($12 per pair)', icon: 'Footprints' },
          { value: 'headbands', label: 'Headbands ($8 each)', icon: 'Minus' },
        ],
        required: true,
      },
      {
        id: 'jerseyQuantity',
        type: 'text',
        label: 'Jersey Quantity (per type)',
        placeholder: 'How many jerseys?',
        hint: 'Enter the total number needed',
      },
      {
        id: 'jerseySizes',
        type: 'pills',
        label: 'Jersey Sizes Needed',
        options: SIZES,
        hint: 'Select all sizes required',
      },
      {
        id: 'shortsQuantity',
        type: 'text',
        label: 'Shorts Quantity',
        placeholder: 'How many shorts?',
      },
      {
        id: 'shortsSizes',
        type: 'pills',
        label: 'Shorts Sizes Needed',
        options: SIZES,
      },
      {
        id: 'basketballQuantity',
        type: 'text',
        label: 'Basketball Quantity',
        placeholder: 'How many basketballs?',
      },
      {
        id: 'otherItemsDetails',
        type: 'textarea',
        label: 'Other Items Details',
        placeholder: 'Specify quantities and sizes for other items...',
        rows: 4,
      },
    ],
  },
  {
    id: 'customization',
    label: 'Customization',
    icon: 'Palette',
    description: 'Names, numbers, and logo options',
    fields: [
      {
        id: 'includeNames',
        type: 'cards',
        label: 'Include Player Names?',
        options: [
          { value: 'yes', label: 'Yes', icon: 'User', description: 'Add names to jerseys (+$5 each)' },
          { value: 'no', label: 'No', icon: 'X', description: 'No names on jerseys' },
        ],
        required: true,
      },
      {
        id: 'playerNames',
        type: 'textarea',
        label: 'Player Names & Numbers',
        placeholder: 'List each player name and jersey number (one per line):\nSmith - #23\nJohnson - #11\n...',
        rows: 6,
      },
      {
        id: 'logoPlacement',
        type: 'checkboxes',
        label: 'Logo Placement',
        options: [
          { value: 'front-left', label: 'Front Left Chest', icon: 'LayoutGrid' },
          { value: 'front-center', label: 'Front Center', icon: 'AlignCenter' },
          { value: 'back', label: 'Back (Below Collar)', icon: 'ArrowUp' },
          { value: 'shorts', label: 'On Shorts', icon: 'Square' },
        ],
      },
      {
        id: 'logoFile',
        type: 'upload',
        label: 'Team Logo File',
        hint: 'Upload high-resolution logo (PNG, SVG, or AI)',
        accept: '.png,.svg,.ai,.eps,.pdf',
      },
      {
        id: 'customNotes',
        type: 'textarea',
        label: 'Custom Design Notes',
        placeholder: 'Any specific design requirements, colors, or special instructions...',
        rows: 3,
      },
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery',
    icon: 'Truck',
    description: 'Shipping address and timeline',
    fields: [
      {
        id: 'deliveryType',
        type: 'cards',
        label: 'Delivery Method',
        options: [
          { value: 'pickup', label: 'Pickup', icon: 'Building', description: 'Pick up from league office' },
          { value: 'standard', label: 'Standard Shipping', icon: 'Truck', description: '5-7 business days' },
          { value: 'express', label: 'Express Shipping', icon: 'Zap', description: '2-3 business days (+$25)' },
        ],
        required: true,
      },
      {
        id: 'deliveryAddress',
        type: 'textarea',
        label: 'Delivery Address',
        placeholder: 'Full shipping address...',
        rows: 3,
      },
      {
        id: 'deliveryDeadline',
        type: 'text',
        label: 'Needed By Date',
        placeholder: 'YYYY-MM-DD',
        required: true,
        hint: 'When do you need this equipment?',
      },
      {
        id: 'deliveryNotes',
        type: 'textarea',
        label: 'Delivery Instructions',
        placeholder: 'Any special delivery instructions...',
        rows: 2,
      },
    ],
  },
  {
    id: 'payment',
    label: 'Payment',
    icon: 'CreditCard',
    description: 'Purchase order and billing information',
    fields: [
      {
        id: 'paymentMethod',
        type: 'cards',
        label: 'Payment Method',
        options: [
          { value: 'po', label: 'Purchase Order', icon: 'FileText', description: 'Use organization PO' },
          { value: 'credit', label: 'Credit Card', icon: 'CreditCard', description: 'Pay by card' },
          { value: 'invoice', label: 'Invoice', icon: 'Receipt', description: 'Bill organization later' },
        ],
        required: true,
      },
      {
        id: 'poNumber',
        type: 'text',
        label: 'PO Number',
        placeholder: 'Enter purchase order number',
      },
      {
        id: 'budgetCode',
        type: 'text',
        label: 'Budget Code',
        placeholder: 'Organization budget code',
      },
      {
        id: 'billingContact',
        type: 'text',
        label: 'Billing Contact',
        placeholder: 'Name for billing inquiries',
      },
      {
        id: 'billingEmail',
        type: 'text',
        label: 'Billing Email',
        placeholder: 'Email for invoices',
      },
      {
        id: 'approverName',
        type: 'text',
        label: 'Approver Name',
        placeholder: 'Who approved this purchase?',
        required: true,
      },
    ],
  },
];

// ============================================================================
// PREVIEW COMPONENT
// ============================================================================

const EquipmentRequestPreview = ({ data }) => {
  const selectedTeam = MOCK_TEAMS.find(t => t.value === data.team);

  // Calculate estimated total
  const estimatedTotal = useMemo(() => {
    let total = 0;
    const items = data.itemTypes || [];

    // Jerseys
    if (items.includes('jerseys-home') || items.includes('jerseys-away')) {
      const jerseyQty = parseInt(data.jerseyQuantity) || 0;
      const jerseyTypes = (items.includes('jerseys-home') ? 1 : 0) + (items.includes('jerseys-away') ? 1 : 0);
      total += jerseyQty * 45 * jerseyTypes;

      // Add name customization
      if (data.includeNames === 'yes') {
        total += jerseyQty * 5 * jerseyTypes;
      }
    }

    // Shorts
    if (items.includes('shorts')) {
      total += (parseInt(data.shortsQuantity) || 0) * 25;
    }

    // Basketballs
    if (items.includes('basketballs')) {
      total += (parseInt(data.basketballQuantity) || 0) * 30;
    }

    // Other items (estimated)
    if (items.includes('warmups')) total += 10 * 65;
    if (items.includes('bags')) total += 5 * 40;
    if (items.includes('socks')) total += 15 * 12;
    if (items.includes('headbands')) total += 15 * 8;

    // Express shipping
    if (data.deliveryType === 'express') {
      total += 25;
    }

    return total;
  }, [data]);

  const itemLabels = {
    'jerseys-home': 'Home Jerseys',
    'jerseys-away': 'Away Jerseys',
    'shorts': 'Shorts',
    'warmups': 'Warmup Jackets',
    'basketballs': 'Basketballs',
    'bags': 'Equipment Bags',
    'socks': 'Team Socks',
    'headbands': 'Headbands',
  };

  return (
    <div className="space-y-4">
      {/* Order Summary Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <ShoppingCart className="w-4 h-4" style={{ color: THEME.accent }} />
          <p className="text-white font-medium">Order Summary</p>
        </div>

        {/* Team */}
        {selectedTeam && (
          <div className="mb-3 pb-3 border-b border-white/[0.06]">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Team</p>
            <p className="text-white font-medium">{selectedTeam.label}</p>
          </div>
        )}

        {/* Items */}
        {data.itemTypes?.length > 0 && (
          <div className="space-y-2 mb-3 pb-3 border-b border-white/[0.06]">
            <p className="text-white/40 text-xs uppercase tracking-wider">Items</p>
            {data.itemTypes.map((item) => (
              <div key={item} className="flex items-center justify-between text-sm">
                <span className="text-white/80">{itemLabels[item] || item}</span>
                {item === 'jerseys-home' || item === 'jerseys-away' ? (
                  <span className="text-white/60">x{data.jerseyQuantity || '?'}</span>
                ) : item === 'shorts' ? (
                  <span className="text-white/60">x{data.shortsQuantity || '?'}</span>
                ) : item === 'basketballs' ? (
                  <span className="text-white/60">x{data.basketballQuantity || '?'}</span>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {/* Customization */}
        {data.includeNames === 'yes' && (
          <div className="mb-3 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Palette className="w-3 h-3 text-white/40" />
              <p className="text-white/60 text-sm">Player names included</p>
            </div>
          </div>
        )}

        {/* Delivery */}
        {data.deliveryDeadline && (
          <div className="mb-3 pb-3 border-b border-white/[0.06]">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Needed By</p>
            <p className="text-white/80 text-sm">{data.deliveryDeadline}</p>
            {data.deliveryType && (
              <span
                className="inline-block mt-1 px-2 py-0.5 rounded text-xs capitalize"
                style={{ backgroundColor: 'rgba(201, 169, 98, 0.2)', color: THEME.accent }}
              >
                {data.deliveryType === 'express' ? 'Express Shipping' :
                 data.deliveryType === 'pickup' ? 'Pickup' : 'Standard'}
              </span>
            )}
          </div>
        )}

        {/* Total */}
        <div className="pt-2">
          <div className="flex items-center justify-between">
            <p className="text-white/40 text-xs uppercase tracking-wider">Estimated Total</p>
            <p className="text-xl font-bold" style={{ color: THEME.accent }}>
              ${estimatedTotal.toLocaleString()}
            </p>
          </div>
          <p className="text-white/40 text-xs mt-1">*Final amount may vary</p>
        </div>
      </motion.div>

      {/* Size Summary */}
      {data.jerseySizes?.length > 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Jersey Sizes</p>
          <div className="flex flex-wrap gap-1">
            {data.jerseySizes.map((size) => {
              const sizeLabel = SIZES.find(s => s.value === size)?.label || size;
              return (
                <span
                  key={size}
                  className="px-2 py-0.5 rounded text-xs"
                  style={{ backgroundColor: 'rgba(201, 169, 98, 0.2)', color: THEME.accent }}
                >
                  {sizeLabel}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment Info */}
      {data.paymentMethod && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Payment</p>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-white/40" />
            <p className="text-white/80 text-sm capitalize">
              {data.paymentMethod === 'po' ? 'Purchase Order' : data.paymentMethod}
            </p>
          </div>
          {data.poNumber && (
            <p className="text-white/60 text-xs mt-1">PO: {data.poNumber}</p>
          )}
        </div>
      )}

      {/* Contact */}
      {data.contactName && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Contact</p>
          <p className="text-white/80 text-sm">{data.contactName}</p>
          {data.contactEmail && (
            <p className="text-white/60 text-xs mt-1">{data.contactEmail}</p>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const EquipmentRequest = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-save handler
  const handleSave = useCallback(async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Auto-saved equipment request:', data);
  }, []);

  // Submit handler
  const handleSubmit = useCallback(async (data) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Submitted equipment request:', data);
      // TODO: Replace with actual mutation
      // await submitEquipmentRequest.mutateAsync(data);
      alert('Equipment request submitted successfully!');
    } catch (error) {
      console.error('Failed to submit equipment request:', error);
      alert('Failed to submit equipment request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <FormBuilder
      title="Equipment Request"
      subtitle="Order uniforms and gear for your team"
      sections={formSections}
      onSubmit={handleSubmit}
      onSave={handleSave}
      submitLabel={isSubmitting ? 'Submitting...' : 'Submit Order'}
      skipLabel="Skip for now"
      showPreview={true}
      previewComponent={EquipmentRequestPreview}
      defaultMode="wizard"
    />
  );
};

export default EquipmentRequest;
