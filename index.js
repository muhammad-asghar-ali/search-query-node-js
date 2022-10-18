import express from "express"
import cors from "cors"
import morgan from "morgan"
import dotenv from "dotenv"
import connect from "./db.js"
import productRoutes from "./routes/product.route.js"

dotenv.config()

const app = express()

app.use(morgan("dev"))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connect()

app.use((req, res) => {
    res.status(400).json({ error: "Route does not found" })
})

app.use('/api/vi/product', productRoutes)

const port = process.env.PORT || 3001

// error handling
app.use((err, req, res, next) => {
    const status = err.status || 500
    const message = err.message || "something went wrong"
    return res.status(status).json({
        success: false,
        status,
        message
    })
})

app.listen(port, () => {
    console.log(`app is running on port ${port}`)
})