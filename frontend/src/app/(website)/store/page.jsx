import ProductCard from "@/components/website/ProductCard";
import { fetchProduct } from "@/utils/api";


export default async function Page({ searchParams }) {
    const params = await searchParams;
    const room = params.room || []
    const category = params.category || []
    const min = params.min || 800;
    const max = params.max || 50000;
    const sort = params.sort

    const products = await fetchProduct({ room, category, min, max, sort })
    return (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.data.map((product) => (
                <ProductCard
                    key={product._id}
                    product={product}
                />
            ))}
        </div>

    );
}