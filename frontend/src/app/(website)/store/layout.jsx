import Filter from "@/components/website/Filter";
import Hero from "@/components/website/Hero";
import SortFilter from "@/components/website/SortFilter";

export default function Layout({ children }) {
    return (
        <>
            <Hero />

            <div className='max-w-7xl mx-auto flex gap-4 p-4'>
                <div className='w-[280px] bg-white shadow rounded-lg p-4'>
                    <Filter />
                </div>

                <div className='flex-1'>
                    {/* Top Bar */}
                    <SortFilter />
                    {children}
                </div>

            </div>
        </>

    )
}