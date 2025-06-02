// utils/modalHelper.js
export const hasSeenLoginModal = () => {
  return sessionStorage.getItem("seenLoginModal") === "true";
};

export const setLoginModalSeen = () => {
  sessionStorage.setItem("seenLoginModal", "true");
};

export const clearLoginModalSeen = () => {
  sessionStorage.removeItem("seenLoginModal");
};