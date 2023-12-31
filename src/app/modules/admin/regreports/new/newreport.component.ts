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
import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Country, Tag } from 'app/modules/admin/regreports/regreports.types';
import { ReportListComponent } from 'app/modules/admin/regreports/list/reportlist.component';
import { RegreportsService } from 'app/modules/admin/regreports/regreports.service';
import { Reports } from '../regreports.types';
import { ContactsService } from '../../contacts/contacts.service';
import { User } from 'app/modules/admin/contacts/contacts.types';
import { ReggroupsService } from '../../reggroups/reggroups.service';
import { Group } from '../../reggroups/reggroups.types';

@Component({
    selector: 'new-report',
    templateUrl: './newreport.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewReportComponent implements OnInit, OnDestroy {
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

    contacts$: Observable<User[]>;
    groups$: Observable<Group[]>;

    editMode: boolean = false;
    tags: Tag[];
    tagsEditMode: boolean = false;
    filteredTags: Tag[];
    report: Reports;
    types = [
        'link',
        'table',
        'pie_chart',
        'line_chart',
        'bar_chart',
        'area_chart',
        'indicator',
        'column_line_chart',
    ];
    groups = new FormControl([]);
    groupsObjects: Group[];
    groupsStringList: string[];
    users = new FormControl([]);
    usersObjects: User[];
    usersStringList: string[];
    contactForm: UntypedFormGroup;
    contacts: Reports[];
    countries: Country[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsListComponent: ReportListComponent,
        private _contactsService: RegreportsService,
        private _groupsService: ReggroupsService,
        private _usersService: ContactsService,
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
            emails: this._formBuilder.array([]),
            phoneNumbers: this._formBuilder.array([]),
            title: [''],
            company: [''],
            birthday: [null],
            address: [null],
            notes: [null],
            tags: [[]],
            viewId: [null],
            type: [null],
            data: [null],
            groupIds: [''],
            userIds: [''],
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

        // Get the contacts
        this.contacts$ = this._usersService.contacts$;
        this._usersService.contacts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contacts: User[]) => {
                this.usersStringList = contacts.map(
                    (user) => user.id.toString() + ' - ' + user.name
                );

                this.usersObjects = contacts;

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
     * Create Report
     */
    createContact(): void {
        // Get the contact object
        const contact = this.contactForm.getRawValue();
        contact.groupIds = this.groups.value;
        contact.userIds = this.users.value;

        // Update the contact on the server
        this._contactsService.createReport(contact).subscribe(() => {
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
