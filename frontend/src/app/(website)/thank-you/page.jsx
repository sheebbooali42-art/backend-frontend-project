import Link from "next/link";
import { FaCheckCircle, FaShoppingBag } from "react-icons/fa";

export default async function ThankYouPage({ searchParams }) {
    const params = await searchParams;
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-5">

            <div className="bg-white max-w-lg w-full rounded-2xl shadow-lg p-8 text-center">

                {/* Icon */}
                <div className="flex justify-center mb-5">
                    <FaCheckCircle className="text-green-500 text-7xl" />
                </div>


                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                    Order Placed Successfully 🎉
                </h1>


                <p className="text-gray-500 mb-6">
                    Thank you for your purchase. Your order has been confirmed
                    and will be delivered soon.
                </p>


                {/* Order Info */}
                <div className="bg-gray-50 rounded-xl p-5 text-left mb-6">

                    <div className="flex justify-between mb-3">
                        <span className="text-gray-500">
                            Order ID
                        </span>

                        <span className="font-semibold">
                            {params.order_id}
                        </span>
                    </div>


                    <div className="flex justify-between mb-3">
                        <span className="text-gray-500">
                            Payment
                        </span>

                        <span className="font-semibold text-green-600">
                            Pending
                        </span>
                    </div>


                   

                </div>


                {/* Buttons */}
                <div className="flex gap-3">

                    <Link
                        href="/store"
                        className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800"
                    >
                        Continue Shopping
                    </Link>


                    <Link
                        href="/orders"
                        className="flex-1 border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100"
                    >
                        <FaShoppingBag />
                        My Orders
                    </Link>

                </div>


            </div>

        </div>
    )
}