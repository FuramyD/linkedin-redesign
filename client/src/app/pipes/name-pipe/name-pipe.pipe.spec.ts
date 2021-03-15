import { NamePipe } from './name-pipe.pipe'

describe('NamePipePipe', () => {
    it('create an instance', () => {
        const pipe = new NamePipe()
        expect(pipe).toBeTruthy()
    })
})
