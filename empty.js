function empty(label, debug) {
    return function () {
        console.log(label);
        Array.prototype.forEach.call(arguments, function (elem) {
            console.log(elem);
        });
        if (debug) {
            debugger;
        }
    };
}