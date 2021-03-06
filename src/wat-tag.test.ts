import { wat, watb } from "./";

describe("wat-tag", () => {
  it("Compiles an empty module", async done => {
    const module = await wat`(module)`;
    const instance = WebAssembly.instantiate(module);
    expect(instance).not.toBe(null);
    done();
  });

  it("Compiles the square function", async done => {
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

    expect(instance).not.toBe(null);
    expect(instance.exports.square(3)).toBe(9);
    done();
  });

  it("counts to 5", async done => {
    const module = await wat`
            (module
                ;; import trace function that accepts a single i32 argument
                (func $trace (import "js" "trace") (param i32))

                ;; prints numbers from 1 to $max
                (func (export "countTo") (param $max i32)
                    ;; define variable $c and initialize it to 0
                    (local $c i32)
                    (set_local $c (i32.const 0))

                    ;; start a loop
                    (loop $counting
                        ;; increment $c by 1
                        (set_local $c (i32.add (get_local $c) (i32.const 1)))
                        ;; log current value of $c
                        (call $trace (get_local $c))
                        ;; repeat loop if $c is not equal to $max
                        (br_if $counting (i32.ne (get_local $max) (get_local $c)))
                    )
                )
            )
        `;

    const log: Array<number> = [];
    const instance = await WebAssembly.instantiate(module, {
      js: {
        trace: (i: number) => log.push(i)
      }
    });

    instance.exports.countTo(5);
    expect(log).toEqual([1, 2, 3, 4, 5]);
    done();
  });
});

describe("watb", () => {
  it("returns a buffer containing WASM in binary format", () => {
    const buffer = watb`(module)`;
    // first four bytes should spill out \0asm
    expect(buffer[0]).toEqual(0); // \0
    expect(buffer[1]).toEqual(0x61); // a
    expect(buffer[2]).toEqual(0x73); // s
    expect(buffer[3]).toEqual(0x6d); // m
  })
});
