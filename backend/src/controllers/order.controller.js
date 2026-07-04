import mongoose from "mongoose";
import CartModel from "../models/cart.model.js";
import OrderModel from "../models/order.model.js";
import Razorpay from "razorpay"
var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
import crypto from "crypto"

import {
    sendBadRequest,
    sendSuccess,
    sendServerError,
    sendNotFound
} from "../utils/response.js";


const place = async (req, res) => {
    try {
        const userId = req.user._id;
        const { shippingAddress, paymentMethod } = req.body;

        if (!shippingAddress || !paymentMethod) {
            return sendBadRequest(
                res,
                "Shipping address and payment method required"
            );
        }
        const cart = await CartModel.findOne({ userId })
            .populate({
                path: "items.productId",
                select: "name _id salePrice originalPrice discount thumbnail"
            });

        if (!cart) {
            return sendNotFound(res, "Cart not found");
        }

        if (!cart.items.length) {
            return sendBadRequest(res, "Cart is empty");
        }

        const items = cart.items.map((item) => {
            const product = item.productId;
            const price = product.salePrice || product.originalPrice;
            return {
                product_id: product._id,
                qty: item.qty,
                price,
                total: price * item.qty
            }

        });

        const totalAmount = items.reduce(
            (sum, item) => sum + item.total,
            0
        );

        const order = await OrderModel.create({
            user: userId,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod,
            paymentStatus: "pending"
        });

        if (paymentMethod === "cod") {
            return res.status(201).json({
                message: "Order create",
                success: true,
                orderId: order._id
            })

        } else {

            var options = {
                amount: totalAmount * 100,  // Amount is in currency subunits. 
                currency: "INR",
                receipt: order._id
            };

            instance.orders.create(options, async function (err, razorpay_order) {
                if (err) {
                    return sendServerError(res)
                }

                order.razorpay_order_id = razorpay_order.id
                await order.save();
                return res.status(200).json({
                    message: "order",
                    success: true,
                    orderId: order._id,
                    razorpay_order_id: razorpay_order.id,
                    total: totalAmount * 100
                })


            });
        }


    } catch (error) {
        console.log(error);
        return sendServerError(
            res,
            "Internal Server Error"
        );

    }
};


const read = async (req, res) => {
    try {

        const {
            page = 1,
            limit = 10,
            search = "",
            status,
            paymentStatus,
            startDate,
            endDate,
            minAmount,
            maxAmount,
            sortBy = "createdAt",
            sortOrder = "desc"
        } = req.query;


        let query = {};


        // Status filter
        if (status) {
            query.orderStatus = status;
        }


        // Payment filter
        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }


        // Amount filter
        if (minAmount || maxAmount) {
            query.totalAmount = {};

            if (minAmount) {
                query.totalAmount.$gte = Number(minAmount);
            }

            if (maxAmount) {
                query.totalAmount.$lte = Number(maxAmount);
            }
        }


        // Date filter
        if (startDate || endDate) {

            query.createdAt = {};

            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }

            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }


        // Search
        if (search) {

            query.$or = [
                {
                    orderId: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    "shippingAddress.name": {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    "shippingAddress.email": {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];

        }


        // Sorting
        const sort = {};

        sort[sortBy] = sortOrder === "asc" ? 1 : -1;


        const skip = (Number(page) - 1) * Number(limit);



        const orders = await OrderModel
            .find(query)
            .populate("user")
            .populate("products.product")
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));


        const totalOrders = await OrderModel.countDocuments(query);



        return res.status(200).json({
            success:true,
            message:"Orders fetched",
            pagination:{
                total:totalOrders,
                page:Number(page),
                limit:Number(limit),
                totalPages:Math.ceil(
                    totalOrders / Number(limit)
                )
            },
            orders
        })


    } catch (error) {

        return sendServerError(
            res,
            "Internal Server Error"
        );

    }
}


const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;


        const order = await OrderModel.findOne({ razorpay_order_id: razorpay_order_id })
       
        // STEP 1: Create expected signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        // STEP 2: Compare signatures
        if (expectedSignature === razorpay_signature) {

            // Payment Verified
            // Yaha DB me order update karo (paid = true)
            order.razorpay_payment_id = razorpay_payment_id;
            order.paymentStatus = "paid";
            await order.save();


            return res.status(200).json({
                success: true,
                message: "Payment Verified Successfully"
            });


        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid Signature"
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};






export {
    place,
    read,
    verifyPayment
};