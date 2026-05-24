/*
  Warnings:

  - You are about to drop the column `contact_method` on the `listings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "listings" DROP COLUMN "contact_method",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "website" TEXT;

-- CreateTable
CREATE TABLE "trust_ratings" (
    "id" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trust_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "trust_ratings_listing_id_idx" ON "trust_ratings"("listing_id");

-- AddForeignKey
ALTER TABLE "trust_ratings" ADD CONSTRAINT "trust_ratings_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
