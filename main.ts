function updateHeartLeds () {
    if (currentBrightness > -50) {
        currentBrightness += 0 - dropRate
    } else {
        currentBrightness = 255
        if (dropRate == 5) {
            dropRate = 10
        } else {
            dropRate = 5
        }
    }

    if(currentBrightness<0){
        actualLedBrightness = 0;
    } else {
        actualLedBrightness = currentBrightness;
    }

    led.plotBarGraph(
    actualLedBrightness,
    255
    )
    strip.showColor(neopixel.rgb(actualLedBrightness, 0, 0))
    strip.show()
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
radio.onReceivedValue(function (name, value) {
    if (name == "open") {
        doorState = true
    } else if (name == "close") {
        doorState = false
    }
})
let currentButtonState = 0
let doorState = false
let maxDoorPos = 0
let currentBrightness = 0
let dropRate = 0
let strip: neopixel.Strip = null
let actualLedBrightness = 0
let currentDoorPos = 0
radio.setGroup(101)
wuKong.setLightMode(wuKong.LightMode.OFF)
strip = neopixel.create(DigitalPin.P1, 52, NeoPixelMode.RGB)
dropRate = 5
let heartRate = 10
currentBrightness = 100
pins.setPull(DigitalPin.P2, PinPullMode.PullUp)
let oldButtonState = 1
maxDoorPos = 100


control.inBackground(function () {
    while (true) {
        if (currentDoorPos > 0) {
            updateHeartLeds()
            lightsOn = true
        } else if (lightsOn) {
            strip.clear()
            strip.show()
            lightsOn = false
        }
        basic.pause(heartRate)
    }
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
let lightsOn = true