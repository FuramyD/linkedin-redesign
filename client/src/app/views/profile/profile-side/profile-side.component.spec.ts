import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfileSideComponent } from './profile-side.component'

describe('ProfileSideComponent', () => {
    let component: ProfileSideComponent
    let fixture: ComponentFixture<ProfileSideComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProfileSideComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfileSideComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
