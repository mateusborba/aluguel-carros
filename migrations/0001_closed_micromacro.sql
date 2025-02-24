CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome_completo" varchar(255) NOT NULL,
	"usuario" varchar(100) NOT NULL,
	"senha" varchar(255) NOT NULL,
	"data_nascimento" date NOT NULL,
	"cpf" varchar(14) NOT NULL,
	CONSTRAINT "users_usuario_unique" UNIQUE("usuario"),
	CONSTRAINT "users_cpf_unique" UNIQUE("cpf")
);
--> statement-breakpoint
ALTER TABLE "carros" ALTER COLUMN "modelo" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "carros" ALTER COLUMN "ano" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "carros" ALTER COLUMN "placa" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "carros" ALTER COLUMN "status" SET DEFAULT 'alugado';--> statement-breakpoint
ALTER TABLE "manutencao" ALTER COLUMN "valor" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "manutencao" ALTER COLUMN "descricao" SET NOT NULL;