import prisma from "../DB/db.config.js";
import { errors } from "@vinejs/vine";
import { generateRandomNumber, imageValidator } from "../utils/helper.js";
// import { sign } from "jsonwebtoken";

class ProfileCntroller {
    static async index( req, res) {
        try {
            const user = req.user;
            return res.json({status: 200, message: "User profile", user});
        } catch (error) {
            return res.status(500).json({status: 500, message: "Internal server error"});
        }

    }

    static async store() {

    }

    static async show() {

    }

    static async update(req, res) {
       try {
        const {id} = req.params;
        const authUser = req.user;

        if(!req.files || Object.keys(req.files).length == 0) {
            return res.status(400).json({status: 400, message: "No files were uploaded. Profile is required."});
        }

        const profile = req.files.profile;
        const message = imageValidator(profile?.size, profile.mimetype);

        if(message != null) {
            return res.status(400).json({status: 400, errors: {profile: message},});
        }

        const imgExt = profile.name.split(".");
        const imgName =  generateRandomNumber() + "." + imgExt;
        const uploadPath = process.cwd() + "/public/images/" + imgName;

        profile.mv(uploadPath, (err) => {
            if(err) {
                return res.status(500).json({status: 500, message: "Internal server error"});
            }
        });

        await prisma.users.update({
            where: {
                id: Number(id),
            },
            data: {
                profile: imgName,
            },
        });

        return res.json({
            status: 200,
            message: "Profile updated successfully",
            name: profile.name,
            size: profile?.size,
            mime: profile?.mimetype,
        });
       } catch (error) {
           console.log(error);
           return res.status(500).json({status: 500, message: "Internal server error"});
       }
    }

    static async destroy() {

    }
}

export default ProfileCntroller;