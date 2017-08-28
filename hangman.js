const WORD_BOX = document.querySelector("#word-box");
const MSG_BOX = document.querySelector("#msg-box");
const LETTER_BOX = document.querySelector("#letter-box");
const CUSTOM_BTN = document.querySelector("#custom-btn");
const CUSTOM_INPUT = document.querySelector('#custom-input');
const NEW_GAME_BTN = document.querySelector("#new-game-btn");
const HEAD = document.querySelector('#head');
const TRUNK = document.querySelector('#trunk');
const ARM_R = document.querySelector('#arm-r');
const ARM_L = document.querySelector('#arm-l');
const LEG_R = document.querySelector('#leg-r');
const LEG_L = document.querySelector('#leg-l');
const FACE = document.querySelector('#face');
const BODY = [HEAD, TRUNK, ARM_L, ARM_R, LEG_L, LEG_R, FACE];

let wordList = [
  "ÐûàóÀÙ²", "ÔÑÚçÒ×¶Å", "ÎËâÕØ", "ØÝÚáÎÅÐ­¸©", "ÒëèÝÈ·Æ", "ÖûÒÍÚË¸Çº", "Ò÷æÓÖ¿Î", "ÔåèëèÙ´", "ØïèéàÕ¸½º", "Ôñèçè¿Ò", "Ðíøáâ", "ÖûÌéê¿Ð", "Ü÷îÛàÕ°¯", "ØÕìïÎ»", "Üáò×ÐÕÊµ", "ÖÝäåÂ", "ÞõÐãÌçÌÅ¨", "ÜùèÍèÉÊ»", "àÓæõÄÕÀÕ", "ÚÍüÍÀÑ", "Øûæçì", "ÚËØ×ä", "âÓîÙÄí°Å", "àíÞíèÉÈ­", "ÜýèÓÆÏ", "æÛÚçìÍ¼µ§", "äíöÓæÅ°§", "â÷ÖëÂßÊÃ", "Üõäåì", "ÞËúõì", "èÕĂùÆÓÆµ°", "ÞÛÒÍì", "ÜÙàï", "â÷àÏÂÓÚ", "àËøÃÐ", "àÛäçÐ", "àáðéî", "æßòÏâ·Â", "àåâß", "äõøíàå", "è×äÏÚÝÈ", "ìûèãÔÅÀ«", "èÿðíÐÁÜ", "îûèÍèÏØ¹ª", "ð÷öíÄ¿ÀÕ", "êûúÑÆÏ", "ìÍÜÅÖµ", "ðÑðÉØÏ®Ï", "ìÛàÍÊÍ", "êÛöËÒ", "êçÞ×¼", "ìéöñÚá", "òõàãÔáÀÍ", "ðùĀûØÉÈ­", "îõÊçäç", "òùÞ÷Þß¾¥", "îÓÈÇâ", "ôÙØÉÆßÊÃ", "ò×ðíÊßÂ", "øÝüÝðÍ¼µ", "ôßþïÐÑ¾¥", "îçÔëÄ", "òÑìÕÜÛ", "òëØÕØã", "òíòÅêÉ", "øûÚÕÌÝÀ½ ", "òùÚïÆË", "òýäë¾ã", "òçÈÉì", "öûÔÝÊÝº", "ôåúÓÚ", "üÑðÙÂ»Ä©", "þïĀÓìÝÀÇ¬", "öÉôñ", "ĂåèÓÎ¿º­º«", "üËÌÑâ", "ĂíöïÐÃÖ·", "Ă×ÌÝÜßÐ", "ĀÝÖ÷¾Á", "þÛæáì", "ĀéâÇÎ½"
];


