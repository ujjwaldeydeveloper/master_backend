
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

    static update() {
        const {id} = req.params;
        const authUser = req.user;

        if(!req.files || Object.keys(req.files).length == 0) {
            return res.status(400).json({status: 400, message: "No files were uploaded. Profile is required."});
        }
    }

    static async destroy() {

    }
}

export default ProfileCntroller;