export const imageValidator = (size, mime) => {
    if(bytesToMb(size) > 2) {
        return "File size should not be more than 2MB";
    }
}

export const bytesToMb = (bytes) => {
    return bytes / (1024 * 1024);
}