let currentWord,
  wordArr,
  isOver = false
  badGuessCount = 0,
  guessCount = 0,
  gameCount = 0,
  inputActive = false;

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
    if (!inputActive) {
      var key = ev.key.toLowerCase();
      if (!isOver && key.length === 1 && /[a-z]/.test(key)) {
        let el = document.querySelector("#" + key);
        el.classList.add("change");
        guess(el);
      }
    }
    if (key === "enter") {
        newGame();
        NEW_GAME_BTN.classList.add("change");
    }
  });

  window.addEventListener("keyup", function(ev) {
    var key = ev.key.toLowerCase();
    if (key.length === 1 && /[a-z]/.test(key)) {
      let el = document.querySelector("#" + key);
      el.classList.remove("change");
      if (!isOver) {
        el.classList.add("no-animate");
      }
    }
    if (key === "enter") {
        NEW_GAME_BTN.classList.remove("change");
    }
  });

  NEW_GAME_BTN.addEventListener("click", newGame);
  CUSTOM_BTN.addEventListener("click", (ev) => {
    CUSTOM_INPUT.classList.toggle("hidden");
    inputActive = !inputActive;
    if (inputActive) {
      CUSTOM_INPUT.focus();
    }
    else {
      CUSTOM_INPUT.value = "";
    }
  });

  CUSTOM_INPUT.addEventListener("keyup", (ev) => {
    if (ev.keyCode === 13) {
      newGame(CUSTOM_INPUT.value);
      CUSTOM_BTN.click();
    } else if (ev.keyCode === 27) {
      CUSTOM_BTN.click();
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
  guessCount++;
  el.className += goodGuess ? " correct" : " wrong";
  if (goodGuess) {
    displayWord();
  } else {
    badGuessCount++;
    BODY[badGuessCount-1].classList.remove("faded");
  }
  if (wordArr.every(b => b === true)) win();
  if (badGuessCount === BODY.length) lose();
};

const newGame = (word) => {
  setWord(word);
  displayWord();
  updateLetters();
  LETTER_BOX.classList.remove("game-over");
  WORD_BOX.classList.remove("wrong");
  badGuessCount = 0;
  guessCount = 0;
  for(let x of BODY) {
    x.classList.add('faded');
  }
  if (isOver) gameCount++;
  console.log(gameCount);
  isOver = false;
  MSG_BOX.textContent = getRandomMessage();
};

const win = () => {
  LETTER_BOX.classList.add("game-over");
  isOver = true;
  let accuracy = Math.floor((guessCount - badGuessCount) / guessCount * 100);
  MSG_BOX.textContent = "You won with " + accuracy + "% accuracy. Press enter or click button for new game.";
}

const lose = () => {
  LETTER_BOX.classList.add("game-over");
  isOver = true;
  MSG_BOX.textContent = randomLossMsg();
  for (let i = 0; i < wordArr.length; i++) {
    wordArr[i] = true;
  }
  //TODO: Guessed letters stay black
  WORD_BOX.classList.add("wrong");
  displayWord();
}

const randomLossMsg = () => {
  const messages = [
    "He was wrong to choose trial by word guessing.",
    "Some people enjoy saving lives, but you aren't some people.",
    "So ends the life of another faceless SVG.",
    "You're supposed to guess the word BEFORE he dies.",
    "In losing, you learned. Keep racking up them corpses!",
    "That was the opposite of winning."
  ];
  let i = Math.floor(Math.random() * messages.length);
  return messages[i];
}

const setWord = (word) => {
  if (typeof word === "string") {
    word = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
    word = word.length >= 4 ? encryptStr(word) : getRandomWord();
  } else {
    word = getRandomWord();
  }
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

const getRandomMessage = () => {
  if (!gameCount) {
    return "Welcome to hangman! Click or type letters to guess.";
  }

  let messages = [
    "You can type or click the letters, whichever is easier.",
    "You can set your own words (for your friends) with custom.",
    "Feel free to inspect the code with Cmd+Alt+I! But no cheating.",
    currentWord.length + " letters of mystery. Guess away!",
    "These aren't word-specific hints, by the way.",
    "There are " + wordList.length + " total possible words.",
    "There's no place like 127.0.0.1",
    "Right or wrong, at least it's not a matter of life and death, right? ...",
    '["hip","hip"]',
    'Two threads walk into a bar. The barkeeper looks up and yells, "hey, I want don\'t any conditions race like time last!"'
  ];
  let i = Math.floor(Math.random() * Math.random() * messages.length);
  return messages[i];
}

const encryptStr = (str) => {
  let newStr = "";
  for (let i = 0; i < str.length; i++) {
    newStr += String.fromCodePoint((str.codePointAt(i) << 1) + (str.length << 1) - i*i);
  }
  return newStr;
};

const decryptStr = (str) => {
  let newStr = "";
  for (let i = 0; i < str.length; i++) {
    newStr += String.fromCodePoint((str.codePointAt(i)+ i*i - (str.length << 1)) >> 1)
  }
  return newStr
};
