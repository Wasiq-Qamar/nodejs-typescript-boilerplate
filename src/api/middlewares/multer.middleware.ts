import multer from 'multer';
import path from 'path';
import {ErrorManager, Logger} from '../../utils';
import {Errors} from '../../interface';

class MulterMiddleware {
  constructor() {}

  uploadFiles(): multer.Multer {
    const multerUpload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 50 * 1024 * 1024, // no larger than 50mb,
      },
      fileFilter: function (req, file, cb) {
        Logger.getLogger().info(`FILE: ${file.originalname}`);
        const filetypes = /jpeg|jpg|png|csv|xlsx/;
        const extname = filetypes.test(
          path.extname(file.originalname).toLowerCase()
        );
        if (extname) {
          return cb(null, true);
        }

        cb(
          ErrorManager.getError(
            Errors.CUSTOM_ERROR,
            null,
            'File upload only supports the following filetypes - ' + filetypes
          )
        );
      },
    });

    return multerUpload;
  }
}

export {MulterMiddleware};
