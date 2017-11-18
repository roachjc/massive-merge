'use strict'

const sortedIndexBy = require('lodash.sortedindexby');
const SortedLL = require('./sortedLinkedList');

function syncSortLL(logSources, printer) {
  // create linkedlist of printQueue
  const printQueue = new SortedLL();
  logSources.forEach((source, i) => {
    printQueue.insertSorted({
      log: source.pop(),
      sourceIndex: i,
    });
  });

  while (printQueue.length) {
    const oldest = printQueue.pop();
    printer.print(oldest.log);
    const replacement = {
      log: logSources[oldest.sourceIndex].pop(),
      sourceIndex: oldest.sourceIndex,
    };

    if (replacement.log) {
      printQueue.insertSorted(replacement);
    }
  }
  printer.done();
}


function syncSortMerge(logSources, printer) {
    // initialise list to be printed
  const printQueue = logSources.map((source, i) => (
    {
      log: source.pop(),
      sourceIndex: i,
    }
  )).sort((a, b) => b.log.date - a.log.date);

  while (printQueue.length) {
    // get oldest and print
    const oldest = printQueue.pop();
    printer.print(oldest.log);
    // get oldest's replacement
    const replacement = {
      log: logSources[oldest.sourceIndex].pop(),
      sourceIndex: oldest.sourceIndex,
    };
    // if oldest does not return false, insert new value in printQueue at correct index
    if (replacement.log) {
      // [7,5,3,2] 4
      const insertIndex = sortedIndexBy(printQueue, replacement, o => -o.log.date);
      printQueue.splice(insertIndex, 0, replacement);
    }
  }
  printer.done();
}


function oldSyncSortMerge(logSources, printer) {
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
}

// module.exports = syncSortLL; // 1540
// module.exports = syncSortMerge; // 6985 -- 9138 / 2.584 6090
module.exports = oldSyncSortMerge; // 7173 -- 7889 / 2.995 1182