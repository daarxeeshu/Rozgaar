// prisma/seed.ts
// Run: npx ts-node prisma/seed.ts
// Or add to package.json: "prisma": { "seed": "ts-node prisma/seed.ts" }
// Then: npx prisma db seed

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Rozgaar database...')

  const demoWorkers = [
    {
      phone: '+919876543001',
      name: 'Ghulam Hassan',
      district: 'Srinagar', area: 'Lal Chowk',
      trade: 'Plumber', emoji: '🔧', bio: '20 saal ka tajurba. Pipes, taps, water heaters sab theek karta hoon.',
      yearsExp: 20, avgRating: 4.8, totalReviews: 34,
      services: [
        { name: 'Tap fixing', price: 150, priceUnit: 'PER_VISIT', durationMins: 30 },
        { name: 'Pipe repair', price: 300, priceUnit: 'PER_VISIT', durationMins: 90 },
        { name: 'Full bathroom fitting', price: 1800, priceUnit: 'PER_DAY' },
      ],
    },
    {
      phone: '+919876543002',
      name: 'Tariq Mir',
      district: 'Srinagar', area: 'Hyderpora',
      trade: 'Cab Driver', emoji: '🚗', bio: 'Alto aur Innova dono available. Airport, hospital, Gulmarg — kahin bhi.',
      yearsExp: 8, avgRating: 4.9, totalReviews: 87,
      services: [
        { name: 'Airport drop/pickup', price: 350, priceUnit: 'PER_VISIT', durationMins: 60 },
        { name: 'City tour (4 hrs)', price: 800, priceUnit: 'PER_VISIT', durationMins: 240 },
        { name: 'Out of city trip', price: 2000, priceUnit: 'PER_DAY' },
        { name: 'Gulmarg trip', price: 1200, priceUnit: 'PER_VISIT' },
      ],
    },
    {
      phone: '+919876543003',
      name: 'Fatima Akhtar',
      district: 'Srinagar', area: 'Rajbagh',
      trade: 'Tailor', emoji: '🧵', bio: '15 saal se kapde si rahi hoon. Pheran, salwar kameez, western sab.',
      yearsExp: 15, avgRating: 4.7, totalReviews: 52,
      services: [
        { name: 'Pheran silai', price: 500, priceUnit: 'PER_ITEM', durationMins: 2880 },
        { name: 'Salwar kameez', price: 400, priceUnit: 'PER_ITEM' },
        { name: 'Alterations', price: 100, priceUnit: 'PER_ITEM', durationMins: 60 },
        { name: 'Kurta stitching', price: 300, priceUnit: 'PER_ITEM' },
      ],
    },
    {
      phone: '+919876543004',
      name: 'Abdul Rashid',
      district: 'Srinagar', area: 'Bemina',
      trade: 'Carpenter', emoji: '🪵', bio: 'Walnut aur deodar ki lakdi meri specialty. Kashmiri naqqashi bhi karta hoon.',
      yearsExp: 18, avgRating: 4.6, totalReviews: 28,
      services: [
        { name: 'Custom furniture', price: 3000, priceUnit: 'PER_ITEM' },
        { name: 'Door/window repair', price: 600, priceUnit: 'PER_VISIT', durationMins: 240 },
        { name: 'Kitchen cabinet', price: 8000, priceUnit: 'PER_ITEM' },
        { name: 'Wooden floor polish', price: 1500, priceUnit: 'PER_DAY' },
      ],
    },
    {
      phone: '+919876543005',
      name: 'Bashir Ahmad',
      district: 'Srinagar', area: 'Dalgate',
      trade: 'Gardener', emoji: '🌿', bio: 'Tulip garden ka tajurba. Lawn, trees, design — sab kuch.',
      yearsExp: 10, avgRating: 4.5, totalReviews: 19,
      services: [
        { name: 'Lawn mowing (10x10 ft)', price: 200, priceUnit: 'PER_VISIT', durationMins: 60 },
        { name: 'Garden design', price: 1500, priceUnit: 'PER_DAY' },
        { name: 'Tree trimming', price: 400, priceUnit: 'PER_VISIT', durationMins: 120 },
      ],
    },
    {
      phone: '+919876543006',
      name: 'Noor Din',
      district: 'Anantnag', area: 'Anantnag',
      trade: 'Electrician', emoji: '⚡', bio: 'Government certified electrician. Solar panel installation bhi.',
      yearsExp: 12, avgRating: 4.7, totalReviews: 41,
      services: [
        { name: 'Wiring / rewiring', price: 800, priceUnit: 'PER_VISIT' },
        { name: 'Fan / light fitting', price: 200, priceUnit: 'PER_VISIT', durationMins: 60 },
        { name: 'MCB / switchboard', price: 350, priceUnit: 'PER_VISIT', durationMins: 120 },
        { name: 'Solar installation', price: 5000, priceUnit: 'PER_DAY' },
      ],
    },
    {
      phone: '+919876543007',
      name: 'Razia Begum',
      district: 'Baramulla', area: 'Baramulla',
      trade: 'Kashmiri Embroidery', emoji: '🌸', bio: 'Sozni, aari, tilla kaam — 25 saal se kar rahi hoon. Export quality work.',
      yearsExp: 25, avgRating: 4.9, totalReviews: 63,
      services: [
        { name: 'Sozni embroidery (shawl)', price: 2000, priceUnit: 'PER_ITEM' },
        { name: 'Aari work (saree)', price: 1500, priceUnit: 'PER_ITEM' },
        { name: 'Tilla embroidery', price: 3000, priceUnit: 'PER_ITEM' },
      ],
    },
    {
      phone: '+919876543008',
      name: 'Mushtaq Lone',
      district: 'Srinagar', area: 'Hazratbal',
      trade: 'Painter', emoji: '🎨', bio: 'Interior exterior dono. Waterproof, texture, damp-proof — sab kaam.',
      yearsExp: 14, avgRating: 4.4, totalReviews: 22,
      services: [
        { name: 'Room painting (10x12)', price: 1200, priceUnit: 'PER_ITEM' },
        { name: 'Full house painting', price: 8000, priceUnit: 'PER_ITEM' },
        { name: 'Texture work', price: 2500, priceUnit: 'PER_ITEM' },
      ],
    },
  ]

  for (const w of demoWorkers) {
    // Create user
    const user = await prisma.user.upsert({
      where: { phone: w.phone },
      create: {
        phone: w.phone,
        name: w.name,
        aadhaarVerified: true,
        aadhaarLast4: '1234',
        role: 'WORKER',
        district: w.district,
        area: w.area,
      },
      update: {},
    })

    // Create worker profile
    const wp = await prisma.workerProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        trade: w.trade,
        tradeEmoji: w.emoji,
        bio: w.bio,
        yearsExp: w.yearsExp,
        avgRating: w.avgRating,
        totalReviews: w.totalReviews,
        isAvailable: true,
      },
      update: { avgRating: w.avgRating, totalReviews: w.totalReviews },
    })

    // Create services
    for (const s of w.services) {
      await prisma.service.upsert({
        where: { id: `seed_${w.phone}_${s.name.replace(/\s/g, '_')}` },
        create: {
          id: `seed_${w.phone}_${s.name.replace(/\s/g, '_')}`,
          workerProfileId: wp.id,
          ...s,
        } as any,
        update: { price: s.price },
      })
    }

    console.log(`✅ Seeded: ${w.name} (${w.trade})`)
  }

  console.log('\n🍂 Rozgaar database seeded successfully!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
