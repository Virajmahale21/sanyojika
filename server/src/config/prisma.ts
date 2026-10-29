import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

let prisma: PrismaClient;

const isVercel = !!process.env.VERCEL;
const customDbUrl = process.env.DATABASE_URL;

// If in Vercel serverless environment and using SQLite, copy pre-seeded database to writable /tmp
if (isVercel && (!customDbUrl || customDbUrl.startsWith('file:'))) {
  const tmpDbPath = '/tmp/dev.db';
  if (!fs.existsSync(tmpDbPath)) {
    const candidatePaths = [
      path.join(process.cwd(), 'prisma', 'dev.db'),
      path.join(process.cwd(), 'server', 'prisma', 'dev.db'),
      path.resolve(process.cwd(), 'prisma', 'dev.db'),
      path.resolve(process.cwd(), 'server', 'prisma', 'dev.db'),
      path.join(__dirname, '../../prisma/dev.db'),
      path.join(__dirname, '../../../prisma/dev.db'),
      path.join(__dirname, '../../../server/prisma/dev.db'),
      path.resolve(__dirname, '../../prisma/dev.db'),
    ];

    let copied = false;
    for (const src of candidatePaths) {
      if (fs.existsSync(src)) {
        try {
          fs.copyFileSync(src, tmpDbPath);
          console.log(`[AnumatiSetu Vercel] Seeded dev.db copied from ${src} to ${tmpDbPath}`);
          copied = true;
          break;
        } catch (err) {
          console.error(`[AnumatiSetu Vercel] Error copying SQLite database from ${src}:`, err);
        }
      }
    }

    if (!copied) {
      console.warn(`[AnumatiSetu Vercel] dev.db not located in candidate paths. process.cwd(): ${process.cwd()}`);
    }
  }

  process.env.DATABASE_URL = `file:${tmpDbPath}`;
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: `file:${tmpDbPath}`,
      },
    },
  });
} else {
  prisma = new PrismaClient();
}

export { prisma };
