import { CSSProperties } from "react";
import { FaLock } from "react-icons/fa";

type Props = {
  title: string;
  color: string | null;
  enabled: boolean;
};

export default function BlockElement({ title, color, enabled }: Props) {
  const style: CSSProperties = {
    backgroundColor: enabled && color ? color : "#cccccc",
    color: "#ffffff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  };

  return (
    <div
      className="w-full h-24 flex items-center justify-center text-xl font-bold rounded-lg transition duration-300 hover:shadow-lg"
      style={style}
    >
      {enabled ? title : <FaLock />}
    </div>
  );
}
