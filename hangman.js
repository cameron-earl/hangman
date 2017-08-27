const WORD_BOX = document.querySelector("#word-box");
const MSG_BOX = document.querySelector("#msg-box");
const STAT_BOX = document.querySelector("#stat-box");
const LETTER_BOX = document.querySelector("#letter-box");

let wordList = [
  "ÐûàóÀÙ²", "ÔÑÚçÒ×¶Å", "ÎËâÕØ", "ØÝÚáÎÅÐ­¸©", "ÒëèÝÈ·Æ", "ÖûÒÍÚË¸Çº", "Ò÷æÓÖ¿Î", "ÔåèëèÙ´", "ØïèéàÕ¸½º", "Ôñèçè¿Ò", "Ðíøáâ", "ÖûÌéê¿Ð", "Ü÷îÛàÕ°¯", "ØÕìïÎ»", "Üáò×ÐÕÊµ", "ÖÝäåÂ", "ÞõÐãÌçÌÅ¨", "ÜùèÍèÉÊ»", "àÓæõÄÕÀÕ", "ÚÍüÍÀÑ", "Øûæçì", "ÚËØ×ä", "âÓîÙÄí°Å", "àíÞíèÉÈ­", "ÜýèÓÆÏ", "æÛÚçìÍ¼µ§", "äíöÓæÅ°§", "â÷ÖëÂßÊÃ", "Üõäåì", "ÞËúõì", "èÕĂùÆÓÆµ°", "ÞÛÒÍì", "ÜÙàï", "â÷àÏÂÓÚ", "àËøÃÐ", "àÛäçÐ", "àáðéî", "æßòÏâ·Â", "àåâß", "äõøíàå", "è×äÏÚÝÈ", "ìûèãÔÅÀ«", "èÿðíÐÁÜ", "îûèÍèÏØ¹ª", "ð÷öíÄ¿ÀÕ", "êûúÑÆÏ", "ìÍÜÅÖµ", "ðÑðÉØÏ®Ï", "ìÛàÍÊÍ", "êÛöËÒ", "êçÞ×¼", "ìéöñÚá", "òõàãÔáÀÍ", "ðùĀûØÉÈ­", "îõÊçäç", "òùÞ÷Þß¾¥", "îÓÈÇâ", "ôÙØÉÆßÊÃ", "ò×ðíÊßÂ", "øÝüÝðÍ¼µ", "ôßþïÐÑ¾¥", "îçÔëÄ", "òÑìÕÜÛ", "òëØÕØã", "òíòÅêÉ", "øûÚÕÌÝÀ½ ", "òùÚïÆË", "òýäë¾ã", "òçÈÉì", "öûÔÝÊÝº", "ôåúÓÚ", "üÑðÙÂ»Ä©", "þïĀÓìÝÀÇ¬", "öÉôñ", "ĂåèÓÎ¿º­º«", "üËÌÑâ", "ĂíöïÐÃÖ·", "Ă×ÌÝÜßÐ", "ĀÝÖ÷¾Á", "þÛæáì", "ĀéâÇÎ½"
];


let currentWord,
  wordArr,
  isOver = false;;

window.onload = () => {
  createAlphabet();
  addEvents();
  newGame();
};

const createAlphabet = () => {
  for (let i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); i++) {
    let l = String.fromCodePoint(i)
    let el = document.createElement('span');
    let text = document.createTextNode(l);
    el.appendChild(text);
    el.className = 'letter';
    el.id = l;
    el.addEventListener("click", guess);
    LETTER_BOX.appendChild(el);
  }
};

const addEvents = () => {
  window.addEventListener("keydown", function(ev) {
    var key = ev.key.toLowerCase();
    if (!isOver && key.length === 1 && /[a-z]/.test(key)) {
      let el = document.querySelector("#" + key);
      el.classList.add("grow");
      guess(el);
    }

    switch (key) {
      case " ":
      case "enter":
        newGame();
        break;
    }
  });
  window.addEventListener("keyup", function(ev) {
    var key = ev.key.toLowerCase();
    if (key.length === 1 && /[a-z]/.test(key)) {
      let el = document.querySelector("#" + key);
      el.classList.remove("grow");
      if (!isOver) {
        el.classList.add("no-animate");
        guess(el);
      }
    }
  });
}

const guess = (ev) => {
  let el = ev.target || ev;
  if (el.classList.contains("wrong") ||
    el.classList.contains("correct")) return;
  let letter = el.id;
  let goodGuess = false;
  let word = decryptStr(currentWord);
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      wordArr[i] = true;
      goodGuess = true;
    }
  }
  if (goodGuess) displayWord();
  el.className += goodGuess ? " correct" : " wrong";
  if (wordArr.every(b => b === true)) gameOver();
};

const newGame = () => {
  setWord();
  displayWord();
  updateLetters();
  isOver = false;
  LETTER_BOX.classList.remove("game-over");
};

const gameOver = () => {
  LETTER_BOX.classList.add("game-over");
  isOver = true;
}

const setWord = () => {
  let word = getRandomWord();
  while (word === currentWord) {
    word = getRandomWord();
  }
  currentWord = word;
  displayedWord = getUnderscores(word);
  wordArr = new Array(word.length).fill(false);
};

const getRandomWord = (encrypted = true) => {
  encrypted = false || encrypted;
  let i = Math.floor(Math.random() * wordList.length);
  if (encrypted) return wordList[i];
  return decryptStr(wordList[i]);
};

const getUnderscores = (word) => {
  let newWord = "";
  for (let l of word) {
    newWord += "_";
  }
  return newWord;
}

const displayWord = () => {
  let newWord = "";
  let decryptedWord = decryptStr(currentWord);
  for (let i = 0; i < currentWord.length; i++) {
    newWord += wordArr[i] ? decryptedWord[i] : '_';
  }
  WORD_BOX.textContent = newWord;
}

const updateLetters = () => {
  let letters = LETTER_BOX.getElementsByClassName("letter");
  for (let i = 0; i < letters.length; i++) {
    letters[i].className = "letter";
  }
}

const decryptStr = (str) => {
  let newStr = "";
  for (let i = 0; i < str.length; i++) {
    newStr += String.fromCodePoint((str.codePointAt(i)+ i*i - (str.length << 1)) >> 1)
  }
  return newStr
};
