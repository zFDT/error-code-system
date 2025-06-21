import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const errors = await prisma.error.findMany()
    for (const err of errors) {
      if (err.errorCode) {
        const parts = err.errorCode.split('-')
        if (parts.length < 3) {
          console.warn(`Skip id=${err.id}, errorCode=${err.errorCode}，格式不符`)
          continue
        }
        const projectCode = parts[0] || null
        const moduleCode = parts[1] || null
        const code = parts[2] || null
        try {
          await prisma.error.update({
            where: { id: err.id },
            data: { projectCode, moduleCode, code }
          })
          console.log(`Updated error id=${err.id}:`, { projectCode, moduleCode, code })
        } catch (updateErr) {
          console.error(`Update failed for id=${err.id}:`, updateErr)
        }
      } else {
        console.warn(`Skip id=${err.id}, errorCode is empty`)
      }
    }
    console.log('All error records updated.')
  } catch (e) {
    console.error('Migration error:', e)
    if (e && e.stack) console.error(e.stack)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
