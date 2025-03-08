import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
import path from "path";

// Carrega as variáveis de ambiente do arquivo .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

async function main() {
  console.log("🚀 Iniciando migração...");

  try {
    // Verifica se a coluna imagem já existe
    const imagemExists = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'carros' 
      AND column_name = 'imagem'
    `);

    if (imagemExists.length === 0) {
      await db.execute(sql`ALTER TABLE carros ADD COLUMN imagem text`);
      console.log("✅ Coluna 'imagem' adicionada");
    } else {
      console.log("ℹ️ Coluna 'imagem' já existe");
    }

    // Verifica se a coluna imagens ainda existe
    const imagensExists = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'carros' 
      AND column_name = 'imagens'
    `);

    if (imagensExists.length > 0) {
      // Copia os dados da primeira imagem do array para a nova coluna
      // Se imagens for null ou vazio, usa uma string vazia como valor padrão
      await db.execute(sql`
        UPDATE carros 
        SET imagem = COALESCE(imagens[1], '')
      `);
      console.log("✅ Dados copiados para a nova coluna");

      await db.execute(sql`ALTER TABLE carros DROP COLUMN imagens`);
      console.log("✅ Coluna 'imagens' removida");
    } else {
      console.log("ℹ️ Coluna 'imagens' já foi removida");
    }

    // Exclui registros com imagem nula
    const result = await db.execute(sql`
      DELETE FROM carros 
      WHERE imagem IS NULL
      RETURNING id
    `);
    console.log(
      `✅ ${result.length} registros com imagem nula foram excluídos`
    );

    await db.execute(sql`ALTER TABLE carros ALTER COLUMN imagem SET NOT NULL`);
    console.log("✅ Coluna 'imagem' definida como NOT NULL");

    console.log("✅ Migração concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante a migração:", error);
  } finally {
    await client.end();
  }
}

main();
