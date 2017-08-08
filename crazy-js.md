# Crazy JS things

```javascript
({})[0]; // undefined
```
Потому что выражение `({})` возвращает своё тело, то есть `{}`, а вызов `[0]` от пустого объекта даёт `undefined`, ибо нет в нём нулевого элемента.

---

```javascript
typeof typeof {}; // 'string'
```
Это просто - `typeof {}` возвращает `'object'`, а это строка, соответсвенно, получится выражение `typeof 'object'`, что и даст `'string'`.

---

```javascript
function(){
    return typeof arguments; // 'object'
});
```
Объект [arguments](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/arguments) - это объект похожий на массив, который содержит аргументы, переданные в функцию. А раз `arguments` это объект, то и `typeof arguments` возвращает `'object'`.

---

```javascript
[] == false // true
```
Перед сравнением оператор равенства приводит обе величины к общему типу. При сравнении object и boolean схема приведения будет ```ToPrimitive(Object) == ToNumber(Boolean)```. ToNumber(X) пытается перед сравнением привести свой аргумент к числу. Такое поведение эквивалентно +A (унарный оператор +).  Если ToPrimitive(X) получает объект в качестве аргумента, то производятся попытки привести его к примитиву, вызывая на нем методы A.toString и A.valueOf.

В итоге получается преобразование вида:
```javascript
+false // 0
[].toString().valueOf() // ''
```

Что проводит к
```javascript
'' == 0 // true
```

---
