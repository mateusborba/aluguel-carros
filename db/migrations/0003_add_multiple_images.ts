import { sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

export async function up(db: any) {
  // Primeiro, adiciona a nova coluna como array
  await db.execute(sql`
    ALTER TABLE carros 
    ADD COLUMN imagens text[] NOT NULL DEFAULT '{}'::text[];
  `);

  // Copia os dados da coluna antiga para a nova
  await db.execute(sql`
    UPDATE carros 
    SET imagens = ARRAY[imagem];
  `);

  // Remove a coluna antiga
  await db.execute(sql`
    ALTER TABLE carros 
    DROP COLUMN imagem;
  `);
}

export async function down(db: any) {
  // Adiciona a coluna antiga
  await db.execute(sql`
    ALTER TABLE carros 
    ADD COLUMN imagem text;
  `);

  // Copia o primeiro elemento do array para a coluna antiga
  await db.execute(sql`
    UPDATE carros 
    SET imagem = imagens[1];
  `);

  // Remove a nova coluna
  await db.execute(sql`
    ALTER TABLE carros 
    DROP COLUMN imagens;
  `);

  // Torna a coluna não nula
  await db.execute(sql`
    ALTER TABLE carros 
    ALTER COLUMN imagem SET NOT NULL;
  `);
}
