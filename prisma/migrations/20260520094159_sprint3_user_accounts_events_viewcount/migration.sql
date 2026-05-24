-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MAN', 'WOMAN', 'NON_BINARY', 'TRANSGENDER_MAN', 'TRANSGENDER_WOMAN', 'GENDERQUEER', 'SELF_DESCRIBE', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "AgeRange" AS ENUM ('AGE_18_24', 'AGE_25_34', 'AGE_35_44', 'AGE_45_PLUS', 'PREFER_NOT_TO_SAY');

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "app_users" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "pin_hash" TEXT NOT NULL,
    "encrypted_email" TEXT,
    "encrypted_phone" TEXT,
    "gender" "Gender",
    "age_range" "AgeRange",
    "province" TEXT,
    "referral_source" TEXT,
    "usage_reasons" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "self_describe_gender" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_bookmarks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "meta" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body_html" TEXT NOT NULL,
    "emergency_contacts" JSONB NOT NULL DEFAULT '[]',
    "safety_tips" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "app_users_nickname_idx" ON "app_users"("nickname");

-- CreateIndex
CREATE INDEX "user_bookmarks_user_id_idx" ON "user_bookmarks"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_bookmarks_user_id_type_item_id_key" ON "user_bookmarks"("user_id", "type", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- AddForeignKey
ALTER TABLE "user_bookmarks" ADD CONSTRAINT "user_bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
