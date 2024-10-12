// Helpers to use in handlebars
module.exports = {
  eq: (a, b) => a === b,
  neq: (a, b) => a !== b,
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  gt: (a, b) => a > b,
  lt: (a, b) => a < b,
  or: (a, b) => a || b,
  and: (a, b) => a && b,
  not: (a) => !a,
};
