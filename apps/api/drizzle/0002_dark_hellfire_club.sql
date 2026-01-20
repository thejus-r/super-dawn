CREATE TABLE "media_table" (
	"_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"mime_type" varchar(50) NOT NULL,
	"variants" jsonb DEFAULT '[]'::jsonb,
	"_created_at" timestamp DEFAULT now() NOT NULL,
	"_updated_at" timestamp NOT NULL
);
