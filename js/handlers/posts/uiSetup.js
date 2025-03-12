import { getUsername } from "../../helpers/storage.js";

/**
 * Set up the user interface elements
 */
export function setupUserInterface() {
  const username = getUsername();
  console.log("Current user:", username);

  const userNameElements = document.querySelectorAll(".user-name");
  if (username && userNameElements.length) {
    userNameElements.forEach((element) => {
      element.textContent = username;
    });
  }

  const logoutButtons = document.querySelectorAll("button[href='/']");
  logoutButtons.forEach((button) => {
    button.addEventListener("click", handleLogout);
  });

  // Remove any existing custom dropdowns first
  const existingDropdowns = document.querySelectorAll('.custom-dropdown, .custom-select-wrapper');
  existingDropdowns.forEach(dropdown => dropdown.remove());
  
  // Now add our single custom dropdown
  createCustomDropdown();
}

/**
 * Handle user logout
 */
export function handleLogout() {
  console.log("Logging out...");
  localStorage.clear();
  location.href = "/";
}

/**
 * Create a custom dropdown for sorting
 */
export function createCustomDropdown() {
  // Find the select element
  const selectElement = document.getElementById("sort-posts");
  if (!selectElement) return;
  
  // Create container
  const customDropdown = document.createElement('div');
  customDropdown.id = 'custom-sort-dropdown'; // Give it a unique ID
  customDropdown.className = 'custom-dropdown w-full sm:w-auto mt-2 sm:mt-0 relative';
  
  // Create selected option display
  const selectedOption = document.createElement('div');
  selectedOption.className = 'selected-option px-4 py-2 bg-white border rounded-lg cursor-pointer flex items-center justify-between h-11 text-sm';  
  selectedOption.innerHTML = `
    <span>${selectElement.options[selectElement.selectedIndex].text}</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
    </svg>
  `;
  
  // Create options container
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'options-container absolute left-0 w-full mt-1 bg-white border rounded-lg shadow-lg hidden z-10';
  
  // Add options
  Array.from(selectElement.options).forEach(option => {
    const optionElement = document.createElement('div');
    optionElement.className = 'option px-4 py-4 hover:bg-gray-100 cursor-pointer';
    optionElement.textContent = option.text;
    optionElement.dataset.value = option.value;
    
    optionElement.addEventListener('click', () => {
      selectedOption.querySelector('span').textContent = optionElement.textContent;
      optionsContainer.classList.add('hidden');
      
      // Import and use sortPosts from sortingHandler.js
      import('./sortingHandler.js').then(module => {
        module.sortPosts(option.value);
      });
      
      // Update original select for consistency
      selectElement.value = option.value;
    });
    
    optionsContainer.appendChild(optionElement);
  });
  
  // Toggle dropdown on click
  selectedOption.addEventListener('click', (e) => {
    e.stopPropagation();
    optionsContainer.classList.toggle('hidden');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (event) => {
    if (!customDropdown.contains(event.target)) {
      optionsContainer.classList.add('hidden');
    }
  });
  
  // Add to DOM
  customDropdown.appendChild(selectedOption);
  customDropdown.appendChild(optionsContainer);
  
  // Replace original select
  selectElement.parentNode.insertBefore(customDropdown, selectElement);
  selectElement.style.display = 'none';
  
  // Add custom styles with a unique ID for the styles
  const styleElement = document.createElement('style');
  styleElement.id = 'custom-dropdown-styles';
  
  // First remove any existing style elements with this ID
  const existingStyle = document.getElementById('custom-dropdown-styles');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  styleElement.textContent = `
  .custom-dropdown {
    height: 3rem; /* 44px, equivalent to h-5 */
  }

  .custom-dropdown .selected-option {
    color: #4B5563;
    transition: all 0.2s ease;
    width: 100%;
    box-sizing: border-box;
    height: 2.75rem; /* 44px */
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1rem;
    line-height: 1.25rem;
  }
    
  .custom-dropdown .options-container {
    width: 100%;
    box-sizing: border-box;
    top: 2.75rem; 
    margin-top: 0.25rem;
  }
  
  @media (max-width: 640px) {
    .custom-dropdown .selected-option {
      font-size: 1.125rem; 
      height: 2.75rem;
      padding: 0 1rem;
    }
  }
`;
  document.head.appendChild(styleElement);
}

/**
 * Set up mobile menu functionality
 */
export function setupMobileMenu() {
  // Run after a small delay to ensure DOM is ready
  setTimeout(() => {
    console.log('Setting up mobile menu with direct approach');
    
    // Find the mobile menu button by ID
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    
    // Find the mobile menu by ID
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
      console.log('Found mobile menu elements');
      
      // Add click handler specifically for the mobile menu button
      mobileMenuButton.addEventListener('click', function(e) {
        e.stopPropagation();
        console.log('Mobile menu button clicked');
        mobileMenu.classList.toggle('hidden');
      });
      
      // Also set the onclick attribute as a fallback
      mobileMenuButton.setAttribute('onclick', "document.getElementById('mobile-menu').classList.toggle('hidden');");
    } else {
      console.warn('Could not find mobile menu elements');
    }
    
    // Ensure desktop menu is properly visible on larger screens
    const desktopMenu = document.querySelector('.hidden.sm\\:flex');
    if (desktopMenu) {
      // Add style to ensure desktop menu visibility on larger screens
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        @media (min-width: 640px) {
          .hidden.sm\\:flex {
            display: flex !important;
          }
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, 300);
}

/**
 * Prevent horizontal scrolling
 */
export function preventHorizontalScroll() {
  // Add a style to prevent horizontal scrolling
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    html, body {
      max-width: 100%;
      overflow-x: hidden;
    }
  `;
  document.head.appendChild(styleElement);
}