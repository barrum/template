# tmp
<p>Выполнить gulp uikit (скопируются стили в папку src/less/components, скрипты подключаются из node_modules)</p>
<p>Папка theme используется для кастомизации компонентов фреймворка. Надо скопировать в нее компопнент и файл _import.less, правильно подключить, соблюдая иерархию - https://github.com/uikit/uikit/blob/develop/src/less/components/_import.less.</p>
<p>Если нужен pug вместо html, то в Gulpfile.js заменить exports.default = series(clean, parallel(pugWay, styles, scripts, copyFiles), watching), закоментить html и раскоментить pug в самом таске;</p>
<p>Иконки класть в _src/img/icons. В дальнейшем они будут перемещены в папку node_modules/uikit/custom/icons и подключены в js</p>
<p>Отключить reverse - @inverse-global-color-mode: none; https://getuikit.com/docs/less#disable-inverse-component</p>
