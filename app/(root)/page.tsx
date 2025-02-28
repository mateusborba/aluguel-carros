import { getCars } from "@/actions/cars-actions";
import { CarCard } from "@/components/car-card";
import { PageTitle } from "@/components/page-title";

export const revalidate = 0;

export default async function Home() {
  const carros = await getCars();

  return (
    <div className="w-full flex flex-col">
      <PageTitle title="Todos os carros" />
      <section className="mt-5">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:grid-cols-4">
          {carros.length > 0 &&
            carros.map((car) => <CarCard key={car.id} car={car} />)}
        </ul>
      </section>
    </div>
  );
}
