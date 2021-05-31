import { IFile } from './file'

export interface IProject {
    name: string
    role: string
    date: string
    about: string
    poster: (IFile & { file: File }) | null
}
