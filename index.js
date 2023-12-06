const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const userRouter = require('./Users/router/router')
const categoryRouter = require('./Categories/router/router')
const subcategoryRouter = require('./Subcategories/router/router')
const sectionRouter = require('./Sections/router/router')
const productRouter = require('./Products/router/router')
const port = process.env.PORT || 3002;

app.use(cors())
app.use(express.json())

app.use('/users', userRouter)
app.use('/items/category', categoryRouter)
app.use('/items/subcategory', subcategoryRouter)
app.use('/items/section', sectionRouter)
app.use('/items/product', productRouter)

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://musiienkodev:Jbg3GCanvcBEVR8m@88db.kqy2jpz.mongodb.net/');
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

    } catch (e) {
        console.log(e)
    }
}
start();
