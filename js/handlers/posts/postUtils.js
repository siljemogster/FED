/**
 * Extract YouTube video ID from URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - YouTube video ID or null if not valid
 */
export function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }
  
  /**
   * Extract Vimeo video ID from URL
   * @param {string} url - Vimeo URL
   * @returns {string|null} - Vimeo video ID or null if not valid
   */
  export function extractVimeoId(url) {
    const regExp =
      /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
    const match = url.match(regExp);
    return match ? match[3] : null;
  }
  
  /**
   * Format a date string into a relative time (e.g., "3 minutes ago")
   * @param {string} dateString - ISO date string
   * @returns {string} - Formatted date string
   */
  export function formatDate(dateString) {
    if (!dateString) return "Just now";
  
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
  
    if (diffSec < 60) {
      return "Just now";
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
    } else if (diffDay < 7) {
      return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }