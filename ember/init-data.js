// Initial data for json-server:
//  https://github.com/typicode/json-server

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = function() {

  var data = { nodes: [] };

  for (var i = 0; i < 100; i++) {
    data.nodes.push({
      id: i,
      name: 'Node ' + i,
      cpu: randomInt(0, 100)
    });
  }

  return data;

};
