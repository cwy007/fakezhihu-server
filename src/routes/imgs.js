const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');
const moment = require('moment');

const upload = async (ctx, next) => {
  const file = ctx.request.files.file;
  const hash = CryptoJS.MD5(`${file.path}_${moment()}`);
  const reader = fs.createReadStream(file.path);
  let filePath = path.join(__dirname, '../../public/images/upload') + `/${hash}.${file.name.split('.').pop()}`;
  const upStream = fs.createWriteStream(filePath);
  reader.pipe(upStream);
  ctx.body = {
    // 201(已创建)请求成功并且服务器创建了新的资源
    status: 201,
    url: filePath,
    fileName: `${hash}.${file.name.split('.').pop()}`
  };
};

module.exports = {
  "POST /imgs/upload": upload
}