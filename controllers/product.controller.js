import ProductModel from '../models/product.model.js'
import { createError } from '../error.js'

export const createProduct = async(req, res, next) => {
    try {
        const data = req.body

        if (data.name || data.price) {
            return res.json(createError(400, "name or price is missing in payload"))
        }

        const product = await ProductModel.create(data)
        res.status(201).json({
            data: product
        })
    } catch (err) {
        next(err)
    }
}

export const getAllProductsByQ = async(req, res, next) => {
    try {
        const { feature, company, search, sort, fields, numericFilters } = req.query
        const queryObject = {}

        if (feature) {
            queryObject.feature = feature === "true" ? true : false
        }
        if (company) {
            queryObject.company = company
        }
        if (search) {
            queryObject.name = { $ragex: search, $options: "i" }
        }
        if (numericFilters) {
            const operatorMap = {
                '>': '$gt',
                '<': '$lt',
                '=': '$eq',
                '>=': '$gte',
                '<=': '$lte'
            }
            const regEx = /\b(< | > | >= | <= | = |)\b/
            let filter = numericFilters.replace(
                regEx,
                (match) => `-${operatorMap[match]}-`
            )
            const options = ["price", "rating"]
            filter = filter.split(",").forEach(item => {
                const [field, operator, value] = item.split("-")
                if (options.includes(field)) {
                    queryObject[field] = {
                        [operator]: Number(value)
                    }
                }
            })
        }
        // let result = await ProductModel.find(queryObject)
        let sortList
        let selectList
        if (sort) {
            sortList = sort.split(',').join(" ")
                // result = result.sort(sortList)
        } else {
            sortList = "createdAt"
        }

        if (fields) {
            selectList = fields.split(',').join(" ")
                // result = result.select(selectList)
        }

        const pages = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 30
        const skip = (pages - 1) * limit

        // result = result.skip(skip).limit(limit)

        const products = await ProductModel.find(queryObject).sort(sortList).select(selectList).skip(skip).limit(limit)
        res.status(200).json({
            data: products,
            length: products.length
        })

        // let sortList
        // if (sort) {
        //     sortList = sort.split(',').join(" ")
        //     const products = await ProductModel.find(queryObject).sort(sortList)
        //     res.status(200).json({
        //         data: products,
        //         length: products.length
        //     })
        // } else {
        //     const products = await ProductModel.find(queryObject).sort('createdAt')
        //     res.status(200).json({
        //         data: products,
        //         length: products.length
        //     })
        // }

    } catch (err) {
        next(err)
    }
}

export const getProductById = async(req, res, next) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.json(createError(400, "id is missing in payload"))
        }

        const product = await ProductModel.findById(id)
        if (!product) {
            return res.json(createError(404, "no product found with this id"))
        }

        res.status(200).json({
            data: product
        })
    } catch (err) {
        next(err)
    }
}

export const deleteProduct = async(req, res, next) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.json(createError(400, "id is missing in payload"))
        }

        const product = await ProductModel.findByIdAndDelete(id)
        if (!product) {
            return res.json(createError(404, "no product found with this id"))
        }

        res.status(200).json({
            data: product
        })
    } catch (err) {
        next(err)
    }
}

export const updateProduct = async(req, res, next) => {
    try {
        const { id } = req.params
        const data = req.body
        if (!id) {
            return res.json(createError(400, "id is missing in payload"))
        }

        const product = await ProductModel.findByIdAndUpdate(id, data, {
            new: true
        })
        if (!product) {
            return res.json(createError(404, "no product found with this id"))
        }

        res.status(200).json({
            data: product
        })
    } catch (err) {
        next(err)
    }
}