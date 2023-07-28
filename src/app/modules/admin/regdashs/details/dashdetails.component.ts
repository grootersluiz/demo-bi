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
    selector: 'dash-details',
    templateUrl: './dashdetails.component.html',
    styleUrls: ['../new/newdash.component.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashDetailsComponent implements OnInit, OnDestroy {
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
    dashReportList: DashReport[] = [];
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
            groupIds: [''],
            userIds: [''],
            reportIds: [''],
            emails: this._formBuilder.array([]),
            phoneNumbers: this._formBuilder.array([]),
            title: [''],
            company: [''],
            birthday: [null],
            address: [null],
            notes: [null],
            tags: [[]],
        });

        // Get the contacts
        this._contactsService.contacts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contacts: Dash[]) => {
                this.contacts = contacts;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the contact
        this._contactsService.contact$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contact: Dash) => {
                // Open the drawer in case it is closed
                this._contactsListComponent.matDrawer.open();

                // Get the contact
                this.contact = contact;

                //Set the User Groups
                this.groups.setValue(this.contact.groupIds);

                //Set the Dash Reports
                this.reports.setValue(this.contact['reportIds']);

                if (contact.reports && this.reports.value) {
                    this.sequence = [];
                    this.reports.value.forEach((report, index) => {
                        contact.reports.forEach((object) => {
                            if (object.reportId == report) {
                                this.sequence.push(object.sequence);
                            }
                        });
                        this.sequenceList.push(index + 1);
                    });
                }

                // Clear the emails and phoneNumbers form arrays
                (this.contactForm.get('emails') as UntypedFormArray).clear();
                (
                    this.contactForm.get('phoneNumbers') as UntypedFormArray
                ).clear();

                // Patch values to the form
                this.contactForm.patchValue(contact);

                // Toggle the edit mode off
                this.toggleEditMode(false);

                // Mark for check
                this._changeDetectorRef.markForCheck();
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
     * Update the contact
     */
    updateContact(): void {
        const dashReports = (this.dashReportObjects = this.contactForm
            .get('reportIds')
            ?.value.map((reportId, index) => ({
                reportId: reportId,
                sequence: this.sequence[index],
            })));

        // Get the contact object
        const contact = this.contactForm.getRawValue();
        contact.groupIds = this.groups.value;
        contact.reports = this.reports.value;
        // Go through the contact object and clear empty values
        contact.emails = contact.emails.filter((email) => email.email);

        contact.phoneNumbers = contact.phoneNumbers.filter(
            (phoneNumber) => phoneNumber.phoneNumber
        );

        // Update the contact on the server
        this._contactsService
            .updateDash(contact.id, contact, dashReports)
            .subscribe(() => {
                // Toggle the edit mode off
                this.toggleEditMode(false);
            });
    }

    /**
     * Delete the contact
     */
    deleteContact(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Deletar dashboard',
            message:
                'Tem certeza que quer deletar esse dashboard? Essa ação não poderá ser desfeita!',
            actions: {
                confirm: {
                    label: 'Deletar',
                },
                cancel: {
                    label: 'Cancelar',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Get the current contact's id
                const id = this.contact.id;

                // Get the next/previous contact's id
                const currentContactIndex = this.contacts.findIndex(
                    (item) => item.id === id
                );
                const nextContactIndex =
                    currentContactIndex +
                    (currentContactIndex === this.contacts.length - 1 ? -1 : 1);
                const nextContactId =
                    this.contacts.length === 1 && this.contacts[0].id === id
                        ? null
                        : this.contacts[nextContactIndex].id;

                // Delete the contact
                this.closeDrawer();
                this._contactsService.deleteDash(id).subscribe((isDeleted) => {
                    // Return if the contact wasn't deleted...
                    if (!isDeleted) {
                        return;
                    }

                    // Navigate to the next contact if available
                    if (nextContactId) {
                        this._router.navigate(['../', nextContactId], {
                            relativeTo: this._activatedRoute,
                        });
                    }
                    // Otherwise, navigate to the parent
                    else {
                        this._router.navigate(['../../'], {
                            relativeTo: this._activatedRoute,
                        });
                    }

                    // Toggle the edit mode off
                    this.toggleEditMode(false);
                });

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    /**
     * Open tags panel
     */
    openTagsPanel(): void {
        // Create the overlay
        this._tagsPanelOverlayRef = this._overlay.create({
            backdropClass: '',
            hasBackdrop: true,
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay
                .position()
                .flexibleConnectedTo(this._tagsPanelOrigin.nativeElement)
                .withFlexibleDimensions(true)
                .withViewportMargin(64)
                .withLockedPosition(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                ]),
        });

        // Subscribe to the attachments observable
        this._tagsPanelOverlayRef.attachments().subscribe(() => {
            // Add a class to the origin
            this._renderer2.addClass(
                this._tagsPanelOrigin.nativeElement,
                'panel-opened'
            );

            // Focus to the search input once the overlay has been attached
            this._tagsPanelOverlayRef.overlayElement
                .querySelector('input')
                .focus();
        });

        // Create a portal from the template
        const templatePortal = new TemplatePortal(
            this._tagsPanel,
            this._viewContainerRef
        );

        // Attach the portal to the overlay
        this._tagsPanelOverlayRef.attach(templatePortal);

        // Subscribe to the backdrop click
        this._tagsPanelOverlayRef.backdropClick().subscribe(() => {
            // Remove the class from the origin
            this._renderer2.removeClass(
                this._tagsPanelOrigin.nativeElement,
                'panel-opened'
            );

            // If overlay exists and attached...
            if (
                this._tagsPanelOverlayRef &&
                this._tagsPanelOverlayRef.hasAttached()
            ) {
                // Detach it
                this._tagsPanelOverlayRef.detach();

                // Reset the tag filter
                this.filteredTags = this.tags;

                // Toggle the edit mode off
                this.tagsEditMode = false;
            }

            // If template portal exists and attached...
            if (templatePortal && templatePortal.isAttached) {
                // Detach it
                templatePortal.detach();
            }
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
