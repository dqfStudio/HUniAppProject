# HUniAppProject开发指南

 当前项目使用uni-app框架进行开发，一套代码可以打包小程序和H5
 
 HBuilder账号用于打包和安装插件

## 目录结构

	.
	├── components                  # 符合vue组件规范的uni-app组件，以及额外自定义组件
	├── pages                       # 业务页面文件存放的目录
	├── static                      # 存放应用引用的本地静态资源（如图片、视频等）的目录，注意：静态资源只能存放于此
	├── store                       # vuex状态管理
	├── uni_modules                 # 存放[uni_module](/uni_modules)规范的插件
	├── unpackage                   # 项目生成文件目录
	├── utils                       # 公用基础js（如接口地址配置、请求接口封装）
	│   ├── config.js               # 配置接口地址、公用方法
	│   └── request.js              # 请求接口封装
	├── main.js                     # Vue初始化入口文件
	├── App.vue                     # 应用配置，用来配置App全局样式以及监听 应用生命周期
	├── manifest.json               # 配置应用名称、appid、logo、版本等打包信息
	├── pages.json                  # 配置页面路由、导航条、选项卡等页面类信息
	├── pc.html                     # web页面用于辅助pc上显示h5页面，注：当打包H5时需要把 pc.html 拷贝到根目录下
	├── template.h5.html            # 生成打包H5，页面入口模版
	├── H5                          # 用于嵌套真实H5外壳，便于ios保存桌面全屏显示 - 直接把H5目录作为对外站点（页面iframe地址加载真实H5地址）
	└── package.json                # 项目基本信息和依赖关系

## 开始编写

1. 安装HBuilder，使用框架uni-app [](https://uniapp.dcloud.net.cn/README)；

2. 进入文件夹并执行 `npm i` 安装项目依赖；

3. 安装依赖后，使用 `HBuilder` 运行项目，若运行失败根据提示下载对应的插件即可；

4. 最后可以运行到浏览器查看H5效果、运行到手机或者浏览器查看小程序效果。

## 重要说明

1. 图片进行了base64处理需要自行解析使用 `utils/config.js` 中的 `getImage` 方法；

2. 接口数据进行了加密处理，使用方法是 `utils/request.js` 中的 `options.data = 'molixg' + btoa(encodeURIComponent(JSON.stringify(options.data)))`；

3. 增加接口的时候，涉及到 `token` 相关的接口（如登陆、注册、绑定手机号码等）需要在 `request.js` 中过滤掉（代码大概在244行），避免一直重复请求（因为接口请求封装了当token改变后再次请求接口）

4. 打包H5的时候需要把项目根目录中的 `pc.html` 页面拷贝到生成的 H5 目录中，用与在web上显示
