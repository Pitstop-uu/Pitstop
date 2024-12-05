import Header from "@/components/Header";
import labelizeKey from "@/utils/frontend/labelizeKey";
import "@/styles/page.css";

interface ReducerState {
// Add your state properties here
}

import { getDrivers } from "@/utils/frontend/driverPage/requests";

const fetchDrivers = async (years: [number, number]) => {
  return (await getDrivers(years[0], years[1]))
    .map((constructor: any) => ({ key: constructor.id, value: labelizeKey(constructor.id) }));
}
//// TODO 1
/// TIMEFRAME
// Filter:
  // Timeframe:
  // Circuit (Single Selection):
  // Drivers (BarChart) / Record (LineChart):

//// TODO 2
/// SPECIFIC
// Filter:
  // YEAR:
  // Drivers:
  // x-axis - alla circuits
  // (Linechart)



export default function FastestLapsPage() {
  return (
    <>
    <section>
    
    <div className="container-page">
    <Header />
      Fastest Laps
      
    </div>
    </section>
    </>
  );
}