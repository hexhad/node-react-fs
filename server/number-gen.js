function genarate_number() {
  var random = Math.random();
  var number = parseInt(random * 1000000);

  if (number.toString().length < 6) {
    number += 100000;
  }
  return number;
}

module.exports = { genarate_number };
