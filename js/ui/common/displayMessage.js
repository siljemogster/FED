export function displayMessage(container, messageType, message) {
  let parent = container;

  if (typeof container === "string") {
    parent = document.querySelector(container);
  }
  parent.innerHTML = `
  <div class="text-red-500 font-semibold" role="alert">
    ${message}
  </div>
`;
}
