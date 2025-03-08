import { getCarrosById } from "@/actions/cars-actions";
import { auth } from "@/auth";
import { AddCarForm } from "@/components/add-car-form";
import { CarCardAdmin } from "@/components/car-card-admin";
import { PageTitle } from "@/components/page-title";

import React from "react";

export const revalidate = 0;

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const carros = await getCarrosById({ userId: id });
  const session = await auth();

  return (
    <section className="flex flex-col gap-5">
      <div className="flex justify-between">
        <PageTitle title={`Carros de ${session?.user?.name}`} />
        <AddCarForm />
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:grid-cols-4">
        {carros?.length > 0 &&
          carros.map((car) => <CarCardAdmin key={car.id} car={car} />)}
      </ul>
    </section>
  );
};

export default Page;
