document.getElementById('protanopia-btn').addEventListener('click', () => setFilter('protanopia'));
document.getElementById('deuteranopia-btn').addEventListener('click', () => setFilter('deuteranopia'));
document.getElementById('tritanopia-btn').addEventListener('click', () => setFilter('tritanopia'));
document.getElementById('reset-btn').addEventListener('click', () => setFilter('normal'));

function setFilter(type) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: applyCVDFilter,
      args: [type]
    });
  });
}

function applyCVDFilter(type) {
  const existing = document.getElementById('cvd-filter');
  if (existing) existing.remove();

  if (type === 'normal') {
    document.body.style.filter = "";
    return;
  }

  fetch(chrome.runtime.getURL(`filters/${type}.svg`))
    .then(res => res.text())
    .then(svgText => {
      const div = document.createElement('div');
      div.id = 'cvd-filter';
      div.style.position = 'absolute';
      div.style.width = '0';
      div.style.height = '0';
      div.style.overflow = 'hidden';
      div.innerHTML = svgText;
      document.body.appendChild(div);
      document.body.style.filter = `url(#${type})`;
    })
    .catch(err => console.error('Filter load failed:', err));
}
