const fs = require('fs')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const sharp = require('sharp')
const { authenticated } = require('../config/auth')

const UPLOAD_PATH = 'api/uploads/'
const IMAGES_PATH = UPLOAD_PATH + 'images/'
const THUMBS_PATH = UPLOAD_PATH + 'thumbs/'
!fs.existsSync(UPLOAD_PATH) && fs.mkdirSync(UPLOAD_PATH)
!fs.existsSync(IMAGES_PATH) && fs.mkdirSync(IMAGES_PATH)
!fs.existsSync(THUMBS_PATH) && fs.mkdirSync(THUMBS_PATH)

const imageStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, IMAGES_PATH)
  },
  filename(req, file, cb) {
    let filename = file.originalname
    if (fs.existsSync(IMAGES_PATH + filename)) {
      const nameArr = filename.split('.')
      nameArr[0] += '-' + Date.now()
      filename = nameArr.join('.')
    }
    cb(null, filename)
  },
})
const imageUploader = multer({
  storage: imageStorage,
  limits: {
    fileSize: 32 * 1024 * 1024,
  },
})

router.post(
  '/images',
  [authenticated, imageUploader.single('image')],
  (req, res) => {
    const url = req.file.filename
    const original = IMAGES_PATH + url
    const thumb = THUMBS_PATH + url

    sharp(original)
      .resize({
        width: 200,
        height: 200,
        withoutEnlargement: true,
        fit: sharp.fit.cover,
      })
      .toFile(thumb, function (err) {
        if (!err) {
          res.status(201).send({
            url: '/' + original,
            thumb: '/' + thumb,
          })
        }
      })
  }
)

module.exports = router
