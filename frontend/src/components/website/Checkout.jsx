'use client'
import { client } from "@/utils/helper";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";


export default function Checkout({ user }) {
    const { error, isLoading, Razorpay } = useRazorpay();

    const router = useRouter()
    const cart = useSelector((store) => store.cart)
    const [selectedAddress, setSelectedAddress] = useState({});
    const [payment, setPayment] = useState("cod");

    async function orderHandler() {

        try {
            const response = await client.post("order/place", {
                paymentMethod: payment,
                shippingAddress: selectedAddress,
            });


            if (payment == "cod") {
                if (response.data.success) {
                    toast.success(response.data.message);
                    router.push(`/thank-you?order_id${response.data.orderId}`);
                }

            } else {
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    currency: "INR",
                    amount: response.data.total,
                    name: "Nestro Ltd",
                    description: "Test Transaction",
                    order_id: response.data.razorpay_order_id, // Generate order_id on server
                    handler: (response) => {
                        client.post("order/verify", response).then((response) => {
                            console.log(response)
                        }).catch((error) => {
                            console.log(error)
                        })

                    },
                    prefill: {
                        name: user?.name || "John",
                        email: user?.email || "john.doe@example.com",
                        contact: "9521521515",
                    },
                    theme: {
                        color: "#F37254",
                    },
                };

                const razorpayInstance = new Razorpay(options);
                razorpayInstance.open();


            }




        }
        catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Internal Server Error"
            );
        }



    }


    return (
        <div className="min-h-screen bg-gray-100 py-10 px-5">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

                {/* Checkout Form */}

                <div className="md:col-span-2 bg-white rounded-xl shadow p-6">

                    <h2 className="text-2xl font-semibold mb-6">
                        Checkout
                    </h2>


                    {/* Address */}

                    <h3 className="font-semibold mb-3">
                        Select Address
                    </h3>


                    <div className="grid md:grid-cols-2 gap-4">


                        {
                            user?.addresses?.map((address, index) => (

                                <div
                                    key={index}
                                    onClick={() => setSelectedAddress(address)}
                                    className={`
                                    cursor-pointer border rounded-xl p-4
                                    ${selectedAddress?._id === address._id
                                            ? "border-black bg-gray-100"
                                            : ""
                                        }
                                    `}
                                >

                                    <div className="flex justify-between">

                                        <h4 className="font-semibold">
                                            {address.fullName}
                                        </h4>


                                        <input
                                            type="radio"
                                            checked={
                                                selectedAddress?._id === address._id
                                            }
                                            readOnly
                                        />

                                    </div>


                                    <p className="text-sm mt-2">
                                        {address.addressLine}
                                    </p>


                                    <p className="text-sm">
                                        {address.city} - {address.pincode}
                                    </p>


                                    <p className="text-sm">
                                        {address.phone}
                                    </p>


                                </div>

                            ))
                        }





                    </div>



                    {/* Payment */}

                    <div className="mt-8">


                        <h3 className="font-semibold mb-3">
                            Payment Method
                        </h3>


                        <div className="grid md:grid-cols-2 gap-4">


                            <div
                                onClick={() => setPayment("cod")}
                                className={`
                                border rounded-xl p-4 cursor-pointer
                                ${payment === "cod"
                                        ? "border-black bg-gray-100"
                                        : ""
                                    }
                                `}
                            >

                                <div className="flex justify-between">

                                    <span>
                                        Cash On Delivery
                                    </span>


                                    <input
                                        type="radio"
                                        checked={payment === "cod"}
                                        readOnly
                                    />

                                </div>

                            </div>



                            <div
                                onClick={() => setPayment("online")}
                                className={`
                                border rounded-xl p-4 cursor-pointer
                                ${payment === "online"
                                        ? "border-black bg-gray-100"
                                        : ""
                                    }
                                `}
                            >

                                <div className="flex justify-between">

                                    <span>
                                        Online Payment
                                    </span>


                                    <input
                                        type="radio"
                                        checked={payment === "online"}
                                        readOnly
                                    />

                                </div>

                            </div>


                        </div>


                    </div>


                </div>





                {/* Summary */}

                <div className="bg-white rounded-xl shadow p-6 h-fit">


                    <h2 className="text-xl font-semibold mb-5">
                        Order Summary
                    </h2>


                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{cart.original_total}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Saving</span>
                            <span>₹{cart.original_total - cart.final_total}</span>
                        </div>


                        <hr />


                        <div className="flex justify-between font-semibold text-lg">

                            <span>Total</span>

                            <span>
                                ₹{cart.final_total}
                            </span>

                        </div>



                        <button
                            onClick={orderHandler}
                            className="
                            w-full bg-black text-white 
                            py-3 rounded-lg mt-5
                            "
                        >
                            Place Order
                        </button>


                    </div>


                </div>


            </div>


        </div>
    )
}