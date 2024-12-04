import { Card } from '@repo/ui/components/ui/card.tsx';
import { ForwardRefExoticComponent } from 'react';
import { LucideProps } from 'lucide-react';
import Link from 'next/link';

interface Items {
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref">>; // El tipo del icono
  title: string;
  type:string;
  url:string
}

export default function ContactCards({ icon: Icon, title, url, type }: Items) {
  return (
    <div className="flex gap-4 p-4">
      <Link href={url} target='_blank'> 
        <Card
          className="w-[350px] sm:w-[220px] sm:h-[220px] flex sm:flex-col items-center bg-transparent justify-center gap-4 py-8 px-3 sm:p-4 border-4 border-primary transition-colors hover:bg-primary hover:text-primary-foreground group cursor-pointer text-center"
        >
          {/* Renderiza el icono como un componente */}
          <Icon className="h-12 w-12 text-primary transition-colors group-hover:text-[#A0E838]" />
          <div className="flex flex-col">
            <span >{title}</span>
          </div>
        </Card>
      </Link>
     
    </div>
  );
}
