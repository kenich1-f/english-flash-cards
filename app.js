/*====================================
 English Flash Cards v3
 Part1
====================================*/

/* ---------- DOM ---------- */

const home = document.getElementById("home");
const study = document.getElementById("study");

const range = document.getElementById("range");
const mode = document.getElementById("mode");

const dark = document.getElementById("dark");

const start = document.getElementById("start");
const review = document.getElementById("review");

const progress = document.getElementById("progress");
const card = document.getElementById("card");

const flip = document.getElementById("flip");

const known = document.getElementById("known");
const unknown = document.getElementById("unknown");

const prev = document.getElementById("prev");
const next = document.getElementById("next");

const homeBtn = document.getElementById("homeBtn");


/* ---------- DATA ---------- */

let cards = [];

let index = 0;

let showingMeaning = false;

let reviewMode = false;


/* ---------- 苦手単語 ---------- */

let wrongIds =
JSON.parse(
localStorage.getItem("wrongWords")
) || [];


/* ---------- ダークモード ---------- */

const darkSaved =
localStorage.getItem("darkMode");

if(darkSaved==="true"){

    document.body.classList.add("dark");

    dark.checked=true;

}

dark.addEventListener("change",()=>{

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "darkMode",
        dark.checked
    );

});


/* ---------- シャッフル ---------- */

function shuffle(array){

    for(
        let i=array.length-1;
        i>0;
        i--
    ){

        const j=
        Math.floor(
            Math.random()*(i+1)
        );

        [array[i],array[j]]
        =
        [array[j],array[i]];

    }

}


/* ---------- 範囲取得 ---------- */

function getRangeWords(){

    // 苦手復習を最優先
    if(reviewMode){

        return WORDS.filter(
            w => wrongIds.includes(w.id)
        );

    }

    // 試験直前100語
    if(range.value==="last100"){

        return WORDS.filter(
            w => LAST100.includes(w.word)
        );

    }

    if(range.value==="all"){

        return [...WORDS];

    }

    const split = range.value.split("-");

    const min = Number(split[0]);
    const max = Number(split[1]);

    return WORDS.filter(
        w =>
        w.id >= min &&
        w.id <= max
    );

}
/* ---------- カード表示 ---------- */

function showCard(){

    if(cards.length===0){

        progress.textContent="0 / 0";

        card.textContent="単語がありません";

        return;

    }

    const current=cards[index];

    if(showingMeaning){

        card.textContent=current.meaning;

        flip.textContent="英語を見る";

    }else{

        card.textContent=current.word;

        flip.textContent="答えを見る";

    }

    progress.textContent=
    `${index+1} / ${cards.length}`;

}


/* ---------- 学習開始 ---------- */

function startStudy(){

    reviewMode=false;

    cards=getRangeWords();

    if(mode.value==="shuffle"){

        shuffle(cards);

    }

    index=0;

    showingMeaning=false;

    home.style.display="none";

    study.style.display="block";

    showCard();

}


/* ---------- 苦手復習 ---------- */

function startReview(){

    reviewMode=true;

    cards=getRangeWords();

    if(cards.length===0){

        alert("苦手単語はありません");

        reviewMode=false;

        return;

    }

    shuffle(cards);

    index=0;

    showingMeaning=false;

    home.style.display="none";

    study.style.display="block";

    showCard();

}


/* ---------- カード反転 ---------- */

function flipCard(){

    showingMeaning=!showingMeaning;

    showCard();

}


/* ---------- 次へ ---------- */

function nextCard(){

    if(cards.length===0) return;

    index++;

    if(index>=cards.length){

        index=0;

    }

    showingMeaning=false;

    showCard();

}


/* ---------- 前へ ---------- */

function prevCard(){

    if(cards.length===0) return;

    index--;

    if(index<0){

        index=cards.length-1;

    }

    showingMeaning=false;

    showCard();

}
/* ---------- 苦手単語追加 ---------- */

function addWrongWord(){

    if(cards.length===0) return;

    const id=cards[index].id;

    if(!wrongIds.includes(id)){

        wrongIds.push(id);

        localStorage.setItem(
            "wrongWords",
            JSON.stringify(wrongIds)
        );

    }

    nextCard();

}


/* ---------- 苦手単語から削除 ---------- */

function removeWrongWord(){

    if(!reviewMode){

        nextCard();

        return;

    }

    const id=cards[index].id;

    wrongIds=
    wrongIds.filter(
        x=>x!==id
    );

    localStorage.setItem(
        "wrongWords",
        JSON.stringify(wrongIds)
    );

    cards=getRangeWords();

    if(cards.length===0){

        alert("苦手単語をすべて覚えました！");

        home.style.display="block";

        study.style.display="none";

        return;

    }

    if(index>=cards.length){

        index=0;

    }

    showingMeaning=false;

    showCard();

}


/* ---------- ホームへ ---------- */

function goHome(){

    study.style.display="none";

    home.style.display="block";

}


/* ---------- イベント ---------- */

start.addEventListener(
    "click",
    startStudy
);

review.addEventListener(
    "click",
    startReview
);

flip.addEventListener(
    "click",
    flipCard
);

card.addEventListener(
    "click",
    flipCard
);

next.addEventListener(
    "click",
    nextCard
);

prev.addEventListener(
    "click",
    prevCard
);

unknown.addEventListener(
    "click",
    addWrongWord
);

known.addEventListener(
    "click",
    removeWrongWord
);

homeBtn.addEventListener(
    "click",
    goHome
);


/* ---------- 初期画面 ---------- */

study.style.display="none";
home.style.display="block";
console.log("app.js loaded");
alert("app.js loaded");
alert(typeof WORDS);
