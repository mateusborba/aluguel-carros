"use client";

import React from "react";
import { Button } from "./ui/button";
import { handleRentalCar } from "@/actions/cars-actions";

export const RentalCarButton = ({ car }: { car: Carro }) => {
  return (
    <Button
      type="submit"
      className="w-full mt-3"
      disabled={car.status !== "disponível"}
      onClick={async () => {
        await handleRentalCar({ carId: car.id! });
      }}
    >
      {car.status === "disponível" ? "Alugar" : "Indisponível"}
    </Button>
  );
};
