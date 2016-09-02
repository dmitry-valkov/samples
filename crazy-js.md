# Crazy JS things

```javascript
({})[0]; // undefined
```
Потому что выражение `({})` возвращает своё тело, то есть `{}`, а вызов `[0]` от пустого объекта даёт `undefined`, ибо нет в нём нулевого элемента.

```javascript
typeof typeof {}; // 'string'
```
Это просто - `typeof {}` возвращает `'object'`, а это строка, соответсвенно, получится выражение `typeof 'object'`, что и даст `'string'`.

```javascript
function(){
    return typeof arguments; // 'object'
});
```
Объект [arguments](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/arguments) - это объект похожий на массив, который содержит аргументы, переданные в функцию. А раз `arguments` это объект, то и `typeof arguments` возвращает `'object'`.
