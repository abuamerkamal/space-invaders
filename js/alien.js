'use strict'

const ALIEN_SPEED = 500
var gIntervalAliens
// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row
var gAliensTopRowIdx
var gAliensBottomRowIdx

var gIsAlienFreeze = true

var gAliensLeftColIdx
var gAliensRightColIdx



function createAliens(board) {
    for (var i = 0; i < ALIENS_ROW_COUNT; i++) {
        for (var j = 0; j < ALIENS_ROW_LENGTH; j++) {
            board[i][j].gameObject = ALIEN
            gGame.aliensCount++
        }
    }
}

function handleAlienHit(pos, nextPos) {
    if (gIsLaserNegs) handleAlienNegsHit(nextPos, gBoard)
    stopLaser(pos, nextPos)
    updateScore(10)
    gGame.aliensCount--
    checkVictory()
}

function handleAlienNegsHit(pos, board) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (i === pos.i && j === pos.j) continue
            if (j < 0 || j >= board[0].length) continue
            if (board[i][j].gameObject === ALIEN) {
                updateCell({ i: i, j: j })
                gGame.aliensCount--
                updateScore(10)
            }
        }
    }
}

function shiftBoardRight(board, fromJ, toJ) {
    const newBoard = createCopyBoard(board)
    const emptyCell = createCell()

    for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
        for (var j = fromJ; j < toJ; j++) {
            if (board[i][j].gameObject === LASER ||
                board[i][j].gameObject === SUPER_LASER ||
                board[i][j].gameObject === NEGS_LASER) {
                return
            }
            if (j === board[0].length - 1) {
                shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
                clearInterval(gIntervalAliens)
                gIntervalAliens = setInterval(() => {
                    if (!gGame.isOn) return
                    shiftBoardLeft(gBoard, gAliensRightColIdx, gAliensLeftColIdx)
                }, ALIEN_SPEED)
                return
            }
            newBoard[i][j + 1] = board[i][j]
            newBoard[i][fromJ] = emptyCell
        }
    }
    gAliensLeftColIdx++
    gAliensRightColIdx++
    gBoard = newBoard
    renderBoard(newBoard)
}

function shiftBoardLeft(board, fromJ, toJ) {
    const newBoard = createCopyBoard(board)
    const emptyCell = createCell()
    fromJ = fromJ - 1
    toJ = toJ - 1
    for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
        for (var j = fromJ; j > toJ; j--) {
            if (board[i][j].gameObject === LASER ||
                board[i][j].gameObject === SUPER_LASER ||
                board[i][j].gameObject === NEGS_LASER) {
                return
            }
            if (j === 0) {
                shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
                clearInterval(gIntervalAliens)
                gIntervalAliens = setInterval(() => {
                    if (!gGame.isOn) return
                    shiftBoardRight(gBoard, gAliensLeftColIdx, gAliensRightColIdx)
                }, ALIEN_SPEED)
                return
            }
            newBoard[i][j - 1] = board[i][j]
            newBoard[i][fromJ] = emptyCell
        }
    }

    gAliensLeftColIdx--
    gAliensRightColIdx--
    gBoard = newBoard
    renderBoard(newBoard)
}

function shiftBoardDown(board, fromI, toI) {
    const newBoard = createCopyBoard(board)
    const emptyCell = createCell()

    for (var i = fromI; i <= toI; i++) {
        for (var j = gAliensLeftColIdx; j < gAliensRightColIdx; j++) {
            if (board[i][j].gameObject === LASER ||
                board[i][j].gameObject === SUPER_LASER ||
                board[i][j].gameObject === NEGS_LASER) {
                return
            }
            if (gAliensBottomRowIdx === gHero.pos.i - 1) return gameOver()
            newBoard[i + 1][j] = board[i][j]
            newBoard[gAliensTopRowIdx][j] = emptyCell
        }
    }

    gAliensTopRowIdx++
    gAliensBottomRowIdx++
    gBoard = newBoard
    renderBoard(newBoard)
}

// Runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops

function moveAliens() {
    gIntervalAliens = setInterval(() => {
        shiftBoardRight(gBoard, gAliensLeftColIdx, gAliensRightColIdx)
    }, ALIEN_SPEED)

}
