import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().nonempty(),
  AUTH_SECRET: z.string().nonempty(),
});

const env = envSchema.parse(process.env);

export { env };
