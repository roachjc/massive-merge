'use strict'

module.exports = (logSources, printer) => {
  // initialise list to be printed
  const printQueue = logSources.map(source => source.pop());
  // initialise flag to indicate > 1 sources are active
  let activeSources = true;
  while (activeSources) {
    activeSources = false;
    let min = Infinity;
    let toPrint;
    for (let i = 0; i < printQueue.length; i += 1) {
      // check current source not drained
      if (printQueue[i]) {
        activeSources = true;
        // update oldest value and index of record to print
        if (printQueue[i].date < min) {
          min = printQueue[i].date;
          toPrint = i;
        }
      }
    }
    // print and replace oldest entry, unless all sources drained
    if (activeSources) {
      printer.print(printQueue[toPrint]);
      printQueue[toPrint] = logSources[toPrint].pop();
    }
  }
  printer.done();
};
