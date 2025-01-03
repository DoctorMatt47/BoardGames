import { useParams } from "react-router";
import Team from "./Team/Team.tsx";
import { TeamEnum } from "./Team/TeamEnum.ts";

function Codenames() {
  const { roomId } = useParams();

  return (
    <div className="w-full min-h-screen bg-gray-900 text-emerald-100 flex justify-center items-center lg:p-5 overflow-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 grid-rows-2 lg:grid-rows-1 lg:gap-5 w-full h-full">
        <Team className="order-1 lg:order-2" team={TeamEnum.Blue} />
        <div className="bg-yellow-900 order-3 lg:order-2 col-span-2"></div>
        <Team className="order-2 lg:order-3" team={TeamEnum.Red} />
      </div>
    </div>
  );
}

export default Codenames;
