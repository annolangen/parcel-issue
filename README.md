# Parcel struggles with Iterables

## Typescript supports iterables, but Parcel chokes on them. 

This code distills code from a project of mine to reproduce the
problem. Factor is an interface inspired by R. An array of data can be
encoded to store its distinct values, called levels in Factor lingo, plus
some compact representation of the level indicies. A general, compact
encoding is varint, where non-negative integers take between one and five
bytes, using the high bit to indicate continuation of the code.

* A tool chain that works is typescript, roolup, and serve. To see the
working version:
```shell
npm install
npx rollup -c
npx serve
```
open http://localhost:5000/working.html

* Parcel made an excellent first impression as a zero configuration toolchain
for web pages with typescript. Ideally, I would like to 

```shell
npx parcel index.html
```
open http://localhost:1234/

This worked well for simpler examples. When reading other issues reported
against Parcel, I learned about the need to configure Parcel's constituent
tools. Some issues are solved by setting browserslist in
package-json. Others by crafting a .babelrc. I have failed thus far, but
include my best effort in this repository.

## Two Failures

Parcel fails to support iterables in two separate ways. Each is illustrated
in a separate anchor, to which you can navigate from the left of the UI page.

* The spread operator
```typescript
[...f.elements()]
```
materializes the iterable into an array. When targeting obsolete browsers
using the official typescript compiler, this construct does require extra
compiler options. With Parcel this throws an exception
```typescript
Uncaught RangeError: Invalid array length
    at __spreadArrays (app.ts:6)
```

* The for-of loop
```typescript
for (const v of f.elements())
```
loops over the iterable's elements. With Parcel there is no exception, but
zero elements are iterated.
