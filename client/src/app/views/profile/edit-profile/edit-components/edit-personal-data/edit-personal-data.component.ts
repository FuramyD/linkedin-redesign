import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ProfileService } from '../../../../../services/profile.service'
import { IBuffer } from '../../../../../interfaces/buffer'

@Component({
    selector: 'app-edit-personal-data',
    templateUrl: './edit-personal-data.component.html',
    styleUrls: ['./edit-personal-data.component.less'],
})
export class EditPersonalDataComponent implements OnInit, OnChanges {
    constructor() {}

    @Input() firstName: string = ''
    @Input() lastName: string = ''
    @Input() DOB: number = 0
    @Input() gender: string = ''
    @Input() avatar: string | IBuffer = ''
    @Input() editStatus: { status: string; message: string } | null = null

    @Output() saveChanges = new EventEmitter()
    @Output() changeAvatar = new EventEmitter()

    editProfileDataForm = new FormGroup({
        firstName: new FormControl(this.firstName, [
            Validators.required,
            Validators.minLength(2),
        ]),
        lastName: new FormControl(this.lastName, [Validators.required]),
        dateOfBirth: new FormControl(
            new Date(this.DOB).toJSON().split('T')[0],
            [Validators.required],
        ),
    })

    selectedGender: string = ''
    genderIsRequiredError: boolean = false

    changeAvatarMenu: HTMLElement | null = null

    toggleChangeAvatarMenu(menu: HTMLElement): void {
        menu.classList.toggle('transparent')
        menu.classList.toggle('hidden')

        this.changeAvatarMenu = menu
    }

    hideChangeAvatarMenu(menu: HTMLElement): void {
        menu.classList.add('transparent')
        menu.classList.add('hidden')
    }

    selectOnChange(option: string): void {
        this.selectedGender = option
    }

    changeAvatarHandler(e: Event): void {
        const target = e.target as HTMLInputElement
        const files = target.files as FileList

        this.changeAvatar.emit({ type: 'change', file: files.item(0) })

        target.value = ''
        if (this.changeAvatarMenu)
            this.toggleChangeAvatarMenu(this.changeAvatarMenu)
    }

    deleteAvatarHandler(): void {
        this.changeAvatar.emit({ type: 'delete' })
        if (this.changeAvatarMenu)
            this.toggleChangeAvatarMenu(this.changeAvatarMenu)
    }

    onSubmit(): void {
        if (this.selectedGender === 'Indicate your gender') {
            this.genderIsRequiredError = true
            return
        }
        this.genderIsRequiredError = false
        if (this.editProfileDataForm.valid) {
            this.saveChanges.emit({
                ...this.editProfileDataForm.value,
                gender: this.selectedGender.trim(),
            })
        }
    }

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes.hasOwnProperty('firstName') &&
            changes.hasOwnProperty('lastName') &&
            changes.hasOwnProperty('DOB')
        ) {
            this.editProfileDataForm.setValue({
                firstName: changes.firstName.currentValue,
                lastName: changes.lastName.currentValue,
                dateOfBirth: new Date(changes.DOB.currentValue)
                    .toJSON()
                    .split('T')[0],
            })
        }
    }
}
