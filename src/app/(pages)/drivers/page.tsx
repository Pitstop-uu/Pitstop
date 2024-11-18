import { DropdownMenuCheckboxes } from "@/components/DropDownFilter";
import Header from "@/components/Header";
import "@/styles/page.css";

export default function DriversPage() {
  return (
    <>
    <section>
    <div className="container-page">
    <Header />
      Drivers

    <h1 className="font-bold underline text-3xl ml-20">
      Hello world!
    </h1>   
    <DropdownMenuCheckboxes />
    </div>
    </section>
    </>
  );
}