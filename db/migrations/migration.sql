-- Adiciona a nova coluna como array
ALTER TABLE carros 
ADD COLUMN imagens text[] NOT NULL DEFAULT '{}'::text[];

-- Copia os dados da coluna antiga para a nova
UPDATE carros 
SET imagens = ARRAY[imagem];

-- Remove a coluna antiga
ALTER TABLE carros 
DROP COLUMN imagem; 