import { cn } from '@/utils';
import { ReactNode } from "react";

interface Props {
    children :  ReactNode;
    className?: string;
}

function CustomContainer({children , className} : Props) {
   
    return (
       <section className={cn("flex flex-col xl:w-3/5 w-11/12 xl:min-w-[1200px] h-auto m-auto", className)}>
            {children}
       </section>
    )
}
export default CustomContainer;
