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
import { User, Country } from 'app/modules/admin/contacts/contacts.types';
import { ContactsService } from 'app/modules/admin/contacts/contacts.service';
import { Group } from 'app/modules/admin/reggroups/reggroups.types';
import { ReggroupsService } from 'app/modules/admin/reggroups/reggroups.service';
import { RegdashsService } from 'app/modules/admin/regdashs/regdashs.service';
import { Dash } from 'app/modules/admin/regdashs/regdashs.types';
import { RegreportsService } from '../../regreports/regreports.service';
import { Reports } from '../../regreports/regreports.types';

@Component({
    selector: 'contacts-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    contacts$: Observable<User[]>;
    groups$: Observable<Group[]>;
    dashs$: Observable<Dash[]>;
    reports$: Observable<Reports[]>;

    contactsCount: number = 0;
    contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
    groups = new FormControl([]);
    groupsObjects: Group[];
    groupsStringList: string[];
    dashs = new FormControl([]);
    dashsObjects: Dash[];
    dashsStringList: string[];
    reports = new FormControl([]);
    reportObjects: Reports[];
    reportStringList: string[];
    countries: Country[];
    drawerMode: 'side' | 'over';
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedContact: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsService: ContactsService,
        private _groupsService: ReggroupsService,
        private _dashsService: RegdashsService,
        private _reportsService: RegreportsService,
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
        this.contacts$ = this._contactsService.contacts$;
        this._contactsService.contacts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contacts: User[]) => {
                // Update the counts
                this.contactsCount = contacts.length;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the contact
        this._contactsService.contact$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contact: User) => {
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

        //Get Dashs for filter

        this.dashs$ = this._dashsService.contacts$;
        this._dashsService.contacts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((dashs: Dash[]) => {
                this.dashsStringList = dashs.map(
                    (dash) => dash.id.toString() + ' - ' + dash.name
                );

                this.dashsObjects = dashs;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        //Get Reports for filter

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
        //         switchMap((query) => {
        //             if (this.searchInputControl.value != '') {
        //                 this.groups.setValue([]);
        //                 this.dashs.setValue([]);
        //             }

        //             return this._contactsService.searchContacts(query);
        //         })
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
     * Get user by group
     */
    getUsersByGp(id: string) {
        this._contactsService.getUsersByGroup(id).subscribe();
        this.dashs.setValue([]);
        this.searchInputControl.setValue('');
    }

    /**
     * Get user by dash
     */
    getUsersByDb(id: string) {
        this._contactsService.getUsersByDash(id).subscribe();
        this.groups.setValue([]);
        this.searchInputControl.setValue('');
        this.reports.setValue([]);
    }

    /**
     * Get user by dash
     */
    getUsersByRep(id: string) {
        this._contactsService.getUsersByReport(id).subscribe();
        this.groups.setValue([]);
        this.searchInputControl.setValue('');
        this.dashs.setValue([]);
    }

    /**
     * Get user by name
     */
    getUsersByName(name: string) {
        this._contactsService.searchContacts(name).subscribe();
        this.groups.setValue([]);
        this.dashs.setValue([]);
        this.reports.setValue([]);
    }

    /**
     * Create contact
     */
    createContact(): void {
        this._router.navigate(['./new'], {
            relativeTo: this._activatedRoute,
        });

        // Create the contact
        /* this._contactsService.createContact().subscribe((newContact) => {
            // Go to the new contact
            this._router.navigate(['./', newContact.id], {
                relativeTo: this._activatedRoute,
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }); */
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
