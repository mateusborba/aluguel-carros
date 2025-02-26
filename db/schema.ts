import {
  pgTable,
  uuid,
  varchar,
  integer,
  numeric,
  text,
  pgEnum,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const CarStatusEnum = pgEnum("car_status", ["alugado", "disponível"]);

export const ManutencaoTipoEnum = pgEnum("manutencao_tipo", [
  "preventiva",
  "corretiva",
]);

export const carros = pgTable("carros", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  modelo: varchar("modelo", { length: 255 }).notNull(),
  marca: varchar("marca", { length: 255 }).notNull(),
  ano: varchar("ano", { length: 4 }).notNull(),
  placa: varchar("placa", { length: 20 }).notNull(),
  status: CarStatusEnum("status").default("disponível"),
  preco: integer("preco").notNull(),
  imagem: text("imagem").notNull(),
  userId: uuid("userId")
    .references(() => users.id)
    .notNull(),
});

export const manutencao = pgTable("manutencao", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  carroId: uuid("carro_id").references(() => carros.id),
  tipo: ManutencaoTipoEnum("tipo"),
  valor: numeric("valor", { precision: 10, scale: 2 }).notNull(),
  descricao: text("descricao").notNull(),
});

export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  nomeCompleto: varchar("nome_completo", { length: 255 }).notNull(),
  senha: varchar("senha", { length: 255 }).notNull(),
  dataNascimento: timestamp("data_nascimento", {
    withTimezone: false,
  }).notNull(),
  cpf: varchar("cpf", { length: 14 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  telefone: varchar("telefone", { length: 20 }).notNull(),
});
