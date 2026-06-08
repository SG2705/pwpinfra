/**
 * Shared utility functions for PWP Infra website
 */

/**
 * Updates or creates a meta tag in the document head
 * @param {string} name - Meta tag name or property attribute value
 * @param {string} content - Content attribute value
 * @param {boolean} isProperty - Whether to use property attribute (for OG/Twitter)
 */
const updateMeta = (name, content, isProperty = false) => {
  const selector = isProperty
    ? `meta[property="${name}"]`
    : `meta[name="${name}"]`;

  let tag = document.querySelector(selector);

  if (!tag) {
    tag = document.createElement("meta");

    if (isProperty) {
      tag.setAttribute("property", name);
    } else {
      tag.setAttribute("name", name);
    }

    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

/**
 * Fetches and parses JSON with error handling
 * @param {string} url - URL to fetch
 * @returns {Promise<any|null>} Parsed JSON or null on failure
 */
const fetchJSON = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
};
