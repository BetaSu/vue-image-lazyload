# vue-image-lazyload
A lightful image lazyload plugin for Vue. 

Vue的轻量级滚动懒加载插件
- You can simply add v-lazy-container to a element,and img contains in this element which has v-lazy-src would load until it's in the visible area of the element,this plugin is not only work for father-son relationship but also any tree structure.
- To become a lazyload img,use 'v-lazy-src' instead of 'src'
- 为一个元素加上‘v-lazy-container’指令，该元素内部（不止是父子关系）所有加了‘v-lazy-src’指令的img标签将会在滚动到元素的可视区域后再加载
- 为需要懒加载的img标签添加'v-lazy-src'而不是'src'
# Install
```
npm install vue-lazy-imgs
```
# Usage
```javascript
import lazyload from 'vue-lazy-imgs'
Vue.use(lazyload)
```
```html
<div v-lazy-container>
  <img v-lazy-src='http://xxx.xxx.xxx'>
</div>
```
