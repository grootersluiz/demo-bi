import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormControl, FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import {
    filter,
    fromEvent,
    Observable,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';

import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import {
    Reports,
    Country,
} from 'app/modules/admin/regreports/regreports.types';
import { RegreportsService } from 'app/modules/admin/regreports/regreports.service';
import { Group } from 'app/modules/admin/reggroups/reggroups.types';
import { ReggroupsService } from 'app/modules/admin/reggroups/reggroups.service';
import { User } from 'app/core/user/user.types';
import { ContactsService } from '../../contacts/contacts.service';

@Component({
    selector: 'reports-list',
    templateUrl: './reportlist.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    contacts$: Observable<Reports[]>;
    groups$: Observable<Group[]>;
    users$: Observable<User[]>;

    contactsCount: number = 0;
    contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
    countries: Country[];
    drawerMode: 'side' | 'over';
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    groups = new FormControl([]);
    groupsObjects: Group[];
    groupsStringList: string[];
    users = new FormControl([]);
    usersObjects: User[];
    usersStringList: string[];
    selectedContact: Reports;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsService: RegreportsService,
        private _groupsService: ReggroupsService,
        private _usersService: ContactsService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the contacts
        this.contacts$ = this._contactsService.reports$;
        this._contactsService.reports$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contacts: Reports[]) => {
                // Update the counts
                this.contactsCount = contacts.length;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the contact
        this._contactsService.contact$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contact: Reports) => {
                // Update the selected contact
                this.selectedContact = contact;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        //Get Groups for filter

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

        // Get Users for filter

        this.users$ = this._usersService.contacts$;
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

        // Get the countries
        this._contactsService.countries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((countries: Country[]) => {
                // Update the countries
                this.countries = countries;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to search input field value changes
        // this.searchInputControl.valueChanges
        //     .pipe(
        //         takeUntil(this._unsubscribeAll),
        //         switchMap((query) =>
        //             // Search
        //             this._contactsService.searchReports(query)
        //         )
        //     )
        //     .subscribe();

        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                // Remove the selected contact when drawer closed
                this.selectedContact = null;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode if the given breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                } else {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Listen for shortcuts
        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>(
                    (event) =>
                        (event.ctrlKey === true || event.metaKey) && // Ctrl or Cmd
                        event.key === '/' // '/'
                )
            )
            .subscribe(() => {
                this.createContact();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Create contact
     */
    createContact(): void {
        // Create the contact

        this._router.navigate(['./new'], {
            relativeTo: this._activatedRoute,
        });

        // this._contactsService.createReport().subscribe((newContact) => {
        //     // Go to the new contact
        //     this._router.navigate(['./', newContact.id], {
        //         relativeTo: this._activatedRoute,
        //     });

        //     // Mark for check
        //     this._changeDetectorRef.markForCheck();
        // });
    }

    /**
     * Get report by group
     */
    getReportsByGp(id: string) {
        this._contactsService.getReportsByGroup(id).subscribe();
        this.searchInputControl.setValue('');
        this.users.setValue([]);
    }

    /**
     * Get report by group
     */
    getReportsByUsr(id: string) {
        this._contactsService.getReportsByUser(id).subscribe();
        this.searchInputControl.setValue('');
        this.groups.setValue([]);
    }

    /**
     * Get report by name
     */
    getReportsByName(name: string) {
        this._contactsService.searchReports(name).subscribe();
        this.groups.setValue([]);
        this.users.setValue([]);
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
