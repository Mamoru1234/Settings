function empty(label) {
    return function () {
        console.log(label);
        Array.prototype.forEach.call(arguments, function (elem) {
            console.log(elem);
        });
    }
}