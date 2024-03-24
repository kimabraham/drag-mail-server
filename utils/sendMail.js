exports.encodeWord = (word) => {
  return `=?UTF-8?B?${Buffer.from(word).toString("base64")}?=`;
};
