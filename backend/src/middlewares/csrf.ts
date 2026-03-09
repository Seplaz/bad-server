import csrf from 'csurf'

export const csrfProtection = csrf({
    value: (req) =>
        req.header('X-CSRF-Token') ||
        req.cookies?.['XSRF-TOKEN'] ||
        req.body?._csrf ||
        req.query?._csrf ||
        '',
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    },
})
