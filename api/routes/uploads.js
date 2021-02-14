const fs = require('fs')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const sharp = require('sharp')
const auth = require('../config/auth')

const UPLOAD_PATH = 'api/uploads/'
const IMAGES_PATH = UPLOAD_PATH + 'images/'
const THUMBS_PATH = UPLOAD_PATH + 'thumbs/'
const DOCUMENTS_PATH = UPLOAD_PATH + 'documents/'
const AUDIOS_PATH = UPLOAD_PATH + 'audios/'
const IMPORTS_PATH = UPLOAD_PATH + 'import/'
!fs.existsSync(UPLOAD_PATH) && fs.mkdirSync(UPLOAD_PATH)
!fs.existsSync(IMAGES_PATH) && fs.mkdirSync(IMAGES_PATH)
!fs.existsSync(THUMBS_PATH) && fs.mkdirSync(THUMBS_PATH)
!fs.existsSync(DOCUMENTS_PATH) && fs.mkdirSync(DOCUMENTS_PATH)
!fs.existsSync(AUDIOS_PATH) && fs.mkdirSync(AUDIOS_PATH)
!fs.existsSync(IMPORTS_PATH) && fs.mkdirSync(IMPORTS_PATH)

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
  [auth.authenticated, imageUploader.single('image')],
  (req, res) => {
    const url = req.file.filename
    const original = IMAGES_PATH + url
    const thumb = THUMBS_PATH + url

    sharp(original)
      .resize(250)
      .toFile(thumb, function (err) {
        if (!err) {
          res.status(201).send({
            url: original,
            thumb,
          })
        }
      })
  }
)

const documentStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, DOCUMENTS_PATH)
  },
  filename(req, file, cb) {
    let filename = file.originalname
    if (fs.existsSync(DOCUMENTS_PATH + filename)) {
      const nameArr = filename.split('.')
      nameArr[0] += '-' + Date.now()
      filename = nameArr.join('.')
    }
    cb(null, filename)
  },
})
const documentUploader = multer({
  storage: documentStorage,
  limits: {
    fileSize: 32 * 1024 * 1024,
  },
})
router.post(
  '/documents',
  [auth.authenticated, documentUploader.single('document')],
  (req, res) => {
    const url = req.file.filename
    res.status(201).send(DOCUMENTS_PATH + url)
  }
)

const audioStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, AUDIOS_PATH)
  },
  filename(req, file, cb) {
    let filename = file.originalname
    if (fs.existsSync(AUDIOS_PATH + filename)) {
      const nameArr = filename.split('.')
      nameArr[0] += '-' + Date.now()
      filename = nameArr.join('.')
    }
    cb(null, filename)
  },
})
const audioUploader = multer({
  storage: audioStorage,
  limits: {
    fileSize: 32 * 1024 * 1024,
  },
})
router.post(
  '/audios',
  [auth.authenticated, audioUploader.single('audio')],
  (req, res) => {
    const url = req.file.filename
    res.status(201).send(AUDIOS_PATH + url)
  }
)

module.exports = router
