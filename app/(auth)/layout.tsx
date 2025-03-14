import { Car } from "lucide-react";
import { ReactNode } from "react";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <main className="h-screen w-full items-center justify-center flex">
      <div className="bg-foreground w-full h-full hidden lg:flex flex-col justify-between items-center py-10 border-r border-sidebar-foreground">
        <div />
        <div className="flex flex-col gap-2 items-center -mt-10">
          <div className="flex flex-col gap-2 items-center">
            <Car className="size-32 text-background" />
            <h1 className="text-5xl text-background font-bold">Rental Cars</h1>
          </div>
        </div>
        <span className="text-primary-foreground mb-10">
          Alugue seu carro com segurança e suporte 24 horas.
        </span>
      </div>
      <div className="w-full flex justify-center gap-20 h-full flex-col px-10 lg:p-0 items-center">
        <div className="md:hidden md:-mt-20 flex flex-col gap-2 justify-center items-center">
          <Car className="size-20" />
          <h1 className="text-3xl text-white font-bold">Rental Cars</h1>
        </div>
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
