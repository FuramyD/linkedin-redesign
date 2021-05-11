import { IFile } from './file'

export interface IProject {
    name: string | null
    role: string | null
    date: string | null
    about: string | null
    poster: (IFile & { file: File }) | null
}
