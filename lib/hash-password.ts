import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) =>
  await bcrypt.hash(password, 10);
