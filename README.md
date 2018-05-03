前端发展越来越快，这应该是每个前端开发者的切身感受，但是CSS 是前端领域中进化最慢的一块。ES678快速普及前端工程发愈发成熟，CSS 被被远远甩在了后面，JS语言模块已经标准化，CSS还是在不断探索，同时这也是一个急需解决的问题。

要是你以前还从未听说过[CSS Modules](https://github.com/css-modules/css-modules)，那么这篇就是专门写给你的。如果你了解过它，你就没必要再看了，因为他真的很简单(很强大)。

## CSS的痛点

我们都知道，CSS入门简单，深入就比较难，样式简单维护难。CSS痛点也很多

1、CSS 的规则是全局的，任何一个组件的样式规则，都对整个页面有效。相信写css的人都会遇到样式冲突（污染）的问题。

2、为了解决全局污染的问题，那就把class命名写长一点吧、加一层父级选择器、降低冲突的几率，那么CSS命名混乱了

3、组件依赖管理不彻底，组件应该相互独立，引入一个组件时，应该只引入它所需要的 CSS 样式。

4、代码难以复用，出现了sass less 之类的工具

## CSS模块化方案分类

前端发展是飞速的天天有新轮子。自然CSS 模块化的解决方案有很多，但主要有三类：

### 1、命名约定

规范化CSS的解决方案如：BEM、OOCSS、AMCSS、SMACSS

### 2、CSS in JS

彻底抛弃 CSS，用 JavaScript 写 CSS 规则，[styled-components](https://github.com/styled-components/styled-components) 就是其中代表。

### 3、使用JS 来管理样式模块

使用JS编译原生的CSS文件，使其具备模块化的能力，代表是 CSS Modules。

但是这些模块化方案都是各有优缺点，如命名约定：命名复杂、CSS in JS：缺乏扩展、 CSS Modules当然也有一些缺点(*你得先学会它再去谈优劣*)。在众多解决方案中，没有绝对的优劣。还是要结合自己的场景来决定。

## 使用 CSS Modules

CSS Modules不是将CSS改造的具有编程能力，而是加入了局部作用域、依赖管理，这恰恰解决了最大的痛点。可以有效避免全局污染和样式冲突，能最大化地结合现有 CSS 生态和 JS 模块化能力。

### 启用 CSS Modules

CSS Modules 很容易学。webpack 自带的 `css-loader` 组件，自带了 CSS Modules，通过简单的配置即可使用。

```js
// webpack.config.js
const path = require('path')

module.exports = {
  entry: __dirname + '/src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            }
          }
        ]
       }
    ]
  }
}
// 也可以使用下面这种写法
// loader: "style-loader!css-loader?modules"
```

现在我们来写个Button组件

```css
/* Button.css */
.primary {
    background-color: #1aad19;
    color: #fff;
    border: none;
    border-radius: 5px;
}
```



```js
// Button.js
import styles from './Button.css';

console.log(styles); // -> {primary: "yTXmm0isaXExoYiZUvKxH"}
const Button = document.createElement('div')
Button.innerHTML = `<button class=${styles.primary}>Submit</button>`

export default Button

// index.js
import Button from './components/Button'

const app = document.getElementById('root')
app.appendChild(Button)
```

生成HTML为

```html
<div id="root">
    <div>
        <button class="yTXmm0isaXExoYiZUvKxH">Submit</button>
    </div>
</div>
<!-- yTXmm0isaXExoYiZUvKxH为CSS Modules自动生成的class类名 -->
```

CSS Modules 对 CSS 中的 class 名都做了处理，使用对象来保存原 class 和混淆后 class 的对应关系。CSS Modules自动生成的class类名基本就是唯一的，大大降低了项目中样式覆盖冲突的几率。

GitHub 示例库 [https://github.com/liuxing/css-modules-demo](https://github.com/liuxing/css-modules-demo) 通过commit 记录来查看

### 定制class类名

`css-loader`默认的哈希算法是`[hash:base64]`，从前面我们可以发现`.primary` 被编译成了 yTXmm0isaXExoYiZUvKxH 这样的字符串。这名字也没风格了别担心，css-loader 为我们提供了`localIdentName ` 参数指定生成的名字格式。`localIdentName`的默认值是`[hash:base64]`。

```js
...

{
    loader: 'css-loader',
    options: {
        modules: true,
        localIdentName: '[name]__[local]--[hash:base64:5]'
    }
}

// 或者
loader: 'style-loader!css-loader?modules&localIdentName=[name]__[local]--[hash:base64:5]'
...
```

**BEM代码规范不再是必须的 ** 熟悉BEM的同学可能发现了上面的命名和BEM有些神似， 虽然它的命名有点奇特，但是 BEM 被非常多的大型项目和团队采用，这是一种很好的实践。当然了随便怎么写都可以结合自己的场景来决定，在CSS module中不再需要遵守BEM规范。

### 作用域

通过前面的例子可以感受到CSS module处理CSS的方式。现在我们从头来说作用域。

### 默认局部作用

CSS很多问题都是因为全局作用域引起的，怎么样才能产生局部作用域？通过前面CSS module的例子我们发现它思路很简单就是生成唯一的class类名。CSS module将class转换成对应的全局唯一hash值来形成局部作用域。使用了 CSS Modules 后，就相当于给每个 class 名外加了一个 `:local` 这是默认的，也可以显式使用

当然，如果你想切换到全局模式，CSS Modules 允许使用`:global(.className)`的语法，声明一个全局规则。凡是这样声明的`class`，都不会被编译成哈希字符串。

```css
/* Button.css */
:global(.btn) {
    color: #fff;
    border: none;
    border-radius: 5px;
}

.primary {
    background-color: #1aad19;
}

/* 
与上面不加`:local`等价 
显式的局部作用域语法
*/
:local(.warn) {
    background-color: #e64340
}
```

通过 GitHub 示例库 [https://github.com/liuxing/css-modules-demo ](https://github.com/liuxing/css-modules-demo)的commit 记录来查看

### CSS Modules下的样式复用

对于样式复用，CSS Modules 提供了 `composes` 组合 的方式来处理。一个选择器可以继承另一个选择器的规则

```css
/* Button.css */

.btn {
    /* 所有通用的样式 */
    color: #fff;
    border: none;
    border-radius: 5px;
    box-sizing: border-box；
}

.primary {
    composes: btn;
    background-color: #1aad19;
}
```
Button.js
```js
import styles from './Button.css';

console.log(styles);
const Button = document.createElement('div')
Button.innerHTML = `<button class="${styles.primary}">Submit</button>`

export default Button
```

生成的 HTML 变为

```html
<div id="root">
    <div>
        <button class="Button__primary--yTXmm Button__btn--nx67B">Submit</button>
    </div>
</div>
```

我们发现在 `.primary` 中 composes 了 `.btn`，编译后 `.primary` 会变成两个 class。

composes 还可以也可以继承组合其他CSS文件里面的规则

```css
/* author.css */

.shadow {
    box-shadow: 0 0 20px rgba(0, 0, 0, .2)
}
```

Button.css

```css
···
.primary {
    composes: btn;
    composes: shadow from './author.css';
    background-color: #1aad19;
}
···
```

这是个很强大方便的功能，CSS Modules团队成员认为`composes`是CSS Modules里最强大的功能：

> For me, the most powerful idea in CSS Modules is composition, where you can deconstruct your visual inventory into atomic classes, and assemble them at a module level, without duplicating markup or hindering performance.

### 一些建议

为了追求**简单可控**，作者建议遵循如下原则：

- 不使用选择器，只使用 class 名来定义样式
- 不层叠多个 class，只使用一个 class 把所有样式定义好
- 所有样式通过 `composes` 组合来实现复用
- 不嵌套

但是建议只是建议，CSS Modules 并不强制你一定要这么做。怎么舒服怎么来



CSS Modules 很好的解决了 CSS 目前面临的一些痛点以及模块化难题，同时也支持与 Sass/Less/PostCSS 等搭配使用。

无论是通过遵循的命名标准化的规范，还是使用本文介绍的CSS Modules，目的都是一样：可维护的css代码。具体使用不是有还是要结合自己的场景来决定。适合的才是最好的