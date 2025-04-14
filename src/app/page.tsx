import FunctionalTable from "@/components/FunctionalTable/FunctionalTable";
import Materialtable from "@/components/FunctionalTable/materialtable";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h2 className="text-center">Functional table</h2>
      <FunctionalTable></FunctionalTable>
      {/* <Materialtable></Materialtable> */}
    
    </div>
    
  );
}
