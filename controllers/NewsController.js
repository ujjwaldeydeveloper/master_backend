import vine, {errors} from "@vinejs/vine";
import { newsSchema } from "../validations/newsValidation.js";
import { imageValidator, uploadImage,removeImage } from "../utils/helper.js";
import prisma from "../DB/db.config.js";
import NewsApiTransform from "../transform/newsApiTransform.js";

class NewsController {
    static async index(req, res) {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 1); // 10;

        if(page <= 0) {
            page
        }
        if(limit <= 0 || limit > 100) {
            limit = 10;
        }
        const skip = (page - 1) * limit;
        try {
            const news = await prisma.news.findMany({
                take: limit,
                skip: skip,
                include: {
                    user:  {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profile: true,
                        }
                    }
                }
            });
            const newsTransform = news?.map((item) => NewsApiTransform.transform(item));
            const totalNews = await prisma.news.count();
            const totalPages = Math.ceil(totalNews / limit);
            return res.json({ status: 200, news: newsTransform, metaData: {
                 totalPages: totalPages, 
                 currentPage: page, 
                 currentLimit: limit,
                } 
            });
        } catch (error) {
            console.error("Error fetching news:", error);
            return res.status(500).json({ status: 500, message: "Internal server error" });
        }

    } 

    static async store(req, res) {
        try {
            const user = req.user;
            const body = req.body;
            const validator = vine.compile(newsSchema);
            const payload = await validator.validate(body);

            if(!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({ 
                    errors: {
                        image: "Image field is required."
                    }, 
                });
            }
            const image = req.files?.image;
            // * Image 
            const message = imageValidator(image?.size, image?.mimetype);
            if(message != null) {
                return res.status(400).json({
                    errors: {
                        image: message,
                    }
                })
            }
            
            //   * Image upload
            const imageName = uploadImage(image);
            payload.image = imageName;
            payload.user_id = user.id;

            const news = await prisma.news.create({
                data: payload,
            });

            return res.json({
                status: 200,
                message: "News created successfully!",
                news,
              });
              

        } catch (error) {
            console.log(error);
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({ messages: error.messages });
            } else {
                return res.status(500).json({ status: 500, message: 'Something went wrong.Please try again.' });
            }
        }

    }

    static async show(req, res) {
        try {
            const {id} = req.params;
        const news = await prisma.news.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profile: true,
                    }
                }
            }
        });
        const transformedNews = news ? NewsApiTransform.transform(news) : null;
        console.log(transformedNews);
        return res.json({ status: 200, news: transformedNews });
        } catch (error) {
            console.error("Error fetching news:", error);
            return res.status(500).json({ status: 500, message: "Internal server error" });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
        const user = req.user;
        const body = req.body;
        let imageName = undefined;
        const news = await prisma.news.findUnique({ 
            where: {
                id: Number(id),
            },
        });

        if(user.id != news.user_id) {
            return res.status(403).json({ status: 403, message: "You are not authorized to perform this action." });
        }
        const validator = vine.compile(newsSchema);
        const payload = await validator.validate(body);
        const image = req?.files?.image;

        if(image) {
            const message = imageValidator(image?.size, image?.mimetype);
            if (message != null) {
                return res.status(400).json({ errors: { image: message } });
            }

            // * Upload a new image
            imageName = uploadImage(image);
            payload.image = imageName;
            // * Delete old image
            removeImage(news.image);
        }
        await prisma.news.update({
            data: payload,
            where: {
                id: Number(id),
            },
        });

        return res.json({
            status: 200,
            message: "News updated successfully!",
            news,
          });
        } catch (error) {
            if(error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({ messages: error.messages });
            } else {
                console.error("Error updating news:", error);
                return res.status(500).json({ status: 500, message: "Internal server error" });
            }
        }


    }

    static async destroy(req, res) {
        try {
            const { id } = req.params;
            const user = req.user;

            const news = await prisma.news.findUnique({
                where: {
                    id: Number(id),
                }
            });

            if (!news) {
                return res.status(404).json({ status: 404, message: "News not found." });
            }

            if (user.id !== news.user_id) {
                console.log("User id:", user.id);
                console.log("News user id:", news.user_id);
                return res.status(401).json({ status: 401, message: "You are not authorized to perform this action." });
            }

            // * Delete image from filesystem
            removeImage(news.image);
            await prisma.news.delete({
                where: {
                    id: Number(id),
                },
            });
            return res.json({ status: 200, message: "News deleted successfully!" });
        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({ messages: error.messages });
            } else {
                console.error("Error updating news:", error);
                return res.status(500).json({ status: 500, message: "Internal server error" });
            }
        }
    }
}

export default NewsController;