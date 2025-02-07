export function displayMessage(container, messageType, message) {
  let parent = container;

  if (typeof container === "string") {
    parent = document.querySelector(container);
  }

  parent.innerHTML = `<div class="p-4 rounded-lg text-white ${messageType === "success" ? "bg-green-500" : "bg-red-500"}" role="alert">${message}</div>`;
}
