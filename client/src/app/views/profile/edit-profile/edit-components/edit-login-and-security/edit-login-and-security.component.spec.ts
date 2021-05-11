import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EditLoginAndSecurityComponent } from './edit-login-and-security.component'

describe('EditLoginAndSecurityComponent', () => {
    let component: EditLoginAndSecurityComponent
    let fixture: ComponentFixture<EditLoginAndSecurityComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditLoginAndSecurityComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(EditLoginAndSecurityComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
