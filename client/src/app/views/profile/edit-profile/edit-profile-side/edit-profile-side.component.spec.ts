import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EditProfileSideComponent } from './edit-profile-side.component'

describe('EditProfileSideComponent', () => {
    let component: EditProfileSideComponent
    let fixture: ComponentFixture<EditProfileSideComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditProfileSideComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(EditProfileSideComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
