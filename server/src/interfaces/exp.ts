import { IFile } from './file'

export interface IExp {
    companyName: string
    profession: string
    start: string
    end: string
    logo?: (IFile & { file: File }) | null
}
