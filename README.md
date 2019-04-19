# think-i18n-2


# BETA 版本开发中
## 安装
    npm install think-i18n-2 --save
### 配置 extends.js


```js
// thinkjs config/extend.js

const createI18n = require('think-i18n-2');
const path = require('path');
let directory = path.resolve(__dirname, './locales')
module.exports = [
   ...
    createI18n({
        app: think.app, // 如果为空，__ 就不会被自动 `assign` 到 `think-view` 实例
        localesMapping(locales: any) {
            return 'en';
        },
        extension: '.json',
        locales: ['en', 'zh'],
        directory
    })
];

```


### Controller 和 View (nunjucks)

####  controller

如果需要再controller 里面获取 I18n 的实例或者当前的 locale，可以调用

```js
    async indexAction(){
       let locale;//不传默认取
      const __ = this.getI18n(locale).__;
      const locale = this.getLocale();
    }
```

####  view

如果使用了 [think-view](https://github.com/thinkjs/think-view) 模块， think-i18n 会自动调用注入一个实例到当前模板实例里，类似： this.assign('__', I18n.__.bind(I18n)), 这样在模板里面就可以使用直接使用 i18n 暴露的接口。

```js

{{ __('some key') }}



