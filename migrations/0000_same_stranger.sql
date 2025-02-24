CREATE TYPE "public"."car_status" AS ENUM('alugado', 'disponível');--> statement-breakpoint
CREATE TYPE "public"."manutencao_tipo" AS ENUM('preventiva', 'corretiva');--> statement-breakpoint
CREATE TABLE "carros" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"modelo" varchar(255),
	"ano" integer,
	"placa" varchar(20),
	"status" "car_status"
);
--> statement-breakpoint
CREATE TABLE "manutencao" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"carro_id" uuid,
	"tipo" "manutencao_tipo",
	"valor" numeric(10, 2),
	"descricao" text
);
--> statement-breakpoint
ALTER TABLE "manutencao" ADD CONSTRAINT "manutencao_carro_id_carros_id_fk" FOREIGN KEY ("carro_id") REFERENCES "public"."carros"("id") ON DELETE no action ON UPDATE no action;