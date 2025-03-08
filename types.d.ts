interface Carro {
  id?: string;
  modelo: string;
  marca: string;
  ano: string;
  placa: string;
  status?: "pendente" | "alugado" | "disponível" | "rejeitada" | null;
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

interface Solicitacao {
  cpf: string;
  nomeCompleto: string;
  telefone: string;
  id: string;
  userId: string;
  carro: Carro;
  dataInicio: Date;
  dataFim: Date;
  status: string | null;
  createdAt: Date;
}
