## abookmark

基于 wokoo 搭建的初始化工程，用于油猴插件开发。
一个书签工具插件 用于 tampermonkey，可以导入导出浏览器书签，用来夸浏览器和平台使用你的书签。用了cheerio,react,antd等库

目前webdav同步功能未完成

**基础配置：**

- react
- less
- webpack

## 目录结构

```
.
├── README.md 说明
├── package-lock.json
├── package.json
├── public 静态文件
│   ├── favicon.ico
│   ├── icon.jpg
│   └── index.html html 文件
├── src
│   ├── app.less
│   ├── app.js
│   └── index.js 项目入口
├── tampermonkey.txt 油猴脚本入口文件
├── webpack.config.base.js
└── webpack.config.js webpack 配置
```

## 开发

**启动**
进入项目目录后，在命令行中输入：

```shell
npm start
```

**调试**

1. 打开浏览器，输入`localhost:8080`，查看页面展示是否正常。
2. 安装油猴插件
3. 打开油猴插件编辑界面，将 tampermonkey.txt 里的内容复制到编辑框中，保存。
4. 打开任意一个网页，比如`www.baidu.com`，



**构建**

```shell
npm run build
```


