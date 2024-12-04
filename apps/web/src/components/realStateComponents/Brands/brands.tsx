import { Separator } from "@repo/ui/components/ui/separator.tsx";
const Brands = () => {
  return (
    <div>
      <div className="px-40 w-2/3 py-12 max-md:p-4 max-md:w-full">
        <p className="text-5xl font-medium">Inmobiliarias que ya trabajan con nosotros</p>
      </div>
      <Separator />

      <div className="px-40 w-2/3 py-12 max-md:w-full max-md:px-4">
        <p className="font-bold text-xl">+ de 2100 inmobiliarias adheridas</p>
        <p className="font-bold text-xl">a nuestro sistema de garantías.</p>
      </div>

      <div>
        brands
      </div>
    </div>
  );
};

export default Brands;
