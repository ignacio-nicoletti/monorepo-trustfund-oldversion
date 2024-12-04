// @ts-ignore todo: implementar tipado de las img
import { LoaderCircle } from "lucide-react";


export const Loading = () => {
  return (
    <div className="w-6 md:w-6">
      <LoaderCircle className="w-full max-w-full animate-spin" />
    </div>
  );
};
