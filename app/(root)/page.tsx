import { getCars } from "@/actions/cars-actions";
import { auth } from "@/auth";
import { AddCarForm } from "@/components/add-car-form";
import { CarCard } from "@/components/car-card";

// Desabilitar cache da página
export const revalidate = 0;

export default async function Home() {
  const session = await auth();
  const carros = await getCars();

  console.log("server", { session });
  return (
    <div className="w-full flex flex-col my-3">
      <div className="flex justify-between">
        <section className="flex flex-col">
          <h3 className="text-xl font-medium">Todos os carros</h3>
        </section>
        <AddCarForm />
      </div>
      <section>
        <ul className="grid grid-cols-3 gap-4 xl:grid-cols-4">
          {carros.length > 0 &&
            carros.map((car) => <CarCard key={car.id} car={car} />)}
        </ul>
      </section>
    </div>
  );
}
