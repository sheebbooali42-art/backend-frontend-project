export const dynamic = "force-dynamic";
import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import { getProfile } from "@/utils/api";

export default async function WebsiteLayout({ children }) {
  const getMe = await getProfile();

  return (
    <>
      <Header user={getMe?.data} />

      <main>{children}</main>

      <Footer />
    </>
  );
}