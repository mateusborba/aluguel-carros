import { getCars } from "@/actions/cars-actions";

import { AddCarForm } from "@/components/add-car-form";
import { CarCard } from "@/components/car-card";
import { PageTitle } from "@/components/page-title";

export const revalidate = 0;

export default async function Home() {
  const carros = await getCars();

  return (
    <div className="w-full flex flex-col my-3">
      <div className="flex justify-between">
        <PageTitle title="Todos os carros" />

        <AddCarForm />
      </div>
      <section className="mt-5">
        <ul className="grid grid-cols-3 gap-4 xl:grid-cols-4">
          {carros.length > 0 &&
            carros.map((car) => <CarCard key={car.id} car={car} />)}
        </ul>
      </section>
    </div>
  );
}
