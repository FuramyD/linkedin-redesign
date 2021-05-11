import { IFile } from './file'

export interface IUniversity {
    name: string
    facultyAndDegree: string
    comment: string
    start: string
    end: string
    logo?: (IFile & { file: File }) | null
}
