import { supportedMimeTypes } from '../config/filesystem.js';
import {v4 as uuidv4} from 'uuid';
import fs from 'fs';

export const imageValidator = (size, mime) => {
    if(bytesToMb(size) > 2) {
        return "File size should not be more than 2MB";
    }
    else if(!supportedMimeTypes.includes(mime)) {
        return "File type not supported. Image must be type of png. jpg,jpge,svg,webg, gif.";
    }
    else {
        return null;
    }
}

export const bytesToMb = (bytes) => {
    return bytes / (1024 * 1024);
}

export const generateRandomNumber = () => {
    return uuidv4();
}



export const getImageUrl = (imgName) => {
    return `${process.env.APP_URL}/images/${imgName}`;
};
  
export const removeImage = (imageName) => {
    const path = process.cwd() + "/public/images/" + imageName;
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
};

// * Upload image
export const uploadImage = (image) => {
    const imgExt = image?.name.split(".");
    const imageName = generateRandomNumber() + "." + imgExt[imgExt.length - 1];
    const uploadPath = process.cwd() + "/public/images/" + imageName;
    image.mv(uploadPath, (err) => {
      if (err) throw err;
    });
  
    return imageName;
};