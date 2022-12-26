import fs from 'fs'
import fastCSV from 'fast-csv'
import { FORMAT_TYPE } from '../../infrastructure/variables/fileTypes'

class FileWriterFactory {
  private static _instance: FileWriterFactory
  static get instance(): FileWriterFactory {
    if (!this._instance) {
      this._instance = new FileWriterFactory()
    }
    return this.instance
  }

  getFileWriter(fileType: string) {
    if (fileType === FORMAT_TYPE.JSON) {
      return this.writeJSONFile
    } else {
      return this.writeCSVFile
    }
  }

  private writeJSONFile(filePath: string, data: any) {
    const stringifiedRecords = JSON.stringify(data)
    fs.writeFile(filePath, stringifiedRecords, (err) => {
      if (err) {
        throw err
      }
      console.log('Exported!')
    })
  }

  private writeCSVFile(filePath: string, data: any) {
    const writeStream = fs.createWriteStream(filePath)
    fastCSV.write(data, { headers: true }).pipe(writeStream)
  }
}

export default FileWriterFactory
