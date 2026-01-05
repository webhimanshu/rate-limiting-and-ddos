import express from "express";
import rateLimit from 'express-rate-limit';
const app = express();
app.use(express.json());
const otpStore = {};
// Rate limiter configuration
const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // Limit each IP to 3 OTP requests per windowMs
    message: 'Too many requests, please try again after 5 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const passwordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 password reset requests per windowMs
    message: 'Too many password reset attempts, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});
app.get("/", (req, resp) => {
    resp.json("Hello from server");
});
//End point for generate otp
app.post("/generate-otp", otpLimiter, (req, resp) => {
    const email = req.body.email;
    console.log("🚀 ~ email:", email);
    // step1: Check email
    if (!email) {
        return resp.status(400).json({ message: "Email is required" });
    }
    //step2: Generate otp of 6 digit
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;
    console.log(`OTP for ${email}: ${otp}`);
    //step3: send  otp to user via email or message
    //step4: response
    resp.status(200).json({ message: "OTP generated and logged" });
});
//End point for reset password
app.post("/reset-password", passwordResetLimiter, (req, resp) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return resp
            .status(400)
            .json({ message: "Email, OTP, and new password are required" });
    }
    if (otpStore[email] === otp) {
        console.log(`Password for ${email} has been reset to: ${newPassword}`);
        delete otpStore[email];
        resp.status(200).json({ message: "Password has been reset successfully" });
    }
    else {
        resp.status(401).json({ message: "Invalid OTP" });
    }
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
//# sourceMappingURL=index.js.map