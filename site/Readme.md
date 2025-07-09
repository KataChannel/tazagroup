npx bun add @prisma/client
npx bun add -d prisma
npx bun prisma migrate dev --name process1.6
npx prisma migrate dev --name process1.6
npx prisma db push
npx prisma generate 
npx ts-node prisma/scriptdb/exportData.ts
npx ts-node prisma/scriptdb/seed.ts
npx ts-node prisma/scriptdb/backup.ts
npx ts-node prisma/scriptdb/restore.ts
npx ts-node prisma/scriptdb/user.ts