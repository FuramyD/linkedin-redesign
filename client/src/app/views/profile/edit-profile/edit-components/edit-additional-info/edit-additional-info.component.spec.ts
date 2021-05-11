import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EditAdditionalInfoComponent } from './edit-additional-info.component'

describe('EditAdditionalInfoComponent', () => {
    let component: EditAdditionalInfoComponent
    let fixture: ComponentFixture<EditAdditionalInfoComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditAdditionalInfoComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(EditAdditionalInfoComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
