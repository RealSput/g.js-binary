# g.js-binary
A toolkit for G.js that allows you to do bit-level manipulation and reading (binary conversion to triggers, bitwise operators, 2^x exponentiation, etc.)

# Example
```js
import '@g-js-api/g.js';
import Binary from '@g-js-api/binary'

await $.exportConfig({
    type: 'live_editor',
    options: { info: true }
});

let binary = new Binary(16); // MUST be run before anything else!

let block = unknown_g();
object({
    OBJ_ID: 1,
    X: 15,
    Y: -75,
    GROUPS: block
}).add();

// does 2 ^ 5
let res1 = binary.pow2(5);
res1.display(45, -15);

// moves `block` by 32 (2 ^ 5) steps
binary.convert(res1, (exp) => {
  block.move(exp, 0);
})

// does `res1 << 2`
let res2 = binary.bitwise(res1, LSHIFT, 2);
res2.display(75, -15);
```

# Docs
Class `Binary`:
- Argument to constructor: the maximum amount of bits that will be used
- Usage: `new Binary(16)`

Methods:
- `.bitwise`: Does a bitwise operation on two values (one for NOT)
    - Parameters:
        - value1 (number / counter): The first value to the operation
        - op (number): The bitwise operator (AND, OR, XOR, LSHIFT, RSHIFT, NAND, NOR, NOT, XNOR)
        - value2 (number / counter): The second value to the operation (optional only for NOT operator)
        - copy (boolean, optional, default = true): Whether to copy to a new counter or to directly return the counter used in the backend
        - delay (number, optional, default = true): Whether to delay by a small amount (do NOT disable unless you're working on very low-level stuff!)
- `.pow2`: Calculates 2^x
    - Parameters:
        - exp (number): The exponent to base 2
        - copy (boolean, optional, default = true): Whether to copy to a new counter or to directly return the counter used in the backend
- `convert`: Converts a counter to triggers by repeatedly subtracting powers of two (only works on additive triggers, e.g. move, rotate, scale)
    - Parameters:
        - value (counter): The counter to convert into triggers
        - fn (function): The function that holds the triggers
            - Parameters passed to function: `exp`, which stores the current power of two
        - delay (number, optional, default = true): Whether to delay by a small amount (do NOT disable unless you're working on very low-level stuff!)