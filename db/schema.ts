import {
  pgTable,
  uuid,
  varchar,
  integer,
  numeric,
  text,
  pgEnum,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Definindo o enum para o status do carro
export const CarStatusEnum = pgEnum("car_status", ["alugado", "disponível"]);

// Definindo o enum para o tipo de manutenção
export const ManutencaoTipoEnum = pgEnum("manutencao_tipo", [
  "preventiva",
  "corretiva",
]);

// Tabela "carros"
export const carros = pgTable("carros", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`), // Identificador único gerado automaticamente
  modelo: varchar("modelo", { length: 255 }).notNull(), // Nome do carro
  ano: integer("ano").notNull(), // Ano de fabricação
  placa: varchar("placa", { length: 20 }).notNull(), // Placa do carro
  status: CarStatusEnum("status").default("alugado"), // Status do carro (alugado ou disponível)
});

// Tabela "manutencao"
// Cada registro de manutenção está associado a um carro e armazena o valor monetário (lucro ou prejuízo),
// o tipo de manutenção (preventiva ou corretiva) e uma descrição.
export const manutencao = pgTable("manutencao", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`), // Identificador único gerado automaticamente
  carroId: uuid("carro_id").references(() => carros.id), // Relacionamento com o carro via UUID
  tipo: ManutencaoTipoEnum("tipo"), // Tipo de manutenção (preventiva ou corretiva)
  valor: numeric("valor", { precision: 10, scale: 2 }).notNull(), // Valor monetário da manutenção
  descricao: text("descricao").notNull(), // Descrição detalhada da manutenção
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(), // ID único e autoincrementável
  nomeCompleto: varchar("nome_completo", { length: 255 }).notNull(),
  senha: varchar("senha", { length: 255 }).notNull(), // Senha precisa ser armazenada de forma segura (hash)
  dataNascimento: timestamp("data_nascimento", {
    withTimezone: false,
  }).notNull(),
  cpf: varchar("cpf", { length: 14 }).unique().notNull(), // CPF no formato XXX.XXX.XXX-XX
  email: varchar("email", { length: 255 }).unique().notNull(), // E-mail deve ser único e obrigatório
  telefone: varchar("telefone", { length: 20 }).notNull(), // Número de telefone, pode incluir DDD
});
