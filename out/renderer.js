"use strict";
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");
process.stdin.on("data", function (chunk) {
    // process.stdout.write('line read: ' + chunk);
    process.stdout.write("char read: " + chunk[0]); // gives ascii 97 when a is typed.
    process.exit(0);
});
