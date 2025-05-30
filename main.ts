function updateHeartLeds () {
    strip.showColor(neopixel.rgb(currentBrightness, 0, 0))
    wuKong.lightIntensity(currentBrightness)
    strip.show()
    if (currentBrightness > 0) {
        currentBrightness += 0 - dropRate
    } else {
        currentBrightness = 255
        if (dropRate == 5) {
            dropRate = 10
        } else {
            dropRate = 5
        }
    }
    led.plotBarGraph(
    currentBrightness,
    255
    )
}
input.onButtonPressed(Button.A, function () {
    doorState = true
})
function moveDoor () {
    if (doorState) {
        currentDoorPos += 1
        if (currentDoorPos > maxDoorPos) {
            currentDoorPos = maxDoorPos
        } else {
            wuKong.setServoAngle(wuKong.ServoTypeList._180, wuKong.ServoList.S0, currentDoorPos)
            pins.servoWritePin(AnalogPin.P8, currentDoorPos)
        }
    } else {
        currentDoorPos += -1
        if (currentDoorPos < 0) {
            currentDoorPos = 0
        } else {
            wuKong.setServoAngle(wuKong.ServoTypeList._180, wuKong.ServoList.S0, currentDoorPos)
            pins.servoWritePin(AnalogPin.P8, currentDoorPos)
        }
    }
    console.log(currentDoorPos)
}
input.onButtonPressed(Button.B, function () {
    doorState = false
})
let currentButtonState = 0
let doorState = false
let maxDoorPos = 0
let currentBrightness = 0
let dropRate = 0
let strip: neopixel.Strip = null
strip = neopixel.create(DigitalPin.P1, 24, NeoPixelMode.RGB)
let currentDoorPos = 0
dropRate = 1
let heartRate = 15
currentBrightness = 100
pins.setPull(DigitalPin.P2, PinPullMode.PullUp)
let oldButtonState = 1
maxDoorPos = 100
loops.everyInterval(0, function () {
    updateHeartLeds()
    basic.pause(heartRate)
})
basic.forever(function () {
    currentButtonState = pins.digitalReadPin(DigitalPin.P2)
    if (currentButtonState == 0 && oldButtonState == 1) {
        doorState = !(doorState)
        basic.pause(100)
    }
    oldButtonState = currentButtonState
    moveDoor()
})
