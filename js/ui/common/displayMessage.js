/**
 * Display a message in a container element
 * @param {string|HTMLElement} container - Container element or selector
 * @param {string} messageType - Type of message (error, success, warning, info)
 * @param {string} message - Message content (can include HTML)
 */
export function displayMessage(container, messageType, message) {
  let parent = container;

  // If container is a selector string, query the DOM for the element
  if (typeof container === "string") {
    parent = document.querySelector(container);
  }
  
  // Return if container element doesn't exist
  if (!parent) {
    console.error(`Container ${container} not found`);
    return;
  }

  // Determine appropriate CSS classes based on message type
  let cssClass = "font-semibold p-4 rounded-lg my-3";
  
  switch (messageType) {
    case "error":
      cssClass += " text-red-700 bg-red-100";
      break;
    case "success":
      cssClass += " text-green-700 bg-green-100";
      break;
    case "warning":
      cssClass += " text-yellow-700 bg-yellow-100";
      break;
    case "info":
      cssClass += " text-blue-700 bg-blue-100";
      break;
    default:
      cssClass += " text-gray-700";
  }

  // Set the innerHTML of the container
  parent.innerHTML = `
    <div class="${cssClass}" role="alert">
      ${message}
    </div>
  `;
}