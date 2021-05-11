import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { IProject } from '../../../../../interfaces/project'
import { IContact } from '../../../../../interfaces/contact'
import { IFile } from '../../../../../interfaces/file'
import { IExp } from '../../../../../interfaces/exp'
import { IUniversity } from '../../../../../interfaces/university'
import { FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
    selector: 'app-edit-additional-info',
    templateUrl: './edit-additional-info.component.html',
    styleUrls: ['./edit-additional-info.component.less'],
})
export class EditAdditionalInfoComponent implements OnInit {
    @Input() role: string = ''
    @Input() about: string = ''
    @Input() profession: string = ''
    @Input() locality: { country: string; city: string } = {
        country: '',
        city: '',
    }
    @Input() contactInfo: IContact[] = [{ contactWay: null, data: null }]
    @Input() projects: IProject[] = [
        {
            name: null,
            role: null,
            date: null,
            about: null,
            poster: null,
        },
    ]
    @Input() experience: IExp[] = []
    @Input() education: IUniversity[] = []

    @Output() onChange = new EventEmitter<{ type: string; data: any }>()

    localityForm = new FormGroup({
        country: new FormControl(this.locality.country, [Validators.required]),
        city: new FormControl(this.locality.city, [Validators.required]),
    })

    contactInfoError: string = ''
    projectsError: string = ''
    jobError: string = ''
    educationError: string = ''

    constructor() {}

    addContactWay(): void {
        this.contactInfo.push({
            contactWay: null,
            data: null,
        })
    }

    removeContactWay(contact: IContact): void {
        this.contactInfo = this.contactInfo.filter(c => c !== contact)
    }

    addProject(): void {
        this.projects.push({
            name: null,
            role: null,
            date: null,
            about: null,
            poster: null,
        })
    }

    removeProject(project: IProject): void {
        this.projects = this.projects.filter(p => p !== project)
    }

    addJob(): void {
        this.experience.push({
            companyName: '',
            profession: '',
            start: '',
            end: '',
            logo: null,
        })
    }

    removeJob(job: IExp): void {
        this.experience = this.experience.filter(j => j !== job)
    }

    addUniversity(): void {
        this.education.push({
            name: '',
            facultyAndDegree: '',
            comment: '',
            start: '',
            end: '',
            logo: null,
        })
    }

    removeUniversity(university: IUniversity): void {
        this.education = this.education.filter(u => u !== university)
    }

    uploadPosterHandler(e: Event, project: IProject): void {
        const target = e.target as HTMLInputElement
        const file = target.files?.item(0) as File
        this.uploadPoster(file, project)
    }

    uploadJobLogoHandler(e: Event, job: IExp): void {
        const target = e.target as HTMLInputElement
        const file = target.files?.item(0) as File
        this.uploadJobLogo(file, job)
    }
    uploadUniversityLogoHandler(e: Event, university: IUniversity): void {
        const target = e.target as HTMLInputElement
        const file = target.files?.item(0) as File
        this.uploadUniversityLogo(file, university)
    }

    uploadPoster(file: File, project: IProject): void {
        this.uploadFile(file, (e: ProgressEvent) => {
            console.log(e)
            const fr = e.target as FileReader
            if (project.poster) project.poster.url = fr.result as string
            else {
                project.poster = {
                    encoding: '',
                    fileName: '',
                    mimetype: '',
                    size: 0,
                    url: fr.result as string,
                    file,
                }
            }
        })
    }

    uploadJobLogo(file: File, job: IExp): void {
        this.uploadFile(file, (e: ProgressEvent) => {
            const fr = e.target as FileReader
            if (job.logo) job.logo.url = fr.result as string
            else {
                job.logo = {
                    encoding: '',
                    fileName: '',
                    mimetype: '',
                    size: 0,
                    url: fr.result as string,
                    file,
                }
            }
        })
    }

    uploadUniversityLogo(file: File, university: IUniversity): void {
        this.uploadFile(file, (e: ProgressEvent) => {
            const fr = e.target as FileReader
            if (university.logo) university.logo.url = fr.result as string
            else {
                university.logo = {
                    encoding: '',
                    fileName: '',
                    mimetype: '',
                    size: 0,
                    url: fr.result as string,
                    file,
                }
            }
        })
    }

    uploadFile(file: File, cb: (ev: ProgressEvent) => void): void {
        const fr = new FileReader()
        fr.onload = cb
        fr.readAsDataURL(file)
    }

    changeRole(): void {
        this.onChange.emit({ type: 'role', data: this.role })
    }

    changeAbout(): void {
        this.onChange.emit({ type: 'about', data: this.about })
    }

    changeProfession(): void {
        this.onChange.emit({ type: 'profession', data: this.profession })
    }

    changeLocality(): void {
        this.onChange.emit({ type: 'locality', data: this.localityForm.value })
    }

    changeContactInfo(): void {
        for (const contactWay of this.contactInfo) {
            if (this.isEmpty(contactWay)) {
                this.projectsError = 'All fields must be filled'
                return
            }
        }

        this.onChange.emit({ type: 'contact-info', data: this.contactInfo })
    }

    changeProjects(): void {
        for (const project of this.projects) {
            if (this.isEmpty(project)) {
                this.projectsError = 'All fields must be filled'
                return
            }
        }

        this.onChange.emit({ type: 'projects', data: this.projects })
        this.projectsError = ''
    }

    changeExperience(): void {
        for (const job of this.experience) {
            console.log(job)
            if (this.isEmpty(job)) {
                this.jobError = 'All fields must be filled'
                return
            }

            if (!this.dateValidation(job.start, job.end)) {
                this.jobError = 'The date of dismissal cannot be earlier than the date of employment'
                return
            }
        }

        this.onChange.emit({ type: 'experience', data: this.experience })
        this.jobError = ''
    }

    changeEducation(): void {
        for (const university of this.education) {
            if (this.isEmpty(university)) {
                this.jobError = 'All fields must be filled'
                return
            }

            if (!this.dateValidation(university.start, university.end)) {
                this.educationError = 'The graduation date of the university cannot be earlier than the admission date'
                return
            }
        }

        this.onChange.emit({ type: 'education', data: this.education })
        this.educationError = ''
    }

    entries(object: any): Array<any> {
        return Object.entries(object)
    }

    isEmpty(entity: any): boolean {
        entity = Object.entries(entity)
        for (const [_, val] of entity) {
            if (val === '') return true
        }

        return false
    }

    dateValidation(start: string, end: string): boolean {
        const [startYear, startMonth, startDay] = start.split('-')
        const [endYear, endMonth, endDay] = end.split('-')

        if (
            endYear < startYear
            || ((endYear === startYear) && (endMonth < startMonth))
            || ((endYear === startYear) && (endMonth === startMonth) && (endDay < startDay))
        ) return false

        return true
    }

    ngOnInit(): void {}
}
