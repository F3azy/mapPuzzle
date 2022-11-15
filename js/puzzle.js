class Puzzle {
    static #puzzlePiecesBox;
    static #puzzleBoard;
    static #piecesAmount;
    static #puzzleImage;
    #imageWidth;
    #imageHeight;
    #puzzlePiecesArray;

    constructor(puzzlePiecesBox, imgToPlay, puzzleBoard, amount) {
        Puzzle.#puzzlePiecesBox = puzzlePiecesBox;
        Puzzle.#puzzleBoard = puzzleBoard;
        Puzzle.#piecesAmount = amount;
        Puzzle.#puzzleImage = imgToPlay;
        this.#imageWidth = Puzzle.#puzzleImage.width;
        this.#imageHeight = Puzzle.#puzzleImage.height;
        this.#puzzlePiecesArray = new Array();
    }

    startGame() {
        this.#dividePhoto();
        this.#setPiecesBox();
        this.#showPieces();
        this.#divideBoard();
    }

    #dividePhoto() {
        Puzzle.#puzzlePiecesBox.innerHTML = '';

        const width = this.#imageWidth / Puzzle.#piecesAmount;
        const height = this.#imageHeight / Puzzle.#piecesAmount;

        let index = 0;

        for (let i = 0; i < Puzzle.#piecesAmount; i++) {
            for (let j = 0; j < Puzzle.#piecesAmount; j++) {
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");

                ctx.drawImage(Puzzle.#puzzleImage, j*width, i*height, width, height, 0, 0, width, height);

                const image = document.createElement("img");
                image.id = "img"+index;
                image.width = width;
                image.height = height;
                image.src = canvas.toDataURL();
                image.draggable = true;
                image.addEventListener("dragstart", Puzzle.#puzzlePieceDrag);

                this.#puzzlePiecesArray.push(image);

                index++;
            }
        }
    }

    #shuffleArray() {
        for (let i = this.#puzzlePiecesArray.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.#puzzlePiecesArray[i], this.#puzzlePiecesArray[j]] = [this.#puzzlePiecesArray[j], this.#puzzlePiecesArray[i]];
        }
    }

    #showPieces() {
        this.#shuffleArray();
        for (let i = 0; i < this.#puzzlePiecesArray.length; i++) {
            Puzzle.#puzzlePiecesBox.appendChild(this.#puzzlePiecesArray[i]);
        }
    }

    #setPiecesBox() {
        
        if(Puzzle.#puzzlePiecesBox.hasAttribute("style")) {
            Puzzle.#puzzlePiecesBox.removeAttribute("style");
        }

        Puzzle.#puzzlePiecesBox.classList.add("addBorder");
        Puzzle.#puzzlePiecesBox.addEventListener("dragover", Puzzle.#puzzlePieceAllowDrop);
        Puzzle.#puzzlePiecesBox.addEventListener("drop", Puzzle.#puzzlePieceDrop); 
    }

    #divideBoard() {
        Puzzle.#puzzleBoard.innerHTML = '';

        Puzzle.#puzzleBoard.classList.add("game-on");

        Puzzle.#puzzleBoard.setAttribute("style",`width:${this.#imageWidth+2}px;height:${this.#imageHeight+2}px`);

        const width = (this.#imageWidth / Puzzle.#piecesAmount);
        const height = (this.#imageHeight / Puzzle.#piecesAmount);

        for (let i = 0; i < Puzzle.#piecesAmount; i++) {
            for (let j = 0; j < Puzzle.#piecesAmount; j++) {

                const boardPiece = document.createElement("div");
                boardPiece.setAttribute("style",`width:${width}px;height:${height}px`);
                boardPiece.classList.add("game-on");
                boardPiece.addEventListener("dragover", Puzzle.#puzzlePieceAllowDrop);
                boardPiece.addEventListener("drop", Puzzle.#puzzlePieceDrop, false);


                Puzzle.#puzzleBoard.appendChild(boardPiece);
            }
        }
    }

    static #showImage() {
        Puzzle.#puzzleBoard.innerHTML = "";
        Puzzle.#puzzleBoard.appendChild(this.#puzzleImage);
    }

    static #informAboutWin() {
        if (Notification.permission !== "denied") {
            let notification = new Notification('Congratulations', { body: "You have completed the puzzle!"});
        }
    }

    static #disableDrag() {
        const temp = Puzzle.#puzzleBoard.querySelectorAll("img");

        for (let i = 0; i < temp.length; i++) {
            temp[i].draggable = false;
        }
    }

    static #deleteBorders() {
        Puzzle.#puzzlePiecesBox.classList.remove("addBorder");
        Puzzle.#puzzleBoard.classList.remove("game-on");

        const temp = Puzzle.#puzzleBoard.querySelectorAll("div");

        for (let i = 0; i < temp.length; i++) {
            temp[i].classList.remove("game-on");
        }
    }

    static #validation() {
        const temp = Puzzle.#puzzleBoard.querySelectorAll("img");
        let count = 0;

        for (let i = 0; i < temp.length; i++) {
            if(temp[i].id == ("img"+i)) count++;
            else break;
        }

        if(count == Puzzle.#piecesAmount**2) 
        {
            Puzzle.#disableDrag();
            Puzzle.#informAboutWin();
            Puzzle.#deleteBorders();
            Puzzle.#showImage();
        }
    }

    static #checkIfPiecesBoxEmpty() {
        return (!Puzzle.#puzzlePiecesBox.querySelector("img") ? true : false);
    }

    static #puzzlePieceDrag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }

    static #puzzlePieceAllowDrop(ev) {
        ev.preventDefault();
    }

    static #puzzlePieceDrop(ev) {
        ev.preventDefault();
        const data = ev.dataTransfer.getData("text");
        if ( ev.target.nodeName !== "IMG" ) {
            ev.target.appendChild(document.getElementById(data));
        }

        if(Puzzle.#checkIfPiecesBoxEmpty()) {
            Puzzle.#puzzlePiecesBox.setAttribute("style","height:100px");
            Puzzle.#validation();
        } 
        else {
            Puzzle.#puzzlePiecesBox.removeAttribute("style");
        }
    }
}


