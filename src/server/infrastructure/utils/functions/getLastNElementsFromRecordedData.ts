import Record from "src/server/domain/models/Record";

export default (store: Record[], num: number) => store.slice(-num)
