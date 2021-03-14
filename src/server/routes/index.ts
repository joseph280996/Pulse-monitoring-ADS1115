import PulseTypes from '../model/PulseTypes'

export type RouteType = {
  method: string
  route: string
  handler: (param?: any) => any
}
export default [
  {
    method: 'get',
    route: '/pulse-type',
    handler: async () => {
      const pulseTypes = await PulseTypes.loadAll()
      return pulseTypes
    },
  },
] as RouteType[]
