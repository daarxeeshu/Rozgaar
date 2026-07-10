/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma', 'twilio', 'pusher'],
}

module.exports = nextConfig