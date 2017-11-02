'use strict'

async function asyncSortedMerge(logSources, printer) {
  const sourceQty = logSources.length;
  let drainedSources = 0;
  let minIndex;

  // iterate until all sources are drained
  while (drainedSources < sourceQty - 1) {
    // initialize minimum value for date on each iteration
    let min = Infinity;
    // reset drained entries count on each iteration
    drainedSources = 0;
    // count drained sources and get oldest entry
    for (let i = 0; i < sourceQty; i += 1) {
      if (!logSources[i].last) {
        drainedSources += 1;
      } else if (logSources[i].last.date < min) {
        min = logSources[i].last.date;
        minIndex = i;
      }
    }
    printer.print(logSources[minIndex].last);
    // replace printed entry with next
    logSources[minIndex].last = await logSources[minIndex].popAsync();
  }
  printer.done();
}

module.exports = asyncSortedMerge;
