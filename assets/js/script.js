//inizializzo le variabili e creo le costanti che mi serviranno durante il gioco
const words = ["panda", "cane", "cavallo", "criceto", "koala", "gatto"];

const allKeyboard = "QWERTYUIOPASDFGHJKLZXCVBNM";
const keys = allKeyboard.split(""); //creo l'array che utilizzerò per formare la tastiera a schermo
let guessedLetters = [];
let tries = 6;
let wrongLetters = [];
let selectedWord = "";

function generateWord() {
  fetch("https://random-word-api.herokuapp.com/word?lang=it")
    .then((response) => response.json())
    .then((json) => {
      selectedWord = json[0];
      selectedWord = selectedWord.toUpperCase(); //maiuscolo per confrontare dopo
      displayWord();
    })
    .catch((err) => console.log(err));
}
generateWord();

const wrongAudio = document.querySelector("#wrongAudio");
const rightAudio = document.querySelector("#rightAudio");
const winAudio = document.querySelector("#winAudio");
const loseAudio = document.querySelector("#loseAudio");
/*let selectedWord = words[Math.floor(Math.random() * words.length)]; //scelgo una parola casuale dall'array
selectedWord = selectedWord.toUpperCase(); //maiuscolo per confrontare dopo*/
generateKeyboard(); //tastiera a scermo

displayWord(); //funzione che fa apparire la lettera nel caso venga indovinata

function generateKeyboard() {
  //creo la tastiera a schermo
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (i < 10) {
      //separo la riga QWERTYUIOP
      const keyDisplay = document.querySelector(".qwerty");
      const showKey = document.createElement("div");
      showKey.classList.add("key");
      showKey.innerText = key;
      showKey.setAttribute("onclick", "checkLetter(" + key + ")");
      showKey.setAttribute("id", key);
      keyDisplay.appendChild(showKey);
    } else if (i < 19) {
      // riga ASDFGHJKL
      const keyDisplay = document.querySelector(".asdfg");
      const showKey = document.createElement("div");
      showKey.classList.add("key");
      showKey.innerText = key;
      showKey.setAttribute("onclick", "checkLetter(" + key + ")");
      showKey.setAttribute("id", key);
      keyDisplay.appendChild(showKey);
    } else {
      //riga ZXCVBNM
      const keyDisplay2 = document.querySelector(".zxcvb");
      const showKey = document.createElement("div");
      showKey.classList.add("key");
      showKey.innerText = key;
      showKey.setAttribute("onclick", "checkLetter(" + key + ")");
      showKey.setAttribute("id", key);
      keyDisplay2.appendChild(showKey);
    }
  }
}

function displayWord() {
  console.log(selectedWord);
  const wordArray = selectedWord.split(""); //divido la parola lettera per lettera in un array per permettermi di fare il confronto
  const wordDisplay = document.querySelector(".hangman-game");

  for (let i = 0; i < wordArray.length; i++) {
    // metto a schermo le mie lettere che compongono la parola casuale
    const wordDisplayChild = document.createElement("div");
    wordDisplay.appendChild(wordDisplayChild);
    const gameLetter = document.createElement("p");
    gameLetter.classList.add("gameLetter" + wordArray[i]);
    gameLetter.classList.add("not-guessed"); //assegno una classe che le rende invisibili e che toglierò nel momento in cui vengono indovinate
    gameLetter.innerText = wordArray[i];
    wordDisplayChild.appendChild(gameLetter);
  }
}

function checkLetter(letter) {
  letter = letter.innerText; //leggo il contenuto testuale del tasto premuto per confrontare

  document.querySelector("#" + letter).classList.add("guessed"); //opacizzo il tasto
  document.querySelector("#" + letter).removeAttribute("onclick"); //evito che venga premuto nuovamente

  if (!selectedWord.includes(letter)) {
    let wrongTry = document.querySelector(".inactive");
    wrongTry.classList.remove("inactive"); //scopro le immagini dell'impiccato una ad una
    wrongLetters.push(letter); //aggiungo all'array degli errori per mostrarli a schermo
    const wrongGuessed = document.querySelector(".wrongLetters");
    wrongGuessed.innerHTML += letter + ", "; //mostro a schermo le lettere errate
    wrongAudio.volume = 0.2;
    wrongAudio.play();
    setTimeout(() => {
      alert("La lettera " + letter + " non è presente. Riprova.");
    }, 300);
    tries--;
    if (tries == 0) {
      loseAudio.volume = 0.2;
      loseAudio.play();
      setTimeout(() => {
        alert("Hai perso, Mi dispiace, la parola era " + selectedWord);
        location.reload();
      }, 1000);
    }
  } else {
    let guessed = document.querySelectorAll(".gameLetter" + letter); //qui lavoro anche nel caso la stessa lettera sia presente più di una volta
    for (let i = 0; i < guessed.length; i++) {
      guessed[i].classList.remove("not-guessed");
      guessedLetters.push(letter);
    }
    rightAudio.volume = 0.2;
    rightAudio.play();

    checkWin();
  }
}

function checkWin() {
  //funzione che controlla se il gioco può continuare o se ho vinto
  const selectedArray = selectedWord.split(""); //creo un array con le lettere che compongono la parola casuale
  if (selectedArray.length == guessedLetters.length) {
    let selectedArraySorted = selectedArray.sort();
    let guessedLettersSorted = guessedLetters.sort();
    selectedArraySorted = selectedArraySorted.toString();
    guessedLettersSorted = guessedLettersSorted.toString(); //questo passo mi permette di confrontare le due arrays
    if (selectedArraySorted === guessedLettersSorted) {
      winAudio.volume = 0.2;
      winAudio.play();
      setTimeout(() => {
        alert("Hai vinto, Let's Gowski. Let's go!");
        location.reload();
      }, 300);
    }
  }
}
