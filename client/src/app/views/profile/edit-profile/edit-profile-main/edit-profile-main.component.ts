import { Component, Input, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { map, take, takeUntil } from 'rxjs/operators'
import {
    myProfileAboutSelector,
    myProfileAvatarSelector,
    myProfileContactInfoSelector,
    myProfileDateOfLastPasswordUpdateSelector,
    myProfileDOBSelector,
    myProfileEducationSelector,
    myProfileEmailSelector,
    myProfileExperienceSelector,
    myProfileGenderSelector,
    myProfileIdSelector,
    myProfileLocalitySelector,
    myProfileNameSelector,
    myProfilePhoneSelector,
    myProfileProfessionSelector,
    myProfileProjectsSelector,
    myProfileRoleSelector,
} from '../../../../store/my-profile/my-profile.selectors'
import { MyProfileState } from '../../../../store/my-profile/my-profile.reducer'
import { ProfileService } from '../../../../services/profile.service'
import { IPersonalInfo } from '../../../../interfaces/edit-profile/personalInfo'
import {
    MyProfileChangeAboutAction,
    MyProfileChangeAvatarSuccessAction,
    MyProfileChangeContactInfoAction,
    MyProfileChangeEducationAction,
    MyProfileChangeExperienceAction,
    MyProfileChangeLocalityAction,
    MyProfileChangeProfessionAction,
    MyProfileChangeProjectsAction,
    MyProfileChangeRoleAction,
    MyProfileDeleteAvatarSuccessAction,
} from '../../../../store/my-profile/my-profile.actions'
import { IContact } from '../../../../interfaces/contact'
import { IProject } from '../../../../interfaces/project'
import { IUniversity } from '../../../../interfaces/university'
import { IExp } from '../../../../interfaces/exp'

@Component({
    selector: 'app-edit-profile-main',
    templateUrl: './edit-profile-main.component.html',
    styleUrls: ['./edit-profile-main.component.less'],
})
export class EditProfileMainComponent implements OnInit {
    constructor(
        private store$: Store<MyProfileState>,
        private profileService: ProfileService,
    ) {}

    @Input() currentTab: string = ''

    profileId: number = -1

    firstName$: Observable<string> = this.store$.pipe(
        select(myProfileNameSelector),
        map(fullName => {
            console.log(fullName)
            return fullName.firstName
        })
    )

    lastName$: Observable<string> = this.store$.pipe(
        select(myProfileNameSelector),
        map(fullName => fullName.lastName),
    )

    dateOfBirth$: Observable<number> = this.store$.pipe(
        select(myProfileDOBSelector),
    )

    gender$: Observable<string> = this.store$.pipe(
        select(myProfileGenderSelector),
    )

    avatar$: Observable<string> = this.store$.pipe(
        select(myProfileAvatarSelector),
    )

    email$: Observable<string> = this.store$.pipe(
        select(myProfileEmailSelector),
    )

    phone$: Observable<string> = this.store$.pipe(
        select(myProfilePhoneSelector),
    )

    dateOfLastPasswordUpdate$: Observable<number> = this.store$.pipe(
        select(myProfileDateOfLastPasswordUpdateSelector),
    )

    profileId$: Observable<number> = this.store$.pipe(
        select(myProfileIdSelector),
        take(2),
    )

    role$: Observable<string> = this.store$.pipe(select(myProfileRoleSelector))

    about$: Observable<string> = this.store$.pipe(
        select(myProfileAboutSelector),
    )

    profession$: Observable<string> = this.store$.pipe(
        select(myProfileProfessionSelector),
    )

    contactInfo$: Observable<IContact[]> = this.store$.pipe(
        select(myProfileContactInfoSelector),
        map(contacts => {
            if (!contacts[0]) return [{ contactWay: '', data: '' }]
            return contacts
        }),
    )
    // @ts-ignore
    locality$: Observable<{ country: string; city: string }>

    projects$: Observable<IProject[]> = this.store$.pipe(
        select(myProfileProjectsSelector),
        map(projects => {
            if (!projects[0])
                return [
                    { name: '', role: '', date: '', about: '', poster: null },
                ]
            return projects
        }),
    )

    experience$: Observable<IExp[]> = this.store$.pipe(
        select(myProfileExperienceSelector),
        map(experience => {
            if (!experience[0])
                return [
                    {
                        companyName: '',
                        profession: '',
                        start: '',
                        end: '',
                        logo: null,
                    },
                ]
            return experience
        }),
    )

    education$: Observable<IUniversity[]> = this.store$.pipe(
        select(myProfileEducationSelector),
        map(education => {
            if (!education[0])
                return [
                    {
                        name: '',
                        facultyAndDegree: '',
                        comment: '',
                        start: '',
                        end: '',
                        logo: null,
                    },
                ]
            return education
        }),
    )

    editPersonalInfoStatus: { status: string; message: string } | null = null

    editPersonalInfo(info: IPersonalInfo): void {
        const [year, month, day] = (info.dateOfBirth as string).split('-')
        console.log(day)
        this.profileService
            .editPersonalInfo(
                {
                    ...info,
                    dateOfBirth: Number(
                        new Date(
                            Number(year),
                            Number(month) - 1,
                            Number(day) + 1,
                        ),
                    ),
                },
                this.profileId,
            )
            .subscribe(res => {
                if (res.status === 'changed') {
                    this.editPersonalInfoStatus = {
                        status: 'success',
                        message: 'Personal information has been changed',
                    }
                }
                if (res.status === 'not found')
                    this.editPersonalInfoStatus = {
                        status: 'fail',
                        message: 'User is not found, try reloading this page',
                    }
            })
    }

    changeAvatarHandler(data: { type: string; file: File }): void {
        if (data.type === 'change') this.changeAvatar(data.file)

        if (data.type === 'delete') this.deleteAvatar()
    }

    changeAvatar(file: File): void {
        this.profileService.changeAvatar(file, this.profileId).subscribe(
            res => {
                console.log(res)
                // console.log(res.message)
                this.store$.dispatch(
                    new MyProfileChangeAvatarSuccessAction({ url: res.url }),
                )
            },
            err => {
                console.error(err.message)
            },
        )
    }

    deleteAvatar(): void {
        this.profileService.deleteAvatar(this.profileId).subscribe(
            res => {
                console.log(res.message)
                this.store$.dispatch(new MyProfileDeleteAvatarSuccessAction())
            },
            err => {
                console.error(err.message)
            },
        )
    }

    changeRole(role: string): void {
        this.store$.dispatch(
            new MyProfileChangeRoleAction({ role, id: this.profileId }),
        )
    }
    // changeCompany(company: any): void
    changeAbout(about: string): void {
        this.store$.dispatch(
            new MyProfileChangeAboutAction({ about, id: this.profileId }),
        )
    }
    changeProfession(profession: string): void {
        this.store$.dispatch(
            new MyProfileChangeProfessionAction({
                profession,
                id: this.profileId,
            }),
        )
    }
    changeLocality(locality: { country: string; city: string }): void {
        this.store$.dispatch(
            new MyProfileChangeLocalityAction({ locality, id: this.profileId }),
        )
    }
    changeContactInfo(contactInfo: IContact[]): void {
        this.store$.dispatch(
            new MyProfileChangeContactInfoAction({
                contactInfo,
                id: this.profileId,
            }),
        )
    }
    changeProjects(projects: IProject[]): void {
        this.store$.dispatch(
            new MyProfileChangeProjectsAction({ projects, id: this.profileId }),
        )
    }
    changeExperience(experience: IExp[]): void {
        this.store$.dispatch(
            new MyProfileChangeExperienceAction({
                experience,
                id: this.profileId,
            }),
        )
    }
    changeEducation(education: IUniversity[]): void {
        this.store$.dispatch(
            new MyProfileChangeEducationAction({
                education,
                id: this.profileId,
            }),
        )
    }

    changeAdditionalInfoHandler(ev: { type: string; data: any }): void {
        switch (ev.type) {
            case 'role':
                this.changeRole(ev.data)
                return
            case 'about':
                this.changeAbout(ev.data)
                return
            case 'profession':
                this.changeProfession(ev.data)
                return
            case 'locality':
                this.changeLocality(ev.data)
                return
            case 'contact-info':
                this.changeContactInfo(ev.data)
                return
            case 'projects':
                this.changeProjects(ev.data)
                return
            case 'experience':
                this.changeExperience(ev.data)
                return
            case 'education':
                this.changeEducation(ev.data)
                return
        }
    }

    ngOnInit(): void {
        this.profileId$.subscribe(id => (this.profileId = id))

        this.locality$ = this.store$.pipe(
            select(myProfileLocalitySelector),
            map(locality => {
                console.log('Locality:', locality)
                return locality
            }),
        )
    }
}
