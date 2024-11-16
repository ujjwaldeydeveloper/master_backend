import vine from "@vinejs/vine";
import { CustomErrorReporter } from "./CustomErrorReporter.js";


vine.errorReporter = () => new CustomErrorReporter();


export const newsSchema = vine.object({
    title: vine.string().minLength(5).maxLength(190),
    content: vine.string().maxLength(10000),
    // image: vine.string().minLength(6),
    // category: vine.string().minLength(2).maxLength(150),
})