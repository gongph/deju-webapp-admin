/**
 * 使用 Minio 上传图片
 * 相关文档： https://docs.min.io/docs/javascript-client-quickstart-guide.html
 */

const Minio = require('minio')
const fileReaderStream = require('filereader-stream')
import { getUuid } from './index.js'
import config from './config.js'
import { getMinioToken } from '@/api/minio'

// Init config
let minioClient = null
const defaultBucketName = 'boyuanziben'

getMinioToken().then(response => {
  if (response && response.data) {
    /* eslint-disable */ 
    const { region, port, useSSL, ...conf } = response.data
    minioClient = new Minio.Client(
      Object.assign({ useSSL: useSSL === 'true' ? true : false }, conf)
    )
  }
})

/**
 * 上传
 */
export function uploader(bucketName = defaultBucketName, file) {
  if (!file) return

  // 扩展名
  const ext = /\.[^\.]+$/.exec(file.name)[0]

  // Convert file to stream
  const fileStream = fileReaderStream(file)

  // UUID
  const uuid = getUuid()

  // File name
  const fileName = uuid + ext

  // Meta data
  const metaData = { 'Content-Type': fileStream.type }

  // 返回 Promise
  return new Promise((resolve, reject) => {
    minioClient.putObject(
      bucketName,
      fileName,
      fileStream,
      fileStream.size,
      metaData,
      (err, etag) => {
        if (err) {
          return reject(err)
        }
        console.log(`File '${fileStream.name}' uploaded successfully.`)
        resolve({
          bucketName,
          fileName,
          etag
        })
      }
    )
  })
}

/**
 * 预览图片
 * @param {String} [url] [图片地址]
 * @example
 * boyuanziben/20e14363-5e1a-49f2-b304-43ac5c175afe.jpg
 * @param {String} [thumbnailSize] [缩略图尺寸] 例如 `100x100`
 */
export function previewImage(url, thumbnailSize) {
  const size = thumbnailSize ? '_' + thumbnailSize : ''
  return getFullPath(url) + size
}

/**
 * 获取图片完整路径
 */
export function getFullPath(url) {
  return `${config.baseImgUrl}/${url}`
}

/**
 * 删除图片
 */
export function removeRemoteImage(bucketName = defaultBucketName, fileName) {
  return new Promise((resolve, reject) => {
    minioClient.removeObject(bucketName, fileName, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}
