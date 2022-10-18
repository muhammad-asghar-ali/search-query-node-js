import express from "express"
import { createProduct, getAllProductsByQ, getProductById, deleteProduct, updateProduct } from "../controllers/product.controller.js"

const router = express.Router()

router.post('/', createProduct)
router.get('/', getAllProductsByQ)
router.get('/find/:id', getProductById)
router.delete('/:id', deleteProduct)
router.put('/:id', updateProduct)



export default router