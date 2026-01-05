import express from "express";

const app = express();
app.use(express.json());

const otpStore: Record<string, string> = {};

app.get("/", (req, resp) => {
  resp.json("Hello from server");
});

//End point for generate otp
app.post("/generate-otp", (req, resp) => {
  const email = req.body.email;
  console.log("🚀 ~ email:", email)

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
app.post("/reset-password", (req, resp) => {
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
  } else {
    resp.status(401).json({ message: "Invalid OTP" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
