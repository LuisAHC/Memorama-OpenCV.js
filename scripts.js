// declare modal
let modal = document.getElementById("popup1")
// close icon in modal
let closeicon = document.querySelector(".close");

const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

let numSidesFirst, numSidesSecond;
let matchesCount = 0;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  // second click
  secondCard = this;

  checkForMatch();
}

function checkForMatch() {
  console.log(matchesCount);
  featExt(firstCard, secondCard); //we get the number of sides of each figure
  let isMatch = numSidesFirst === numSidesSecond;
  matchesCount = isMatch ? matchesCount+1 : matchesCount;
  isMatch ? disableCards() : unflipCards();

  if (matchesCount == 10){
    console.log('ganaste');
    congratulations();
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 20);
    card.style.order = randomPos;
    var canvas = card.querySelector('#canvasOutput');

    var ctx = canvas.getContext('2d');

    let image = card.querySelector('#front');

    ctx.drawImage(image,0,0);
  });
})();

cards.forEach(card => card.addEventListener('click', flipCard));

function featExt() {
  for (let i = 0; i < 2; ++i){
    if (i == 0){
      var canvas = firstCard.querySelector('#canvasOutput');
      console.log(canvas);
      let src = cv.imread(canvas);
      let dst = cv.Mat.zeros(src.cols, src.rows, cv.CV_8UC3);
      cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
      cv.threshold(src, src, 120, 200, cv.THRESH_BINARY);
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      let poly = new cv.MatVector();
      cv.findContours(src, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

      // approximates each contour to polygon
      for (let j = 0; j < contours.size(); ++j) {
        let tmp = new cv.Mat();
        let cnt = contours.get(j);
        cv.approxPolyDP(cnt, tmp, 3, true);
        poly.push_back(tmp);
        console.log(tmp.rows)
        numSidesFirst = tmp.rows;
        cnt.delete();
      }
      src.delete(); dst.delete(); contours.delete(); hierarchy.delete();
    }else if (i == 1){
      var canvas = secondCard.querySelector('#canvasOutput');
      console.log(canvas);
      let src = cv.imread(canvas);
      let dst = cv.Mat.zeros(src.cols, src.rows, cv.CV_8UC3);
      cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
      cv.threshold(src, src, 120, 200, cv.THRESH_BINARY);
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      let poly = new cv.MatVector();
      cv.findContours(src, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

      // approximates each contour to polygon
      for (let j = 0; j < contours.size(); ++j) {
        let tmp = new cv.Mat();
        let cnt = contours.get(j);
        cv.approxPolyDP(cnt, tmp, 3, true);
        poly.push_back(tmp);
        console.log(tmp.rows);
        numSidesSecond = tmp.rows;
        cnt.delete();
      }
      src.delete(); dst.delete(); contours.delete(); hierarchy.delete();
    }
    
  }
  
  //cnts = (cnts.length == 2) ? cnts[0] : (cnts.length == 3) ? cnts[1] : cnts

}

function congratulations(){
  // show congratulations modal
  modal.classList.add("show");

  //closeicon on modal
  closeModal();
}

function closeModal(){
    closeicon.addEventListener("click", function(e){
        modal.classList.remove("show");
    });
}

function playAgain(){
    modal.classList.remove("show");
}
