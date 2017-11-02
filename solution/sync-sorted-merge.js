'use strict'
const Heap = require('heap');

const iterative = (logSources, printer) => {
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
    logSources[minIndex].last = logSources[minIndex].pop();
  }
  printer.done();
};

const minHeap = (logSources, printer) => {
  const entries = new Heap((a, b) => a.last.date - b.last.date);

  logSources.forEach((entry) => {
    entries.push(entry);
  });

  while (entries.size()) {
    const oldest = entries.pop();
    printer.print(oldest.last);
    const nextEntry = oldest.pop();
    if (nextEntry) {
      oldest.last = nextEntry;
      entries.push(oldest);
    }
  }
  printer.done();
};

module.exports = iterative;
