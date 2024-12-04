import { Input } from "@repo/ui/components/ui/input.tsx";
// @ts-ignore todo: implementar tipado de las img
// import IconImg from "@assets/IconImg.svg";
import { Label } from "@repo/ui/components/ui/label.tsx";
import { ImagePlus } from "lucide-react";
interface Props {
  textLabel?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: any;
}

export function InputFile({ textLabel, onChange }: Props) {
  return (
    <div className="relative flex md:w-full  w-3/4 max-w-sm items-center gap-1.5 ">
      <div className="rounded-full  border-[1px] border-[#E0DEF7]">
        <Input
          id="picture"
          type="file"
          onChange={onChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100">
          <ImagePlus className="text-primary" />
        </div>
      </div>
      <Label htmlFor="picture" className="ml-2 text-base">
        {textLabel ? textLabel : "Subí tu foto de perfil"}
      </Label>
    </div>
  );
}
