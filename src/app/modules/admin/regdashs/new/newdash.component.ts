import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    Renderer2,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    FormControl,
} from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { debounceTime, Subject, Observable, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {
    Dash,
    DashReport,
    Country,
    Tag,
} from 'app/modules/admin/regdashs/regdashs.types';
import { DashListComponent } from 'app/modules/admin/regdashs/list/dashlist.component';
import { RegdashsService } from 'app/modules/admin/regdashs/regdashs.service';
import { Group } from 'app/modules/admin/reggroups/reggroups.types';
import { ReggroupsService } from 'app/modules/admin/reggroups/reggroups.service';
import { RegreportsService } from '../../regreports/regreports.service';
import { Reports } from '../../regreports/regreports.types';

@Component({
    selector: 'new-dash',
    templateUrl: './newdash.component.html',
    styleUrls: ['./newdash.component.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewDashComponent implements OnInit, OnDestroy {
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

    groups$: Observable<Group[]>;
    reports$: Observable<Reports[]>;

    editMode: boolean = false;
    tags: Tag[];
    tagsEditMode: boolean = false;
    filteredTags: Tag[];
    contact: Dash;
    contactForm: UntypedFormGroup;
    contacts: Dash[];
    countries: Country[];
    groups = new FormControl([]);
    groupsObjects: Group[];
    groupsStringList: string[];
    reports = new FormControl([]);
    sequence: number[] = [];
    sequenceList: number[] = [];
    dashReportObjects: DashReport[] = [];
    reportObjects: Reports[];
    reportStringList: string[];
    setReportsSeq: boolean = false;
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsListComponent: DashListComponent,
        private _contactsService: RegdashsService,
        private _groupsService: ReggroupsService,
        private _reportsService: RegreportsService,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Open the drawer
        this._contactsListComponent.matDrawer.open();

        // Create the contact form
        this.contactForm = this._formBuilder.group({
            id: [''],
            avatar: [null],
            name: ['', [Validators.required]],
            type: [''],
            groupIds: [],
            userIds: [],
            reportIds: [],
            emails: this._formBuilder.array([]),
            phoneNumbers: this._formBuilder.array([]),
            title: [''],
            company: [''],
            birthday: [null],
            address: [null],
            notes: [null],
            tags: [[]],
        });

        //Get Groups

        this.groups$ = this._groupsService.groups$;
        this._groupsService.groups$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((groups: Group[]) => {
                this.groupsStringList = groups.map(
                    (group) => group.id.toString() + ' - ' + group.name
                );

                this.groupsObjects = groups;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        //Get Reports

        this.reports$ = this._reportsService.reports$;
        this._reportsService.reports$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((reports: Reports[]) => {
                this.reportStringList = reports.map(
                    (report) => report.id.toString() + ' - ' + report.name
                );

                this.reportObjects = reports;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    showReportsList(): void {
        this.setReportsSeq = !this.setReportsSeq;
    }

    refreshReportsList(): void {
        this.sequence = [];
        this.sequenceList = [];
        this.contactForm.get('reportIds').value?.forEach((sequence, i) => {
            this.sequence.push(i + 1);
            this.sequenceList.push(i + 1);
        });
    }

    getReportInfo(reportId: number): string {
        const foundReport = this.reportObjects.find(
            (report) => report.id === reportId
        );
        if (foundReport) {
            return `${foundReport.id} - ${foundReport.name}`;
        }
    }

    storeReportSequence(event: any, index: number): void {
        this.sequence[index] = event.value;
        this.sequence.forEach((sequence, index2) => {
            if (sequence == event.value && index2 != index) {
                this.sequenceList.forEach((seq) => {
                    if (!this.sequence.includes(seq)) {
                        this.sequence[index2] = seq;
                    }
                });
            }
        });
    }

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._contactsListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        } else {
            this.editMode = editMode;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Create Dash
     */
    createContact(): void {
        let dashReports: DashReport[] = [];
        if (this.contactForm.get('reportIds')?.value) {
            dashReports = this.dashReportObjects = this.contactForm
                .get('reportIds')
                ?.value.map((reportId, index) => ({
                    reportId: reportId,
                    sequence: this.sequence[index],
                }));
        }

        // Get the contact object
        const contact = this.contactForm.getRawValue();
        contact.groupIds = this.groups.value;
        contact.reports = this.reports.value;

        // Update the contact on the server
        this._contactsService.createDash(contact, dashReports).subscribe(() => {
            // Toggle the edit mode off
            this.closeDrawer();
            this._router.navigate(['../'], {
                relativeTo: this._activatedRoute,
            });
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
