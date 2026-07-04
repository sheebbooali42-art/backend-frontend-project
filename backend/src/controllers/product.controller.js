import ProductModel from "../models/product.model.js";
import CategoryModel from "../models/category.model.js";
import { sendBadRequest, sendConflict, sendCreated, sendNotFound, sendServerError, sendSuccess } from "../utils/response.js"
import RoomModel from "../models/room.model.js"

const get = async (req, res) => {
    try {

        const query = req.query;

        const filter = {};
        const sortBy = {};
        const limit = query.limit
            ? parseInt(query.limit)
            : 20;

        const skip = query.skip
            ? parseInt(query.skip)
            : 0;

        // Boolean Filters
        if (query.stock)
            filter.stock = query.stock === "true";

        if (query.bestSeller)
            filter.bestSeller = query.bestSeller === "true";

        if (query.newArrival)
            filter.newArrival = query.newArrival === "true";

        if (query.featured)
            filter.featured = query.featured === "true";

        // Room Filter
        if (query.room) {

            const roomSlugs = query.room.split(",");

            const rooms = await RoomModel.find({
                slug: { $in: roomSlugs }
            }).select("_id");



            const roomIds = rooms.map(
                room => room._id
            );

            filter.roomId = {
                $in: roomIds
            };
        }
        // Room Filter
        if (query.category) {

            const categorySlugs = query.category.split(",");

            const categories = await CategoryModel.find({
                slug: { $in: categorySlugs }
            }).select("_id");

            const cateogyryIds = categories.map(
                room => room._id
            );

            filter.categoryId = {
                $in: cateogyryIds
            };
        }

        if (query.min && query.max) {
            const min = Number(query.min);
            const max = Number(query.max);
            filter.salePrice = {
                $gte: min,
                $lte: max,
            }
        }

        if (query.sort) {
            if (query.sort == "asc") {
                sortBy.salePrice = 1
            } else if (query.sort = "desc") {
                sortBy.salePrice = -1

            } else {
                sortBy.createdAt = 1
            }
        }


        const products = await ProductModel
            .find(filter)
            .limit(limit)
            .skip(skip)
            .sort(sortBy)
            .populate([
                {
                    path: "roomId",
                    select: "_id name slug"
                },
                {
                    path: "categoryId",
                    select: "_id name slug"
                }
            ]);

        const total = await ProductModel.countDocuments(filter);

        return res.status(200).json({
            success: true,
            message: "Data found",
            products,
            meta: {
                limit,
                total,
                skip,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {

        console.log(error);

        sendServerError(
            res,
            "Internal Server Error"
        );
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id)
        return res.status(200).json({
            success: true,
            message: "Data find",
            product
        })

    } catch (error) {
        sendServerError(res, "Internal Server Error")
    }

}

const create = async (req, res) => {
    try {

        const { roomId,
            categoryId,

            name,
            slug,

            originalPrice,
            salePrice,
            discount,

            shortDescription,
            description,

            material,

            width,
            height,
            depth,

            weight,

            color,

            seoTitle,
            seoDescription
        } = req.body;



        // Image URL
        const thumbnail = req.file?.path || "";

        // Check Product Exists
        const product = await ProductModel.findOne({
            $or: [
                { slug },
                { name }
            ]
        });

        if (product) {
            return sendConflict(
                res,
                "Product already exists"
            );
        }

        await ProductModel.create({
            roomId,
            categoryId,

            name,
            slug,

            originalPrice,
            salePrice,
            discount,

            shortDescription,
            description,

            material,

            dimensions: {
                width,
                height,
                depth
            },

            weight,

            color,

            seoTitle,
            seoDescription,

            thumbnail
        });

        sendCreated(
            res,
            "Product created successfully"
        );

    }
    catch (error) {

        console.log(error);

        sendServerError(
            res,
            "Internal Server Error"
        );
    }
};
const update = async (req, res) => {

    try {

        const { id } = req.params;

        const { name, slug, roomId } = req.body;

        // =========================
        // Check Category Exists
        // =========================
        const oldCategory = await CategoryModel.findById(id);

        if (!oldCategory) {
            return sendNotFound(res, "Category not found");
        }

        // =========================
        // Duplicate Name Check
        // =========================
        const categoryExists = await CategoryModel.findOne({ name });

        if (categoryExists) {
            return sendConflict(res, "Category already exists");
        }

        // =========================
        // Update Object
        // =========================
        const updateData = {
            name,
            slug,
            roomId
        };

        // =========================
        // If New Image Uploaded
        // =========================
        if (req.file) {

            // Cloudinary URL
            updateData.image = req.file.path;
        }

        // =========================
        // Update Category
        // =========================
        await CategoryModel.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true
            }
        );

        return sendSuccess(
            res,
            "Category updated successfully"
        );

    }
    catch (error) {

        console.log(error);

        return sendServerError(
            res,
            "Internal Server Error"
        );
    }
};

const deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel.findById({ _id: id });
        if (!category) return sendNotFound(res);
        await CategoryModel.findByIdAndDelete(id)

        sendSuccess(res, "Delete Sucessfully")

    } catch (error) {
        sendServerError(res, "Internal Server Error")
    }

}

const StatusUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel.findById({ _id: id });
        if (!category) return sendNotFound(res);
        await CategoryModel.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    status: !category.status
                }
            }

        )

        sendSuccess(res, "Data Update Sucessfully")

    } catch (error) {
        sendServerError(res, "Internal Server Error")
    }

}


const StatusById = async (req, res) => {
    try {
        const { id } = req.params;
        const { flag } = req.body;
        const product = await ProductModel.findById({ _id: id });
        if (!product) return sendNotFound(res);


        await ProductModel.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    [flag]: !product[flag]
                }
            }
        )

        sendSuccess(res, "Status Update Sucessfully")

    } catch (error) {
        console.log(error)
        sendServerError(res, "Internal Server Error")
    }

}


const addImages = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await ProductModel.findById(id);

        if (!product) {
            return sendNotFound(res);
        }

        if (!req.files || req.files.length === 0) {
            return sendError(res, "Please upload images");
        }

        const images = req.files.map(file => file.url);

        // Add new images to existing images
        product.images.push(...images);

        await product.save();

        return sendSuccess(res, "Images added successfully");

    } catch (error) {
        console.log(error);
        return sendServerError(res, "Internal Server Error");
    }
};



export {
    get,
    create,
    StatusUpdate,
    deleteById,
    getById,
    update,
    StatusById,
    addImages
}