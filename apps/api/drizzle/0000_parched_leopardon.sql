CREATE TYPE "public"."role" AS ENUM('su', 'owner', 'admin', 'member');--> statement-breakpoint
CREATE TABLE "credential_table" (
	"_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" varchar(50) NOT NULL,
	"provider_id" varchar(255) NOT NULL,
	"password" varchar(255),
	"hash_salt" varchar(255),
	"_created_at" timestamp DEFAULT now() NOT NULL,
	"_updated_at" timestamp NOT NULL,
	CONSTRAINT "credential_table_provider_provider_id_unique" UNIQUE("provider","provider_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"revoked_at" timestamp,
	"_created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_table" (
	"_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(128) NOT NULL,
	"last_name" varchar(128),
	"email" varchar(255) NOT NULL,
	"_created_at" timestamp DEFAULT now() NOT NULL,
	"_updated_at" timestamp NOT NULL,
	CONSTRAINT "user_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "member_table" (
	"organization_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "role" DEFAULT 'member' NOT NULL,
	"_created_at" timestamp DEFAULT now() NOT NULL,
	"_updated_at" timestamp NOT NULL,
	CONSTRAINT "member_table_organization_id_user_id_pk" PRIMARY KEY("organization_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "organization_table" (
	"_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(128) NOT NULL,
	"slug" varchar(28) NOT NULL,
	"_created_at" timestamp DEFAULT now() NOT NULL,
	"_updated_at" timestamp NOT NULL,
	CONSTRAINT "organization_table_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "property_table" (
	"_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"owner_name" varchar(255),
	"owner_contact" varchar(255),
	"monthly_rent" numeric,
	"security_deposit" numeric,
	"organization_id" uuid,
	"author_id" uuid NOT NULL,
	"_created_at" timestamp DEFAULT now() NOT NULL,
	"_updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_images_table" (
	"property_id" uuid NOT NULL,
	"media_id" uuid NOT NULL,
	CONSTRAINT "property_images_table_media_id_property_id_pk" PRIMARY KEY("media_id","property_id")
);
--> statement-breakpoint
CREATE TABLE "media_table" (
	"_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"key" varchar(255) NOT NULL,
	"mime_type" varchar(50) NOT NULL,
	"variants" jsonb DEFAULT '[]'::jsonb,
	"_created_at" timestamp DEFAULT now() NOT NULL,
	"_updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "credential_table" ADD CONSTRAINT "credential_table_user_id_user_table__id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_table" ADD CONSTRAINT "member_table_organization_id_organization_table__id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization_table"("_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_table" ADD CONSTRAINT "member_table_user_id_user_table__id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_table" ADD CONSTRAINT "property_table_organization_id_organization_table__id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization_table"("_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_table" ADD CONSTRAINT "property_table_author_id_user_table__id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user_table"("_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_images_table" ADD CONSTRAINT "property_images_table_property_id_property_table__id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property_table"("_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_images_table" ADD CONSTRAINT "property_images_table_media_id_media_table__id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media_table"("_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "slug_idx" ON "organization_table" USING btree ("slug");