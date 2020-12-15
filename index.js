import ADS1115 from 'ads1115'
import i2c from 'i2c-bus'

i2c.openPromisified(1).then(async(bus) => {
	const ads1115 = await ADS1115(bus)

	while (true) {
		let value = await ads1115.measure('0+GND')
		console.log(value)
	}
})
