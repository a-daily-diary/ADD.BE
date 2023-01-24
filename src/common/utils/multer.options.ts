import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const createFolder = (folder: string) => {
  const uploadsFolderPath = path.join(__dirname, '..', 'uploads');
  const newFolderPath = path.join(uploadsFolderPath, folder);

  if (!fs.existsSync(uploadsFolderPath)) {
    fs.mkdirSync(uploadsFolderPath);
  } else {
    console.log('The root folder already exists...🔥');
  }

  if (!fs.existsSync(newFolderPath)) {
    fs.mkdirSync(newFolderPath);
  } else {
    console.log('The folder already exists...🔥');
  }
};

const storage = (folder: string): multer.StorageEngine => {
  createFolder(folder);
  return multer.diskStorage({
    destination(req, res, callback) {
      const folderName = path.join(__dirname, '..', `uploads/${folder}`);
      callback(null, folderName);
    },
    filename(req, file, callback) {
      const ext = path.extname(file.originalname);
      const fileName = `${path.basename(
        file.originalname,
        ext,
      )}${Date.now()}${ext}`;
      callback(null, fileName);
    },
  });
};

export const multerOption = (folder: string): MulterOptions => {
  return {
    storage: storage(folder),
  };
};
