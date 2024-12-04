import Image from "next/image";
import arrow_rightBlue from "@/assets/arrowIcons/arrow-rightBlue.svg";

const CardQuotes = ({ warrantyPrices }: any) => {
  // Render different content based on whether `downPayment` and `quotas` are available
  return (
    <div className="bg-white rounded-[10px] p-4 w-72 bottom-0 border-2">
      <div className="border-b-2">
        <h3 className="text-maincolor font-bold text-2xl">{warrantyPrices.title}</h3>
      </div>
      <div className="border-b-2">
        <p className="opacity-[60%]">{warrantyPrices.anticipo}</p>
        <p className="opacity-[60%]">{warrantyPrices.w}</p>
       
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <span className="opacity-[60%] m-0 p-0"> cuotas de</span>{" "}
          <p className="text-maincolor bold m-0 p-0">${warrantyPrices.quotas?.toFixed(2) || "0.00"}</p>
        </div>
        <div>
          <button className="bg-transparent border-2 border-maincolor rounded-full p-1 text-white text-xl">
             <img
              alt="arrow-right"
              src={arrow_rightBlue.src}
              width={36}
              height={36}
              className="cursor-pointer"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardQuotes;
