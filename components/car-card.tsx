import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { RentalCarButton } from "./rental-car-button";

export const CarCard = async ({ car }: { car: Carro }) => {
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
        <p className="text-sm">
          {car.modelo}
          {` (${car.ano})`}
        </p>
        <p className="text-xl font-bold">R$ {car.preco}/dia</p>
        <RentalCarButton car={car} />
      </CardContent>
    </Card>
  );
};
