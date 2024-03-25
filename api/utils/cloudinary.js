const fs = require("fs");

// import {v2 as cloudinary} from 'cloudinary';
const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'dct9obo0s', 
  api_key: '662924679281363', 
  api_secret: 'XMFFIbsiSR19oMipbsBZfJIlWnA' 
});

const uploadOnCloudinary = async (localFilePath) => {
    try
    {
        if(!localFilePath) return null;
        //upload on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        //file has been uploaded successfully
        console.log("file uploaded on cloudinary");
        console.log(response.url);

        return response;
    }
    catch(error)
    {
        //if file not uploaded then remove it from server
        fs.unlinkSync(localFilePath);
        console.log("file not uploaded on cloudinary");
        console.log(error);
        return null;
    }
}

module.exports =  {uploadOnCloudinary};