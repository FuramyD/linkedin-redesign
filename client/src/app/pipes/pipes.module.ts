import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { NamePipe } from './name-pipe/name-pipe.pipe'
import { PrefixPlusPipe } from './prefix-plus-pipe/prefix-plus.pipe'

@NgModule({
    declarations: [NamePipe, PrefixPlusPipe],
    exports: [PrefixPlusPipe, NamePipe],
    imports: [CommonModule],
})
export class PipesModule {}
