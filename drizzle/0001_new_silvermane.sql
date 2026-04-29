ALTER TABLE "feeds" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "feeds" ALTER COLUMN "user_id" SET DATA TYPE uuid;