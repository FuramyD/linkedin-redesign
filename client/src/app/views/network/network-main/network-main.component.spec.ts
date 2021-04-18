import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NetworkMainComponent } from './network-main.component'

describe('NetworkMainComponent', () => {
    let component: NetworkMainComponent
    let fixture: ComponentFixture<NetworkMainComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NetworkMainComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(NetworkMainComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
