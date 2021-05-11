import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { VarDirective } from './var.directive'

@NgModule({
    declarations: [VarDirective],
    imports: [CommonModule],
    exports: [VarDirective],
})
export class DirectivesModule {}
