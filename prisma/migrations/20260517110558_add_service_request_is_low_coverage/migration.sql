-- AlterTable
ALTER TABLE "service_requests" ADD COLUMN     "is_low_coverage" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "referral_visit" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referral_visit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "referral_visit_code_idx" ON "referral_visit"("code");
