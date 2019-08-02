const fs = require('fs');
const path = require('path');
const rootPath = path.resolve(__dirname, '..');
const filePath = path.resolve(__dirname, '../source/_posts');
const fileList = []
let str = `
# 博客

[![Build Status](https://www.travis-ci.org/tcly861204/blog.svg?branch=master)](https://www.travis-ci.org/tcly861204/blog)

## 学习笔记


`
const files = fs.readdirSync(filePath);
function readFile(files, index) {
  let filename = files[index]
  let filedir = path.join(filePath, filename);
  fs.stat(filedir,function(eror, stats){
    if (eror) {
      console.warn('获取文件stats失败');
    } else {
      const isFile = stats.isFile();//是文件
      if (isFile) {
        let content = fs.readFileSync(filedir, 'utf-8');
        let startIndexOf = content.indexOf('date: ')
        if (startIndexOf > 0) {
          let date = content.substr(startIndexOf + 6, 10)
          let name = filename.replace('.md', '')
          fileList.push({
            date: date.replace(/-/g, ''),
            content: '. [' + name + '](https://tcly861204.github.io/' + date.replace(/\-/g, '/') + '/' + name + '/)\r\n'
          })
        }
        if (index < files.length - 1) {
          index++
          readFile(files, index)
        } else {
          fileList.sort((a, b) => {
            return (a.date - b.date) < 0
          })
          fileList.map((item, index) => {
            str += (index + 1) + item.content
          })
          fs.writeFileSync(`${rootPath}/README.md`, str, function(err){
            if (err) throw err
          })
        }
      }
    }
  })
}
readFile(files, 0)
