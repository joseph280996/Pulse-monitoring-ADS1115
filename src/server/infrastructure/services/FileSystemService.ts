import path from 'path'
import fs from 'fs'
import os from 'os'
import { WriteToFileConfigType } from './FileSystemService.types'
import FileWriterFactory from '../../domain/factories/fileWriterFactory'

class FileSystemService<T> {
  //#region Properties
  private readonly fileWriterFactory: FileWriterFactory
  private filePath!: string
  //#endregion

  //#region Constructor
  constructor(
    fileName: string,
    rootPath: string = path.join(os.homedir(), 'Desktop'),
  ) {
    this.fileWriterFactory = FileWriterFactory.instance
    this.createIfNotExistFolder(path.join(rootPath, 'exported-data'))
    this.filePath = path.join(rootPath, 'exported-data', `${fileName}.json`)
  }
  //#endregion

  //#region Public Methods
  async write(data: T, { formatType }: WriteToFileConfigType): Promise<void> {
    const fileWriter = this.fileWriterFactory.getFileWriter(formatType)
    fileWriter(this.filePath, data)
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
  //#endregion
}

export default FileSystemService
