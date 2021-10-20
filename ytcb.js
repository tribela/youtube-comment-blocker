const storageKey = 'ytcb-blocks';
const blockedList = JSON.parse(localStorage.getItem(storageKey)) || [];
const commentsBox = document.querySelector('ytd-comments#comments');
const selector = 'ytd-comment-renderer';

const refilterAll = function() {
  const comments = commentsBox.querySelectorAll(selector);
  for (const comment of comments) {
    filter(comment);
  }
};

const blockUser = function(link) {
  console.log(`Block user ${link}`);
  blockedList.push(link);
  console.log(blockedList);
  localStorage.setItem(storageKey, JSON.stringify(blockedList));
  refilterAll();
};

const filter = function(element) {
  const className = 'ytcb';

  const author = element.querySelector('#body > #main > #header > #header-author a#author-text');
  const authorName = author.textContent.trim();
  const authorLink = author.href;
  if (blockedList.includes(authorLink)) {
    // element.style.background = 'red';
    element.parentElement.removeChild(element);
    console.log(authorName);
  } else {
    if (element.classList.contains(className)) return;
    const blockButton = document.createElement('span');
    blockButton.textContent = 'block';
    blockButton.style.textShadow = '0 0 1px white';
    blockButton.style.color = 'black';
    blockButton.style.padding = '0 1em';
    blockButton.addEventListener('click', ()=>{blockUser(authorLink)});
    element.querySelector('#header-author').appendChild(blockButton);
  }

  element.classList.add(className);
};

const callback = function(mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList' && mutation.target.matches(selector)) {
      filter(mutation.target);
    }
  }
};

const config = {
  attributes: false,
  childList: true,
  subtree: true,
};

refilterAll();
const observer = new MutationObserver(callback);
observer.observe(commentsBox, config);

console.log(blockedList);
