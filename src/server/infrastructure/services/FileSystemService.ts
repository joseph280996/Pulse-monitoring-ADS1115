import path from 'path';
import fs from 'fs';
import os from 'os';
import { WriteToFileConfigType } from './FileSystemService.types';
import FileWriterFactory from 'src/server/domain/factories/fileWriterFactory';

class FileSystemService<T> {
	private filePath!: string;

	constructor(
		fileName: string,
		rootPath: string = path.join(os.homedir(), 'Desktop'),
	) {
		this.createIfNotExistFolder(path.join(rootPath, 'exported-data'));
		this.filePath = path.join(rootPath, 'exported-data', `${fileName}.json`);
	}

	async write(data: T, { formatType }: WriteToFileConfigType): Promise<void> {
		const fileWriter = FileWriterFactory.getFileWriter(formatType);
		fileWriter(this.filePath, data);
	}

	private async createIfNotExistFolder(containFolder: string): Promise<void> {
		if (!fs.existsSync(containFolder)) {
			fs.mkdirSync(containFolder, {
				recursive: true,
			});
		}
	}
}

export default FileSystemService
