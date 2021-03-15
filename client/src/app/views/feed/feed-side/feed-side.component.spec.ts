import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FeedSideComponent } from './feed-side.component'

describe('FeedSideComponent', () => {
    let component: FeedSideComponent
    let fixture: ComponentFixture<FeedSideComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FeedSideComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(FeedSideComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
