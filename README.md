# catbox-hyperdb

[![Greenkeeper badge](https://badges.greenkeeper.io/Seldszar/catbox-hyperdb.svg)](https://greenkeeper.io/)

Another HyperDB adapter for Catbox.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Author](#author)
- [License](#license)

## Installation

```bash
npm install seldszar/catbox-hyperdb --save
```

## Usage

```javascript
const catbox = require('catbox');

const cache = new catbox.Client(require('catbox-hyperdb'), {
  path: '/path/to/database',
});

cache.start(() => {
  // ...
});
```

```javascript
const catbox = require('catbox');
const hyperdb = require('hyperdb');

const cache = new catbox.Client(require('catbox-hyperdb'), {
  client: hyperdb('/path/to/database', {
    valueEncoding: 'json',
  }),
});

cache.start(() => {
  // ...
});
```

## Author

Alexandre Breteau - [@0xSeldszar](https://twitter.com/0xSeldszar)

## License

MIT © [Alexandre Breteau](https://seldszar.fr)