function setMap(latitude, longitude, message = "Default location!") {
    map.setView([latitude, longitude], 13, { "animate": false });

    if (!isLayerSet) {
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        isLayerSet = true;
    }

    marker = L.marker([latitude, longitude]).bindPopup(message).addTo(map);
}

function askPermisions() {
    geolocationPermision();
    notificationPermision();
}

function geolocationPermision() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
    } else {
        navigator.geolocation.getCurrentPosition((position) => {

            newLatitude = position.coords.latitude;
            newLongitude = position.coords.longitude;

        }, () => { myLocation.disabled = true; });
    }
}

function notificationPermision() {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
    }
}

function getImageUrl(err, canvas) {
    imgToPlay.src = canvas.toDataURL();
};



const latitude = document.getElementById("latitude");
const longitude = document.getElementById("longitude");
const myLocation = document.getElementById("myLocation");
const startGame = document.getElementById("startPuzzle");
const puzzleBoard = document.getElementById("puzzle-board");
const puzzlePiecesBox = document.getElementById("puzzle-pieces");
const mapCont = document.getElementById("map");

const map = L.map(mapCont);
var marker;
let isLayerSet = false;
setMap(latitude.innerText, longitude.innerText);

askPermisions();

var newLatitude, newLongitude;

const imgToPlay = document.createElement('img');
const dimensions = map.getSize();
imgToPlay.width = dimensions.x;
imgToPlay.height = dimensions.y;


myLocation.addEventListener("click", () => {
    map.removeLayer(marker);
    setMap(newLatitude, newLongitude, "Your location!");

    latitude.innerHTML = newLatitude;
    longitude.innerHTML = newLongitude;
});


startGame.addEventListener("click", () => {
    leafletImage(map, getImageUrl);
    setTimeout(() => {
        const puzzleGame = new Puzzle(puzzlePiecesBox, imgToPlay, puzzleBoard, 4);
        puzzleGame.startGame();
    }, "2200");
});
