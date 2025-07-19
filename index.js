extract({
    AND: 1,
    OR: 2,
    XOR: 3,
    LSHIFT: 4,
    RSHIFT: 5,
    NAND: 6,
    NOR: 7,
    NOT: 8,
    XNOR: 9
});

let init = (bits) => {
    if (typeof bits !== "number") throw `Expected number for 'bits', got ${typeof bits}`;
    bits = Math.round(Math.abs(bits));
    if (bits > 31) throw "Geometry Dash only supports 32-bit SIGNED integers!";

    let b = counter(2);
    let cresult = counter(1);

    let cexp = (exp, copy = true) => {
        cresult.set(1);
        b.set(2);

        let e = float_counter().set(exp);
        let ctxn;

        wait(.01);
        trigger_function(() => {
            let ctx = $.trigger_fn_context();
            compare(e, GREATER, 0, trigger_function(() => {
                item_comp(e.item, e.item, TIMER, TIMER, NOT_EQ, trigger_function(() => {
                    cresult.multiply(b);
                }), undefined, 2, 2, undefined, DIV, DIV, NONE, NONE, FLR, RND).add();
                wait(.01);
                b.multiply(b);
                item_edit(e.item, undefined, e.item, TIMER, NONE, TIMER, EQ, DIV, DIV, 2, undefined, NONE, FLR).add();
                ctx.call(.01);
            }), trigger_function(() => {
                ctxn = $.trigger_fn_context();
            }));
        }).call();
        Context.set(ctxn);
        return copy ? counter().set(cresult) : cresult;
    }

    let val1 = counter(),
        val2 = counter(),
        result = counter(),
        mode = counter();

    let bitwiseF = trigger_function(() => {
        let bit1 = counter();
        let bit2 = counter();
        result.reset();

        let reset = trigger_function(() => {
            bit1.set(0);
            bit2.set(0);
        })

        let expr = cexp(val2, false);

        compare(mode, EQ, 4, trigger_function(() => {
            // LSHIFT
            result.set(val1).multiply(expr);
        }), trigger_function(() => {
            compare(mode, EQ, 5, trigger_function(() => {
                // RSHIFT
                item_edit(val1.item, expr.item, result.item, ITEM, ITEM, ITEM, EQ, DIV, undefined, undefined, undefined, undefined, FLR).add();
            }), trigger_function(() => {
                // ALL BITWISE
                for (let i = bits - 1; i >= 0; i--) {
                    reset.call();

                    let exp = 2 ** i;
                    compare(val1, GREATER_OR_EQ, exp, trigger_function(() => {
                        val1.subtract(exp);
                        bit1.set(1);
                    }));
                    compare(val2, GREATER_OR_EQ, exp, trigger_function(() => {
                        val2.subtract(exp);
                        bit2.set(1);
                    }));

                    // BITWISE OPS
                    // AND
                    compare(mode, EQ, 1, trigger_function(() => {
                        bit1.multiply(bit2);
                        compare(bit1, EQ, 1, trigger_function(() => result.add(exp)));
                    }))
                    // OR
                    compare(mode, EQ, 2, trigger_function(() => {
                        bit1.add(bit2);
                        compare(bit1, GREATER, 0, trigger_function(() => result.add(exp)));
                    }))
                    // XOR
                    compare(mode, EQ, 3, trigger_function(() => {
                        compare(bit1, NOT_EQ, bit2, trigger_function(() => result.add(exp)));
                    }))
                    // NAND
                    compare(mode, EQ, 6, trigger_function(() => {
                        bit1.multiply(bit2);
                        compare(bit1, EQ, 0, trigger_function(() => result.add(exp)));
                    }));
                    // NOR
                    compare(mode, EQ, 7, trigger_function(() => {
                        bit1.add(bit2);
                        compare(bit1, EQ, 0, trigger_function(() => result.add(exp)));
                    }))
                    // NOT
                    compare(mode, EQ, 8, trigger_function(() => {
                        compare(bit1, EQ, 0, trigger_function(() => result.add(exp)));
                    }))
                    // XNOR
                    compare(mode, EQ, 9, trigger_function(() => {
                        compare(bit1, EQ, bit2, trigger_function(() => result.add(exp)));
                    }));
                }
            }))
        }))

        group(9998).call();
    });

    let bitwise = (v1, op, v2 = 0, copy = true, delay = true) => {
        val1.set(v1);
        mode.set(op);
        val2.set(v2);
        let ctx = trigger_function(() => {});
        bitwiseF.remap([9998, ctx]).call(delay ? 1/240 : 0);
        Context.set(ctx);
        return copy ? counter().set(result) : result;
    }

    let convert = (val, fn, delay = true) => {
        let vcopy = counter().set(val);
        for (let i = bits - 1; i >= 0; i--) {
            let exp = 2 ** i;
            compare(vcopy, GREATER_OR_EQ, exp, trigger_function(() => {
                vcopy.subtract(exp);
                fn(exp);
            }));
            if (delay) wait(1/240);
        }
    };

    return {
        bitwise,
        convert,
        pow2: cexp
    }
};

// todo: make it a TRUE class later on
// just did this cuz i got lazy lmfao

class Binary {
    constructor(bits) {
        let instance = init(bits);
        Object.assign(this, instance);
    }
}

export default Binary;