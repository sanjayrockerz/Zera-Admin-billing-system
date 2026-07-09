import { BRAND_ADDRESS, BRAND_EMAIL, BRAND_EN, BRAND_PHONE_DISPLAY } from './brand'
import { formatCurrency, formatQuantityDisplay } from './retail'

export type WhatsAppLineItem = {
  name: string
  qty: number
  unit: string
  unitType: 'unit' | 'weight' | 'volume' | 'bundle'
  rate: number
  lineTotal: number
}

type BuildWhatsAppMessageInput = {
  title: string
  referenceLabel: string
  referenceValue: string
  customerName?: string
  phone?: string
  address?: string
  items: WhatsAppLineItem[]
  subtotal: number
  couponCode?: string | null
  couponDiscount?: number
  manualDiscountAmount?: number
  shipping?: number
  gstAmount?: number
  total: number
  closingNote?: string
}

export const buildProfessionalWhatsAppMessage = (input: BuildWhatsAppMessageInput) => {
  const lines = input.items.map((item, index) => {
    const quantity = formatQuantityDisplay(item.qty, item.unit, item.unitType)
    return `${index + 1}. ${item.name}\n   Qty: ${quantity}\n   Rate: ${formatCurrency(item.rate)}\n   Amount: ${formatCurrency(item.lineTotal)}`
  })

  const couponBlock = input.couponCode
    ? `\nCoupon Applied: ${input.couponCode}${(input.couponDiscount || 0) > 0 ? ` (-${formatCurrency(input.couponDiscount || 0)})` : ''}`
    : '\nCoupon Applied: None'

  const manualDiscountBlock = (input.manualDiscountAmount || 0) > 0
    ? `\nManual Discount: -${formatCurrency(input.manualDiscountAmount || 0)}`
    : ''

  const gstBlock = (input.gstAmount || 0) > 0
    ? `\nGST: ${formatCurrency(input.gstAmount || 0)}`
    : ''

  const shippingBlock = (input.shipping || 0) > 0
    ? `\nDelivery: ${formatCurrency(input.shipping || 0)}`
    : ''

  const customerBlock = [
    input.customerName ? `Customer: ${input.customerName}` : null,
    input.phone ? `Phone: ${input.phone}` : null,
    input.address ? `Address: ${input.address}` : null,
  ].filter(Boolean).join('\n')

  return [
    `*${BRAND_EN}*`,
    BRAND_ADDRESS,
    `Phone: ${BRAND_PHONE_DISPLAY}`,
    `Email: ${BRAND_EMAIL}`,
    '',
    `${input.title}`,
    `${input.referenceLabel}: ${input.referenceValue}`,
    customerBlock ? '' : null,
    customerBlock || null,
    '',
    'Items:',
    ...lines.map((line) => `\n${line}`),
    '',
    `Subtotal: ${formatCurrency(input.subtotal)}`,
    couponBlock,
    manualDiscountBlock,
    gstBlock,
    shippingBlock,
    `Grand Total: ${formatCurrency(input.total)}`,
    '',
    input.closingNote || 'Thank you for your order. We appreciate your business.',
  ].filter((part) => part !== null && part !== '').join('\n')
}
