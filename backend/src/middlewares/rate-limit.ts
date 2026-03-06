import rateLimit from 'express-rate-limit'

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Слишком много запросов, попробуйте позже',
    standardHeaders: true,
    legacyHeaders: false,
})

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Слишком много попыток входа, попробуйте через 15 минут',
    skipSuccessfulRequests: true,
})

export const orderLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: 'Слишком много заказов, подождите минуту',
})
