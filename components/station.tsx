import { useMemo } from "react";
import { DeleteIcon } from "./svg/delete";
import Link from "next/link";

export interface StationProps {
  code: string;
  handleRemove?: (index: string) => void;
}
export const Station = ({ code, handleRemove }: StationProps) => {
  const style = useMemo(() => ({ transform: "translateY(-50%)" }), []);
  return (
    <div className="border shadow-lg rounded w-40 h-24 mb-8 justify-center relative">
      <div
        className="absolute right-0 m-2 cursor-pointer"
        onClick={handleRemove?.bind(null, code)}
      >
        <DeleteIcon />
      </div>
      <Link href={`/stations/${encodeURIComponent(code)}`}>
        <a
          style={style}
          className="text-center block relative top-1/2 hover:underline"
        >
          {code}
        </a>
      </Link>
    </div>
  );
};
