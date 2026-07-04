import "../globals.css";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { Toaster } from "sonner";

 

export default function RootLayout({ children }) {
  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="w-full flex h-full">
        {/* Right Section */}
        <Sidebar />
        {/* left Section */}

        <div className="flex-1">
          <Header />
          <div className=" bg-[#f6f8fc]">{children}</div>
        </div>
      </div>
    </>
  );
}
