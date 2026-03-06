import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import mongoSanitize from 'express-mongo-sanitize'
import { DB_ADDRESS } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'
import { csrfProtection } from './middlewares/csrf'
import { generalLimiter } from './middlewares/rate-limit'

const { PORT = 3000 } = process.env
const app = express()

app.use(generalLimiter)

app.use(cookieParser())

app.use(csrfProtection)

app.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() })
})

app.use(cors())
// app.use(cors({ origin: ORIGIN_ALLOW, credentials: true }));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true, limit: '10mb' }))
app.use(json({ limit: '10mb' }))

app.use(
    mongoSanitize({
        replaceWith: '_',
        onSanitize: ({ req, key }) => {
            console.warn(`Попытка NoSQL инъекции: ${key} в ${req.path}`)
        },
    })
)

app.options('*', cors())
app.use(routes)
app.use(errors())
app.use(errorHandler)

// eslint-disable-next-line no-console

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
