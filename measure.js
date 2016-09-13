function measure(time) {
  perf.start();
  setTimeout(function () {
    perf.stop();
    console.log('stopped');
  }, time);
}