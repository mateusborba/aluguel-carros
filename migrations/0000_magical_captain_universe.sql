CREATE TYPE "public"."car_status" AS ENUM('alugado', 'disponível');--> statement-breakpoint
CREATE TYPE "public"."manutencao_tipo" AS ENUM('preventiva', 'corretiva');--> statement-breakpoint
CREATE TABLE "carros" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"modelo" varchar(255) NOT NULL,
	"marca" varchar(255) NOT NULL,
	"ano" varchar(4) NOT NULL,
	"placa" varchar(20) NOT NULL,
	"status" "car_status" DEFAULT 'disponível',
	"preco" integer NOT NULL,
	"imagem" text NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "manutencao" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"carro_id" uuid,
	"tipo" "manutencao_tipo",
	"valor" numeric(10, 2) NOT NULL,
	"descricao" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome_completo" varchar(255) NOT NULL,
	"senha" varchar(255) NOT NULL,
	"data_nascimento" timestamp NOT NULL,
	"cpf" varchar(14) NOT NULL,
	"email" varchar(255) NOT NULL,
	"telefone" varchar(20) NOT NULL,
	CONSTRAINT "users_cpf_unique" UNIQUE("cpf"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "carros" ADD CONSTRAINT "carros_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manutencao" ADD CONSTRAINT "manutencao_carro_id_carros_id_fk" FOREIGN KEY ("carro_id") REFERENCES "public"."carros"("id") ON DELETE no action ON UPDATE no action;