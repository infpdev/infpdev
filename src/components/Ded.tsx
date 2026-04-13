// import React from "react";
import { BatteryLow } from "lucide-react";

export const Ded = () => {
  return (
    <div
      className="
        fixed inset-0 z-[100]
        bg-black
        flex items-center justify-center
        opacity-0
        animate-[fadeIn_2s_ease-out_forwards]
      "
    >
      <div
        className="
          flex flex-col sm:flex-row
          items-center gap-4
          text-3xl text-center
          max-w-[90vw]
          opacity-70
        "
      >
        <BatteryLow className="w-20 h-20 animate-pulse shrink-0" />
        dumbahh car has no social energy left :{"<"}
      </div>
    </div>
  );
};
