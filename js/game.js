'use strict'

const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 3
const HERO = '🥷';
const ALIEN = '🕊️';
const LASER = '☄️';
const SUPER_LASER = '⚡'
const NEGS_LASER = '💥'
const SKY = 'SKY'
// const CANDY = '🍬'


// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN}
var gBoard
var gGame
// var gSpawnCandyInt
// Called when game loads
function init() {
    // if (gSpawnCandyInt) clearInterval(gSpawnCandyInt)
    hideStartBtn()
    hideInstructions()
    gAliensTopRowIdx = 0
    gAliensBottomRowIdx = 2
    gAliensLeftColIdx = 0
    gAliensRightColIdx = 8
    gIsSuperShotLeft = 3
    gIsLaserNegs = false
    gIsLaserSuper = false
    closeModal()
    gGame = {
        score: 0,
        isOn: true,
        isVictory: false,
        aliensCount: 0
    }
    gBoard = createBoard()
    createHero(gBoard)
    createAliens(gBoard)
    renderBoard(gBoard)
    // gSpawnCandyInt = setInterval(spawnCandy, 10000)
    clearInterval(gIntervalAliens)
    gIntervalAliens = null
    moveAliens()
    const elScore = document.querySelector('h2 span')
    elScore.innerText = gGame.score
}

// Create and returns the board with aliens on top, ground at bottom
// use the functions: createCell, createHero, createAliens
function createBoard() {
    var board = []
    for (var i = 0; i < BOARD_SIZE; i++) {
        board[i] = []
        for (var j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = {
                type: SKY,
                gameObject: null
            }
        }
    }
    return board
}

// Render the board as a <table> to the page
function renderBoard(board) {
    var strHTML = '<table><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`
        for (var j = 0; j < board[0].length; j++) {
            const cell = !board[i][j].gameObject ? '' : board[i][j].gameObject

            strHTML += `<td title="{i : ${i}, j : ${j}}" data-i="${i}"data-j="${j}"">${cell}</td>`
        }
        strHTML += `</tr>`
    }
    strHTML += `</tbody></table>`

    const elGameContainer = document.querySelector('.game-container')
    elGameContainer.innerHTML = strHTML
}

// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(gameObject = null) {
    return {
        type: SKY,
        gameObject: gameObject
    }
}

// position such as: {i: 2, j: 7}
function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject
    var elCell = getElCell(pos)
    elCell.innerHTML = gameObject || ''
}

function updateScore(diff) {
    gGame.score += diff
    document.querySelector('h2 span').innerText = gGame.score
}

function checkVictory() {
    if (!gGame.aliensCount) {
        gGame.isVictory = true
        gameOver()
    }
}

function gameOver() {
    clearInterval(gIntervalAliens)
    gGame.isOn = false
    var msg = gGame.isVictory ? 'You Won!!' : 'You Lost!!'
    openModal(msg)
}

function openModal(msg) {
    const elModal = document.querySelector('.modal')
    const elSpan = elModal.querySelector('.msg')
    elSpan.innerText = msg
    elModal.style.display = 'block'
}

function closeModal() {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
}

function hideStartBtn() {
    const elStartBtn = document.querySelector('.btn-start')
    elStartBtn.style.display = 'none'
}

function hideInstructions() {
    const elInstructions = document.querySelector('.instructions')
    elInstructions.style.display = 'none'
}

