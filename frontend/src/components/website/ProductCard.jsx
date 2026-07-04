 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaHeart } from "react-icons/fa";
import CartButton from "./CartButton";

export default function ProductCard({ product }) {
  const router = useRouter();
  const [favorite, setFavorite] = useState(false);

  if (!product) return null;

  const {
    _id,
    name,
    thumbnail,
    salePrice,
    bestSeller,
    categoryId,
  } = product;

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative flex h-[260px] items-center justify-center bg-[#efedeb] p-6">

        {bestSeller && (
          <span className="absolute left-4 top-4 rounded-full bg-[#788864] px-3 py-1 text-xs text-white">
            Best Seller
          </span>
        )}

        <img
          src={thumbnail || "/Placeholder.png"}
          alt={name}
          className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
        />

        <div className="absolute flex gap-3 opacity-0 transition group-hover:opacity-100">

          <button
            onClick={() => setFavorite(!favorite)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg"
          >
            <FaHeart
              className={
                favorite ? "text-red-500" : "text-gray-500"
              }
            />
          </button>

          <button
            onClick={() => router.push(`/productDitail/${_id}`)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg"
          >
            <FaEye />
          </button>

        </div>
      </div>

      <div className="p-5">

        <h3 className="line-clamp-1 text-lg font-semibold">
          {name}
        </h3>

        <p className="mb-4 text-sm text-gray-500">
          {categoryId?.name || "Uncategorized"}
        </p>

        <div className="flex items-center justify-between">

          <span className="text-2xl font-bold">
            ₹{salePrice?.toLocaleString()}
          </span>

          <CartButton
            product={product}
            title="Add To Cart"
          />

        </div>

      </div>
    </div>
  );
}