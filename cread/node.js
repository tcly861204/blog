const fs = require('fs');
const path = require('path');
const rootPath = path.resolve(__dirname, '..');
const filePath = path.resolve(__dirname, '../source/_posts');
let str = `# blog
个人创作

[![Build Status](https://www.travis-ci.org/tcly861204/blog.svg?branch=master)](https://www.travis-ci.org/tcly861204/blog)

## 学习笔记


`
const files = fs.readdirSync(filePath);
files.forEach(function(filename, _index){
  let filedir = path.join(filePath, filename);
  fs.stat(filedir,function(eror, stats){
    if (eror) {
      console.warn('获取文件stats失败');
    } else {
      const isFile = stats.isFile();//是文件
      // const isDir = stats.isDirectory();//是文件夹
      if (isFile) {
        let content = fs.readFileSync(filedir, 'utf-8');
        let startIndexOf = content.indexOf('date: ')
        if (startIndexOf > 0) {
          let date = content.substr(startIndexOf + 6, 10)
          let name = filename.replace('.md', '')
          str += '[' + name + '](https://tcly861204.github.io/' + date.split('-').join('/') + '/' + name + '/)\r\n\r\n'
        }
        if (_index === files.length - 1) {
          fs.writeFileSync(`${rootPath}/README.md`, str, function(err){
            if (err) throw err
          })
        }
      }
    }
  })
})
