-- Migration: add_ratings_locked_to_listing
-- Adds ratings_locked boolean column to listings table

ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS ratings_locked boolean NOT NULL DEFAULT false;
