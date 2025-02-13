export function displayMessage(container, messageType, message) {
  let parent = container;

  if (typeof container === "string") {
    parent = document.querySelector(container);
  }

  parent.replaceChildren();

  let messageClasses = ["font-medium", "p-3", "border-solid", "border-2", "rounded-md"];
  switch (messageType) {
    case "error":
      messageClasses.push("bg-red-100", "text-red-900", "border-red-900");
      break;
    case "success":
      messageClasses.push("bg-green-100", "text-green-900", "border-green-900");
      break;
  }

  const messageDiv = document.createElement("div");
  messageDiv.classList.add(...messageClasses);

  const messageContent = document.createElement("p");
  messageContent.innerText = message;

  messageDiv.append(messageContent);
  parent.append(messageDiv);
  parent.classList.remove("hidden");
}
