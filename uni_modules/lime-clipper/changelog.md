## 0.6.4（2021-04-16）
- 修复因mode引起的高度异常
## 0.6.3（2021-04-13）
- 测试到微信小程序无法进第二次`draw`，故更新使用`v-model`的方式，显示隐藏组件。
- 原先使用v-if显示隐藏组件依然可以使用，若发现无法二次`draw`请使用`v-model`
```html
<l-clipper v-model="show" />
```
```js
data: () => ({
	show: false
})
```
## 0.6.2（2021-03-26）
1、修复图片初始化BUG
2、增加`fileType`属性，默认值为`png`
## 0.6.1（2021-03-10）
- 给事件添加阻止冒泡
## 0.6.0（2021-03-06）
增加`source`属性，`Object`类型，key为图片来源类型，value为选项说明。<br>
```js
// source 默认值 
{
	album: '从相册中选择',
	camera: '拍照',
	// #ifdef MP-WEIXIN
	message: '从微信中选择'
	// #endif
}
```
## 0.5.0（2021-02-26）
- 调整为uni_modules目录规范
