 import CartButton from "@/components/website/CartButton";
import { fetchProductById } from "@/utils/api";

export default async function ProductDetailPage({ params }) {

  const { id } = await params;

  const { success, product } = await fetchProductById(id);

  if (!success || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">
          Product Not Found
        </h1>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl p-8">

      <div className="grid gap-10 lg:grid-cols-2">

        <div className="rounded-2xl bg-gray-100 p-8">

          <img
            src={product.thumbnail || "/Placeholder.png"}
            alt={product.name}
            className="mx-auto max-h-[550px] object-contain"
          />

        </div>

        <div>

          <h1 className="mb-4 text-4xl font-bold">
            {product.name}
          </h1>

          <p className="mb-6 text-gray-500">
            {product.shortDescription}
          </p>

          <div className="mb-6 flex items-center gap-4">

            <span className="text-4xl font-bold">
              ₹{product.salePrice}
            </span>

            {product.originalPrice > 0 && (
              <span className="text-xl line-through text-gray-400">
                ₹{product.originalPrice}
              </span>
            )}

          </div>

          <CartButton
            product={product}
            title="Add To Cart"
          />

          <div className="mt-10 space-y-3">

            <Spec
              title="Category"
              value={product.categoryId?.name}
            />

            <Spec
              title="Room"
              value={product.roomId?.name}
            />

            <Spec
              title="Material"
              value={product.material}
            />

            <Spec
              title="Color"
              value={product.color}
            />

            <Spec
              title="Weight"
              value={`${product.weight} Kg`}
            />

            <Spec
              title="Stock"
              value={
                product.stock
                  ? "In Stock"
                  : "Out Of Stock"
              }
            />

          </div>

          <div className="prose mt-10 max-w-none">

            <h2>Description</h2>

            <div
              dangerouslySetInnerHTML={{
                __html: product.description,
              }}
            />

          </div>

        </div>

      </div>

    </section>
  );
}

function Spec({ title, value }) {
  return (
    <div className="flex justify-between border-b py-2">
      <span className="text-gray-500">
        {title}
      </span>

      <span className="font-medium">
        {value || "-"}
      </span>
    </div>
  );
}