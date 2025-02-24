import { getCars } from "@/actions/cars-actions";
import { CarsTable } from "@/components/cars-table";

export default async function Home() {
  const carros = await getCars();

  return (
    <div className="flex justify-center p-10 h-screen">
      <CarsTable data={carros} />
    </div>
  );
}
