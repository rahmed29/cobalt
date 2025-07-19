// Author: Abhishek Dutta, 12 June 2020
// License: CC0 (https://creativecommons.org/choose/zero/)
function uuid() {
  var temp_url = URL.createObjectURL(new Blob());
  var uuid = temp_url.toString();
  URL.revokeObjectURL(temp_url);
  return uuid.substring(uuid.lastIndexOf("/") + 1); // remove prefix (e.g. blob:null/, blob:www.test.com/, ...)
}


// What I did was replaced all instances of crypto.randomUUID() with this function (in the frontend code)
// This is because I want to access to this over the LAN which is not considered a secure origin by the browser
// TODO: Add the ability for the API to switch mullvad exit nodes if YouTube is giving it issues.
export { uuid }