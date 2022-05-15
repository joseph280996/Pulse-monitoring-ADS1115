import Patient from '../server/models/Patient'
import User from '../server/models/User'

console.log('potato')
try {
  Patient.getAll().then((allPatients) => {
    console.log(allPatients)
    allPatients.map(({ name, id: patientID }: any) => {
      const user = new User({ firstName: name, password: 'password' })
      const createdUser = user.save()
      return {
        patientID,
        ...createdUser,
      }
    })
  })
} catch (err) {
  console.log(err)
}
