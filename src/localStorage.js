export function saveUserToken(userToken) {
  localStorage.setItem("TOKEN", userToken);
}
export function getUserToken() {
  return localStorage.getItem("TOKEN");
}
