import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { NamePipe } from './name-pipe/name-pipe.pipe'
import { PrefixPlusPipe } from './prefix-plus-pipe/prefix-plus.pipe'
import { MaskedPhonePipe } from './masked-phone/masked-phone.pipe'
import { MaskedEmailPipe } from './masked-email/masked-email.pipe'
import { AvatarPipe } from './avatar.pipe'

@NgModule({
    declarations: [
        NamePipe,
        PrefixPlusPipe,
        MaskedPhonePipe,
        MaskedEmailPipe,
        AvatarPipe,
    ],
    exports: [
        PrefixPlusPipe,
        NamePipe,
        MaskedPhonePipe,
        MaskedEmailPipe,
        AvatarPipe,
    ],
    imports: [CommonModule],
})
export class PipesModule {}
