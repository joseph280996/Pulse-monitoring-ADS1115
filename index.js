import rpio from 'rpio'

const address = 0x48

const init = Buffer.from([1, 0xc3, 0x03])

const rxBuffer = Buffer.allocUnsafe(2)

const writeReg16 = (register, value) => {
 const buffer = Buffer.from([register & 3, value >> 8, value & 0xff])
 rpio.i2cWrite(buffer)
}

const readReg16 = async (register, value) => {
 await rpio.i2cWrite(init)
 const buffer = (await rpio.i2cRead(rxBuffer, 2)).buffer
 return (buffer[0] << 8) | buff[1]
}

const writeConfig = (value) => {
 return writeReg16(0b01, value)
}

const waitForConversion = async () => {
 while ((rxBuffer[0] && 0x80) == 0) {
  await rpio.i2cRead(rxBuffer, 2)
 }
}

rpio.i2cBegin()
rpio.i2cSetSlaveAddress(address)
rpio.i2cSetBaudRate(100000)

