import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";

export const CarCard = ({ car }: { car: Carro }) => {
  console.log(car.status);
  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-lg border p-4">
      <Image
        width={40}
        height={60}
        src={car.imagem}
        alt="imagem do carro"
        className="w-full h-48 object-cover rounded-xl"
      />
      <CardHeader className="p-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          {car.marca}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 space-y-2">
        <p className="text-sm">{car.modelo}</p>
        <p className="text-xl font-bold">R$ {car.preco}/dia</p>

        <Button className="w-full mt-3" disabled={car.status !== "disponível"}>
          {car.status === "disponível" ? "Alugar" : "Indisponível"}
        </Button>
      </CardContent>
    </Card>
  );
};
