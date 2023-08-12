import path from 'path'
import fs from 'fs'
import os from 'os'
import fastCSV from 'fast-csv'
import { WriteToFileConfigType } from './FileSystemService.types'
import { FORMAT_TYPE } from '../variables/fileTypes';

class FileSystemService<T> {
  //#region Properties
  private filePath!: string
  //#endregion

  //#region Constructor
  constructor(
    fileName: string,
    rootPath: string = path.join(os.homedir(), 'Desktop'),
  ) {
    this.createIfNotExistFolder(path.join(rootPath, 'exported-data'))
    this.filePath = path.join(rootPath, 'exported-data', `${fileName}.json`)
  }
  //#endregion

  //#region Public Methods
  async write(data: T, { formatType }: WriteToFileConfigType): Promise<void> {
    if (formatType === FORMAT_TYPE.JSON) {
      this.writeJSONFile(this.filePath, data)
    } else {
      this.writeCSVFile(this.filePath, data)
    }
  }
  //#endregion

  //#region Private Methods
  private async createIfNotExistFolder(containFolder: string): Promise<void> {
    if (!fs.existsSync(containFolder)) {
      fs.mkdirSync(containFolder, {
        recursive: true,
      })
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
  //#endregion
}

export default FileSystemService
