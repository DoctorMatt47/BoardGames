export function getClientId() {
  let clientId = localStorage.getItem("clientId");

  if (!clientId) {
    clientId = crypto.randomUUID();
    localStorage.setItem("clientId", clientId);
  }

  return clientId;
}

export function getClientColor() {
  let clientColor = localStorage.getItem("clientColor");

  if (!clientColor) {
    const letters = "0123456789ABCDEF";
    clientColor = "";

    for (let i = 0; i < 6; i++) {
      clientColor += letters[Math.floor(Math.random() * 16)];
    }

    localStorage.setItem("clientColor", clientColor);
  }

  return clientColor;
}

export function getClientUsername() {
  return localStorage.getItem("clientUsername") || "Guest";
}

export function setClientUsername(username: string) {
  localStorage.setItem("clientUsername", username);
}
