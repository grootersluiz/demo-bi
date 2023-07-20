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
import { Group } from 'app/modules/admin/reggroups/reggroups.types';
import { ReggroupsService } from 'app/modules/admin/reggroups/reggroups.service';
import { RegdashsService } from 'app/modules/admin/regdashs/regdashs.service';
import { Dash } from 'app/modules/admin/regdashs/regdashs.types';
import { RegreportsService } from '../../regreports/regreports.service';
import { Reports } from '../../regreports/regreports.types';

@Component({
    selector: 'group-list',
    templateUrl: './grouplist.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    groups$: Observable<Group[]>;
    dashs$: Observable<Dash[]>;
    reports$: Observable<Reports[]>;

    groupsCount: number = 0;
    groupsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
    drawerMode: 'side' | 'over';
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    dashs = new FormControl([]);
    dashsObjects: Dash[];
    dashsStringList: string[];
    reports = new FormControl([]);
    reportObjects: Reports[];
    reportStringList: string[];
    selectedGroup: Group;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
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
        // Get the groups
        this.groups$ = this._groupsService.groups$;
        this._groupsService.groups$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((groups: Group[]) => {
                // Update the counts
                this.groupsCount = groups.length;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the group
        this._groupsService.group$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((group: Group) => {
                // Update the selected group
                this.selectedGroup = group;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        //Get Dashs Filter

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

        // Subscribe to search input field value changes
        // this.searchInputControl.valueChanges
        //     .pipe(
        //         takeUntil(this._unsubscribeAll),
        //         switchMap((query) => {
        //             if (this.searchInputControl.value != '') {
        //                 this.dashs.setValue([]);
        //             }

        //             return this._groupsService.searchGroups(query);
        //         })
        //     )
        //     .subscribe();

        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                // Remove the selected group when drawer closed
                this.selectedGroup = null;

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
                this.createGroup();
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
     * Create group
     */
    createGroup(): void {
        // Create the group

        this._router.navigate(['./new'], {
            relativeTo: this._activatedRoute,
        });

        // this._groupsService.createGroup().subscribe((newGroup) => {
        //     // Go to the new group
        //     this._router.navigate(['./', newGroup.id], {
        //         relativeTo: this._activatedRoute,
        //     });

        //     // Mark for check
        //     this._changeDetectorRef.markForCheck();
        // });
    }

    /**
     * Get group by dash
     */
    getGroupsByDb(id: string) {
        this._groupsService.getGroupsByDash(id).subscribe();
        this.searchInputControl.setValue('');
        this.reports.setValue([]);
    }

    /**
     * Get group by dash
     */
    getGroupsByRep(id: string) {
        this._groupsService.getGroupsByReport(id).subscribe();
        this.searchInputControl.setValue('');
        this.dashs.setValue([]);
    }

    /**
     * Get group by name
     */
    getGroupsByName(name: string) {
        this._groupsService.searchGroups(name).subscribe();
        this.dashs.setValue([]);
        this.reports.setValue([]);
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
