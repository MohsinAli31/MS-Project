export const generateToken = (user, statusCode, message, res) => {
    const token= user.generateToken();

    res.status(statusCode).cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // 7 days
}).json({
        success: true,
        user,
        token,
        message,
});

}