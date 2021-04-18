import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NetworkSideComponent } from './network-side.component'

describe('NetworkSideComponent', () => {
    let component: NetworkSideComponent
    let fixture: ComponentFixture<NetworkSideComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NetworkSideComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(NetworkSideComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
