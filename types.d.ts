interface Carro {
  id?: string;
  modelo: string;
  marca: string;
  ano: string;
  placa: string;
  status?: "alugado" | "disponível" | null;
  preco: number;
  imagem: string;
  userId: string;
}

interface User {
  id: number;
  nomeCompleto: string;
  senha: string;
  dataNascimento: Date;
  cpf: string;
  email: string;
  telefone: string;
}
