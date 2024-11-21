document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['splitViewUrls'], (result) => {
    const urls = result.splitViewUrls || [];
    const container = document.getElementById('container');

    urls.forEach(url => {
      const iframe = document.createElement('iframe');
      iframe.src = url;
      container.appendChild(iframe);
    });
  });
}); 