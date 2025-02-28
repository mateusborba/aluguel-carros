ALTER TYPE "public"."car_status" ADD VALUE 'pendente';--> statement-breakpoint
CREATE TABLE "solicitacoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"carro_id" uuid NOT NULL,
	"data_inicio" timestamp with time zone NOT NULL,
	"data_fim" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "solicitacoes" ADD CONSTRAINT "solicitacoes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solicitacoes" ADD CONSTRAINT "solicitacoes_carro_id_carros_id_fk" FOREIGN KEY ("carro_id") REFERENCES "public"."carros"("id") ON DELETE no action ON UPDATE no action;