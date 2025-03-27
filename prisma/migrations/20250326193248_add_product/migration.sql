/*
  Warnings:

  - Made the column `pickupAddress` on table `donations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pickupDate` on table `donations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "donations" ALTER COLUMN "pickupAddress" SET NOT NULL,
ALTER COLUMN "pickupDate" SET NOT NULL;

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "donationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "donations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
