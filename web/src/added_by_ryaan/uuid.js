// Author: Abhishek Dutta, 12 June 2020
// License: CC0 (https://creativecommons.org/choose/zero/)
function uuid() {
  var temp_url = URL.createObjectURL(new Blob());
  var uuid = temp_url.toString();
  URL.revokeObjectURL(temp_url);
  return uuid.substring(uuid.lastIndexOf("/") + 1); // remove prefix (e.g. blob:null/, blob:www.test.com/, ...)
}

export { uuid }