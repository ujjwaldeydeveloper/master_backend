import prisma from "../DB/db.config.js";
// import vine from "@vinejs/vine";
import vine, {errors} from "@vinejs/vine";
import { registerSchema } from "../validations/authValidation.js";
import bcrypt from "bcryptjs";

class AuthController {
    static async register (req, res) {

        try {
            const body = req.body;
            const validator = vine.compile(registerSchema);
            const payload = await validator.validate(body);

            // email unique check
            const emailExists = await prisma.users.findUnique({
                where: {
                    email: payload.email
                }
            });

            if (emailExists) {
                return res.status(400).json({ message: "Email already exists" });
            }

            // * encrypt the password
            const salt = bcrypt.genSaltSync(10);
            payload.password = bcrypt.hashSync(payload.password, salt);

            const user = await prisma.users.create({
                data: payload
            });

            return res.json({status: 200, messages: "User created successfully", payload,});
        } catch (error) {
            // return res.status(400).json({ message: error.message });
            console.log(error);
            // if (error.name === 'ValidationError') {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({ messages: error.messages });
            } else {
            return res.status(500).json({ status: 500, message: 'Internal Server Error' });
            }
        }
    }
}

export default AuthController;

// import prisma from "../DB/db.config.js";
// import vine from "@vinejs/vine";
// import { registerSchema } from "../validations/authValidation.js";

// class AuthController {
//     static async register(req, res) {
//         try {
//             const body = req.body;
//             const validator = vine.compile(registerSchema);
//             const payload = await validator.validate(body);

//             // Simulate processing delay
//             // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate a 1-second delay

//             // Process the request (e.g., save to database)
//             // Example: await prisma.user.create({ data: payload });

//             // Send the final response
//             return res.json({ message: "Processing complete", payload });
//         } catch (error) {
//             if (error instanceof errors.E_VALIDATION_ERROR) {
//                 return res.status(400).json({ message: error.message });
//             }
//             // Handle other types of errors if necessary
//             return res.status(500).json({ message: 'Internal Server Error' });
//         }
//     }
// }

// export default AuthController;