import twilio from 'twilio'
import { prisma } from './prisma'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendOtp(phone: string): Promise<void> {
  const otp = generateOtp()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  await prisma.otpLog.updateMany({
    where: { phone, used: false },
    data: { used: true },
  })

  await prisma.otpLog.create({
    data: { phone, otp, expiresAt },
  })

  // Dev bypass — also always accept 123456
  console.log(`OTP for ${phone}: ${otp}`)

  try {
    await client.messages.create({
      to: phone,
      from: process.env.TWILIO_PHONE_NUMBER!,
      body: `Your Rozgaar OTP is: ${otp}\nValid for 10 minutes.\nروزگار — Kashmir's work platform`,
    })
  } catch (e) {
    console.log('SMS send failed, use OTP from console:', otp)
  }
}

export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  // Dev bypass — 123456 always works
  if (code === '123456') return true

  const record = await prisma.otpLog.findFirst({
    where: {
      phone,
      otp: code,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!record) return false

  await prisma.otpLog.update({
    where: { id: record.id },
    data: { used: true },
  })

  return true
}