'use strict'

const LASER_SPEED = 80
const SUPER_LASER_SPEED = 30

var gHero
var gShootInterval
var gIsLaserSuper
var gIsSuperShotLeft
var gIsLaserNegs

// creates the hero and place it on board
function createHero(board) {
    gHero = {
        pos: {
            i: 12,
            j: 7
        },
        isShoot: false
    }
    board[gHero.pos.i][gHero.pos.j].gameObject = HERO
}

// Move the hero right (1) or left (-1)
function moveHero(ev) {
    if (!gGame.isOn) return
    const currPos = { i: gHero.pos.i, j: gHero.pos.j }
    const nextPos = getHeroNextPos(ev)
    if (nextPos.j < 0 || nextPos.j >= gBoard[0].length) return

    updateCell(currPos)
    updateCell(nextPos, HERO)
    gHero.pos = nextPos
}

function getHeroNextPos(ev) {
    const nextPos = {
        i: gHero.pos.i,
        j: gHero.pos.j
    }

    switch (ev.code) {
        case 'ArrowRight':
            nextPos.j++
            break;
        case 'ArrowLeft':
            nextPos.j--
            break;
    }
    return nextPos
}

// Handle game keys
function onKeyDown(ev) {
    if (ev.code === 'ArrowLeft' ||
        ev.code === 'ArrowRight') moveHero(ev)
    else if (ev.code === 'Space') {
        gIsLaserNegs = false
        gIsLaserSuper = false
        shoot()
    }
    else if (ev.code === 'KeyX') {
        if (!gIsSuperShotLeft) return
        gIsLaserNegs = false
        gIsLaserSuper = true
        shoot()
        updateSuperShotLeft()
    }
    else if (ev.code === 'KeyN') {
        gIsLaserSuper = false
        gIsLaserNegs = true
        shoot()
    }
}

// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot() {
    if (gHero.isShoot || !gGame.isOn) return
    gHero.isShoot = true
    var laserPos = {
        i: gHero.pos.i - 1,
        j: gHero.pos.j
    }
    var currLaserSpeed = (gIsLaserSuper) ? SUPER_LASER_SPEED : LASER_SPEED
    gShootInterval = setInterval(blinkLaser, currLaserSpeed, laserPos)



}

// renders a LASER at specific cell for short time and removes it
function blinkLaser(pos) {
    var nextPos = { i: pos.i - 1, j: pos.j }

    if (gBoard[nextPos.i][nextPos.j].gameObject === ALIEN) {
        handleAlienHit(pos, nextPos)
        return
    } else if (nextPos.i <= 0) return stopLaser(pos, nextPos)

    updateCell(pos)
    var currLaser
    if (gIsLaserNegs) currLaser = NEGS_LASER
    else if (gIsLaserSuper) currLaser = SUPER_LASER
    else currLaser = LASER
    updateCell(nextPos, currLaser)
    pos.i--
}

function stopLaser(pos, nextPos) {
    clearInterval(gShootInterval)
    gHero.isShoot = false
    updateCell(pos)
    updateCell(nextPos)
}

function updateSuperShotLeft() {
    gIsSuperShotLeft--
}
