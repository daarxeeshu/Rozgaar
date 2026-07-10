// src/lib/payment.ts
// Razorpay integration for UPI payments
// Supports: UPI, UPI QR, PhonePe, GPay, Paytm

const Razorpay = require('razorpay')
import crypto from 'crypto'

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export interface CreateOrderParams {
  amount: number       // in rupees (we convert to paise)
  bookingId: string
  customerPhone: string
  workerName: string
  serviceName: string
}

export async function createRazorpayOrder(params: CreateOrderParams) {
  const order = await razorpay.orders.create({
    amount: params.amount * 100,  // Razorpay uses paise
    currency: 'INR',
    receipt: `booking_${params.bookingId}`,
    notes: {
      bookingId: params.bookingId,
      workerName: params.workerName,
      serviceName: params.serviceName,
    },
    payment_capture: true,
  })
  return order
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = orderId + '|' + paymentId
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest('hex')
  return expectedSignature === signature
}

// ── UPI Deep Link generator (for direct UPI apps) ─────────────────────────────
export function generateUpiLink(params: {
  upiId: string
  name: string
  amount: number
  note: string
  txnRef: string
}) {
  const upiString = [
    `upi://pay?pa=${params.upiId}`,
    `pn=${encodeURIComponent(params.name)}`,
    `am=${params.amount}`,
    `cu=INR`,
    `tn=${encodeURIComponent(params.note)}`,
    `tr=${params.txnRef}`,
  ].join('&')
  return upiString
}
