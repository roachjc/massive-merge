
function Node(value) {
  this.value = value;
  this.next = null;
}
 
class Ll {
  constructor() {
    this.head = null;
    this.length = 0;
  }

  insertSorted(value) {
    this.length += 1;
    const node = new Node(value);
    if (!this.head) {
      this.head = node;
      return;
    }

    if (value.log.date < this.head.value.log.date) {
      node.next = this.head;
      this.head = node;
    } else {
      let current = this.head;

      while (current) {
        if (!current.next) {
          current.next = node;
          return;
        }
        if (current.next.value.log.date > value.log.date) {
          const nextGreater = current.next;
          current.next = node;
          node.next = nextGreater;
          return;
        }
        current = current.next;
      }
    }
  }

  pop() {
    this.length -= 1;
    if (!this.head) return null;

    const popped = this.head.value;
    this.head = this.head.next;
    return popped;
  }
}

const log0 = {
  log: {
    date: 5,
    msg: 'agsfkjdbg',
  },
  sourceIndex: 0,
};

const log1 = {
  log: {
    date: 3,
    msg: 'agsfkjdbg',
  },
  sourceIndex: 1,
};
const log2 = {
  log: {
    date: 7,
    msg: 'agsfkjdbg',
  },
  sourceIndex: 2,
};
const log3 = {
  log: {
    date: 6,
    msg: 'agsfkjdbg',
  },
  sourceIndex: 3,
};

// const myll = new Ll();
// myll.insertSorted(log0);
// myll.insertSorted(log1);
// myll.insertSorted(log2);
// myll.insertSorted(log3);
// // myll.insertSorted(7);


// // console.log(myll.pop())
// console.log(myll.head.value)
// console.log(myll.head.next.value)
// console.log(myll.head.next.next.value)
// console.log(myll.head.next.next.next.value)


module.exports = Ll;
