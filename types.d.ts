interface Carro {
  id: string;
  modelo: string | null;
  ano: number | null;
  placa: string | null;
  status: "alugado" | "disponível" | null;
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
