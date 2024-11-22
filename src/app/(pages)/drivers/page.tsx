import { DropdownMenuMultiple } from "@/components/DropDownFilterMultiple";
import { DropdownMenuInterval } from "@/components/DropDownFIlterInterval";
import Header from "@/components/Header";
import "@/styles/page.css";

export default function DriversPage() {
  return (
    <>
    <section>
    <div className="container-page">
    <Header />
    <div className="ml-20 mt-20">
    <DropdownMenuMultiple />
    <DropdownMenuInterval />
    </div>
    </div>
    </section>
    </>
  );
}