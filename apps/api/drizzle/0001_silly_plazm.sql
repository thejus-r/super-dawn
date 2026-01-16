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
ALTER TABLE "property_table" ADD CONSTRAINT "property_table_organization_id_organization_table__id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization_table"("_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_table" ADD CONSTRAINT "property_table_author_id_user_table__id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user_table"("_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "slug_idx" ON "organization_table" USING btree ("slug");