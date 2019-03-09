# WAT Tag

A tag function for compiling inline WebAssembly written in the WAT text format.

## Installation

```bash
npm install wat-tag
```

## Usage

```Typescript
import {wat} from "wat-tag";

const module = await wat`
        (module
            (func (export "square") (param $i i32) (result i32)
                get_local $i
                get_local $i
                i32.mul
            )
        )
    `;
const instance = await WebAssembly.instantiate(module);
const result = instance.exports.square(3);
```

This package is useful for experimenting and learning WebAssembly, but I do not recommend it for production use.

-Rene
