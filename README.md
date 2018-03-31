# ReferenceParser

This is a simple library designed to infer an intended verse reference given a string. It is used in url parsing by <https://parabible.com> so that users can use any book abbreviations they want to use while also providing support for a standard set of urls.

## Usage is simple

**Step One**: Add `ReferenceParser` to your project:

```javascript
npm i referenceparser --save
```

**Step Two**: Import or require it somewhere in your code base and then instantiate it:

```javascript
import ReferenceParser from 'referenceparser'
const rp = new ReferenceParser()
```

**Step Three**: Parse some text...

```javascript
rp.parse("2 Kings 5:3")
//  { book: '2 Kings', chapter: 5, verse: 3 }

rp.parse("pss4.2")
//  { book: 'Psalms', chapter: 4, verse: 2 }

rp.parse("song of sol 10v4")
//  { book: 'Song of Songs', chapter: 10, verse: 4 }

rp.parse("ex")
//  { book: 'Exodus', chapter: null, verse: null }

rp.parse("2-kgs/3")
//  { book: '2 Kings', chapter: 3, verse: null }

rp.parse("garbage")
//  { book: null, chapter: null, verse: null }
```
