'use strict'

module.exports = (logSources, printer) => {
  // initialise list of promises to be printed
  const printQueuePromises = logSources.map(source => source.popAsync());

  Promise.all(printQueuePromises)
    // when all resolved we can begin the comparisons
    .then(async (printQueue) => {
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
          // we must await a new value in order to make a new comparison
          try {
            printQueue[toPrint] = await logSources[toPrint].popAsync();
          } catch (reason) {
            throw new Error(`error loading new log entry: ${reason}`);
          }
        }
      }
      printer.done();
    }).catch((reason) => {
      throw new Error(`error loading initial log entries: ${reason}`);
    });
};
