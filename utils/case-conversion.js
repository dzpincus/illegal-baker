function snakeToCamel(snakeString) {
  let split = snakeString.split('_');
  if (split.length > 1) {
    let camel = split[0]
    for (var i = 1; i < split.length; i++) {
      let word = split[i];
      word = word[0].toUpperCase() + word.substring(1);
      camel += word;
    }
    return camel;
  } else {
    return snakeString;
  }
}

function camelToSnake(camelString) {
  return camelString.split('').map((character) => {
      if (character == character.toUpperCase()) {
        return '_' + character.toLowerCase();
      } else {
        return character;
      }
    })
    .join('');
}

module.exports = {snakeToCamel, camelToSnake}