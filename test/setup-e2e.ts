import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'

const prisma = new PrismaClient()

function generateUniqueDataBaseURL(schemaId) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required')
  }
  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()
beforeAll(async () => {
  const databaseURL = generateUniqueDataBaseURL(schemaId)
  process.env.DATABASE_URL = databaseURL

  execSync('pnpm prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId} CASCADE"`)
  await prisma.$disconnect()
})
