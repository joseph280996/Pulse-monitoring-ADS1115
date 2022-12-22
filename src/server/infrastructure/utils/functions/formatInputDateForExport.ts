import moment from 'moment'

export default (startDate: string, endDate: string) => ({
  formattedStartDate: moment(startDate).format('DD-MM-YYYY'),
  formattedEndDate: moment(endDate).format('DD-MM-YYYY'),
})
