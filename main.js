// first api who use cors restriction you can try it in your local machine
// 201cc9402332493c914ab17a843ad934
// Documentation https://newsapi.org/docs/get-started
// second api:
// pub_6502587176810f412d8eb9782929f60d6c347
// https://newsdata.io/documentation/#latest-news

// getting news from the api 
const lastNews = document.querySelectorAll(".LastNewsSection .news .newsBox");

async function getLastestTecNews() {
    let data = await fetch("https://api.allorigins.win/get?url=" + encodeURIComponent("https://newsdata.io/api/1/latest?country=us&category=business&language=en&apikey=pub_6502587176810f412d8eb9782929f60d6c347"));
    data = await data.json();
    data = JSON.parse(data.contents);
    console.log(data)
    return data ;
}

// setting news to html elements
async function setData() {
    let data = await getLastestTecNews();
    data = data.results ;
    let i,j ;
    i= 0;  // api news index (there is removed news sometimes so i use this as a seperate index to test if the news is removed or not)
    j= 0; //news index for html elements (incrrement when one news is set)
    while(j<3){
        if((data[i].title === null)||(data[i].image_url === null)){
            i++ ;
        }
        else {
            lastNews[j].querySelector("a img").src = data[i].image_url;
            lastNews[j].querySelector("a .newsTitle").textContent = data[i].title;
            i++ ;
            j++ ;
        }
    }
}
setData();

// handling animation for the lastest news slider
let currentNews = 0 ;
let NextNews ;
const moveLeftButton = document.querySelector(".LastNewsSection .news button:first-of-type");
const moveRightButton = document.querySelector(".LastNewsSection .news button:last-of-type");

window.setInterval(()=> {
    if((moveRightButton.disabled || moveLeftButton.disabled) !== true){ // this test is to prevent conflict if there is already an animation happening
        moveRight();
    }
},4000);

moveRightButton.addEventListener("click",moveRight);
moveLeftButton.addEventListener("click",moveLeft);

async function moveRight(){
    moveRightButton.disabled = true ;
    moveLeftButton.disabled = true ;
    NextNews = (currentNews+1)%lastNews.length ; 
    await handleAnimation_Move_Right(lastNews[currentNews],lastNews[NextNews]);
    currentNews = NextNews;
    moveRightButton.disabled = false ;
    moveLeftButton.disabled = false ;
}

async function moveLeft(){
    moveLeftButton.disabled = true ;
    moveRightButton.disabled = true ;
    if (currentNews === 0) {
        NextNews = Math.abs((currentNews - lastNews.length) + 1);
    } else {
        NextNews = currentNews - 1 ;
    } 
    await handleAnimation_Move_Left(lastNews[currentNews],lastNews[NextNews]);
    currentNews = NextNews ;
    moveRightButton.disabled = false ;
    moveLeftButton.disabled = false ;
}


// handling the animations when you clicking the arrow-right
async function handleAnimation_Move_Right(currentElement,nextElement) {
    let currentElementAnimation = new Promise((resolve) => {
        currentElement.addEventListener('animationend', function handler1(){// when animation end
            currentElement.classList.value = "newsBox hideNewsBox";//remove animation class(property)
            currentElement.removeEventListener('animationend',handler1);
            resolve(); 
        })
        currentElement.classList.add("centerToRight");//animation start
    });
    let nextElementAnimation = new Promise((resolve) => {
        nextElement.addEventListener('animationend', function handler2(){// when animation end
            nextElement.classList.value = "newsBox";//remove animation class(property)
            nextElement.removeEventListener('animationend', handler2); 
            resolve(); 
        });
        nextElement.classList.remove("hideNewsBox");
        nextElement.classList.add("leftToCenter");//animation start
    })
    return Promise.allSettled([currentElementAnimation,nextElementAnimation]) ;//wait for both animations to end
}

// handling the animations when you clicking the arrow-left
async function handleAnimation_Move_Left(currentElement,nextElement) {
    let currentElementAnimation = new Promise((resolve) => {
        currentElement.addEventListener('animationend', function handler1(){ // when animation end
            currentElement.classList.value = "newsBox hideNewsBox";//remove animation class(property)
            currentElement.removeEventListener('animationend',handler1);
            resolve(); 
        })
        currentElement.classList.add("centerToLeft");//animation start
    });
    let nextElementAnimation = new Promise((resolve) => {
        nextElement.addEventListener('animationend', function handler2() {
            nextElement.classList.value = "newsBox"; //remove animation class(property)
            nextElement.removeEventListener('animationend', handler2); 
            resolve(); 
        });
        nextElement.classList.remove("hideNewsBox");
        nextElement.classList.add("rightToCenter");//animation start
    })
    return Promise.allSettled([currentElementAnimation,nextElementAnimation]) ;//wait for both animations to end
}

