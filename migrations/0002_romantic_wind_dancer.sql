CREATE TYPE "public"."solicitacao_status" AS ENUM('pendente', 'aprovada', 'rejeitada');--> statement-breakpoint
ALTER TABLE "solicitacoes" ADD COLUMN "status" "solicitacao_status" DEFAULT 'pendente';