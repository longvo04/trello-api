import multer from 'multer'
import { LIMIT_COMMON_FILE_SIZE, ALLOW_COMMON_FILE_TYPES } from '../utils/validators.js'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'

const customFileFilter = (req, file, callback) => {
  if (ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    callback(null, true)
  } else {
    callback(new ApiError(StatusCodes.BAD_REQUEST, 'Invalid file type'), null)
  }
}

const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customFileFilter
})

export const uploadMulterMiddleware = {
  upload
}