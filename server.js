import express from 'express'
import { APP_SERVER_PORT } from './config/index.js'
import router from './router/index.js'
import errhandler from './middleware/errhandler.js'
import mongoose from 'mongoose'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
mongoose.connect('mongodb://0.0.0.0:27017/yagnik')
const app = express()

const _dirname = dirname(fileURLToPath(import.meta.url))
global.AppRoot= path.resolve(_dirname)

app.use(express.urlencoded({extended:false}))
app.use('/upload',express.static('upload'))
app.use(express.json())
app.use(router)
app.use(errhandler)

app.listen(APP_SERVER_PORT,()=>{
    console.log(`server is running ${APP_SERVER_PORT}`)
})