let selectedTabs = [];

// Create context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addToSplitView",
    title: "Add to Split View",
    contexts: ["page"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "addToSplitView") {
    if (!selectedTabs.find(t => t.id === tab.id)) {
      selectedTabs.push({
        id: tab.id,
        url: tab.url,
        title: tab.title
      });
      // Add visual feedback
      chrome.action.setBadgeText({ text: selectedTabs.length.toString() });
      chrome.action.setBadgeBackgroundColor({ color: '#4688F1' });
    }
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener(() => {
  console.log('Extension clicked, selected tabs:', selectedTabs);
  if (selectedTabs.length > 0) {
    openSplitView();
  }
});

function openSplitView() {
  chrome.system.display.getInfo((displays) => {
    const primaryDisplay = displays[0];
    const screenWidth = primaryDisplay.workArea.width;
    const screenHeight = primaryDisplay.workArea.height;
    const windowWidth = Math.floor(screenWidth / 2);
    const windowHeight = screenHeight;

    console.log('Creating windows for tabs:', selectedTabs);
    
    // Create windows side by side
    selectedTabs.forEach((tab, index) => {
      const left = index % 2 === 0 ? 0 : windowWidth;
      const top = 0;

      chrome.windows.create({
        url: tab.url,
        left: left,
        top: top,
        width: windowWidth,
        height: windowHeight,
        focused: index === 0,
        type: 'normal'
      }, (window) => {
        console.log(`Window ${index} created:`, window);
      });
    });

    // Clear the selection after opening
    selectedTabs = [];
    chrome.action.setBadgeText({ text: '' });
  });
} 