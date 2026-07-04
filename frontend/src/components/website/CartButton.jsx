'use client'

import { addToCart } from '@/redux/features/cartSlice';
import { client } from '@/utils/helper';
import React from 'react'
import { FaHeart, FaEye, FaPlus } from "react-icons/fa";
import { useDispatch } from 'react-redux';


export default function CartButton({ product }) {
    
    const dispatcher = useDispatch()

    function cartHandler() {
         // API Call
        // if(user !=null){
        // client.post("cart/add-to-cart",{productId:product._id})
        // }

        dispatcher(addToCart({
            id: product._id,
            name: product.name,
            salePrice: product.salePrice,
            originalPrice: product.originalPrice,
            discount: product.discount,
            thumbnail: product.thumbnail,
            qty: 1
        }))

    }
    return (
        <>
            {
                product.stock ? (
                    <button onClick={cartHandler} className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2d2d2d] text-white transition-all duration-300 hover:scale-110 hover:bg-black">
                        <FaPlus size={12} />
                    </button>
                ) : (
                    <span className="rounded-full bg-red-50 px-3 py-2 text-sm font-medium text-red-500">
                        Out of Stock
                    </span>
                )
            }
        </>
    )
}
