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
} from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { View, Country, Tag } from 'app/modules/admin/regviews/regviews.types';
import { ViewListComponent } from 'app/modules/admin/regviews/list/viewlist.component';
import { RegviewsService } from 'app/modules/admin/regviews/regviews.service';
import { FuseConfigService } from '@fuse/services/config';

@Component({
    selector: 'new-view',
    templateUrl: './newview.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./newview.component.css'],
})
export class NewViewComponent implements OnInit, OnDestroy {
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

    editMode: boolean = false;
    tags: Tag[];
    tagsEditMode: boolean = false;
    filteredTags: Tag[];
    view: View;
    contactForm: UntypedFormGroup;
    views: View[];
    countries: Country[];

    codeMirrorInitialQuery: string = '';

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsListComponent: ViewListComponent,
        private _viewsService: RegviewsService,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _fuseConfigService: FuseConfigService
    ) {}

    codeMirrorOptions: any = {
        mode: 'text/x-mysql',
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        lineWrapping: true,
        extraKeys: { 'Ctrl-Space': 'autocomplete' },
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        autoCloseBrackets: true,
        matchBrackets: true,
        lint: true,
    };

    codeMirrorOptions2: any = {
        mode: 'text/x-mysql',
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        lineWrapping: true,
        extraKeys: { 'Ctrl-Space': 'autocomplete' },
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        autoCloseBrackets: true,
        matchBrackets: true,
        lint: true,
        readOnly: 'nocursor',
    };

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the current layout config to update the SQL editor
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((layoutConfig) => {
                this.codeMirrorOptions.theme =
                    layoutConfig.scheme == 'light' ? 'default' : 'midnight';
                this.codeMirrorOptions2.theme =
                    layoutConfig.scheme == 'light' ? 'default' : 'midnight';
                this._changeDetectorRef.markForCheck();
            });

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
            query: [null],
            tags: [[]],
        });

        // // Get the contact
        // this._viewsService.contact$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((view: View) => {
        //         // Open the drawer in case it is closed
        //         this._contactsListComponent.matDrawer.open();

        //         // Get the view
        //         this.view = view;
        //         this.codeMirrorInitialQuery = this.view.query;

        //         // Clear the emails and phoneNumbers form arrays
        //         (this.contactForm.get('emails') as UntypedFormArray).clear();
        //         (
        //             this.contactForm.get('phoneNumbers') as UntypedFormArray
        //         ).clear();

        //         // Patch values to the form
        //         this.contactForm.patchValue(view);

        //         // Setup the emails form array
        //         const emailFormGroups = [];

        //         // Add the email form groups to the emails form array
        //         emailFormGroups.forEach((emailFormGroup) => {
        //             (this.contactForm.get('emails') as UntypedFormArray).push(
        //                 emailFormGroup
        //             );
        //         });

        //         // Setup the phone numbers form array
        //         const phoneNumbersFormGroups = [];

        //         // Add the phone numbers form groups to the phone numbers form array
        //         phoneNumbersFormGroups.forEach((phoneNumbersFormGroup) => {
        //             (
        //                 this.contactForm.get('phoneNumbers') as UntypedFormArray
        //             ).push(phoneNumbersFormGroup);
        //         });

        //         // Toggle the edit mode off
        //         this.toggleEditMode(false);

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });
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
    setSqlEditorContent(event: string) {
        this.codeMirrorInitialQuery = event;
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
     * Create View
     */
    createContact(): void {
        // Get the contact object
        const contact = this.contactForm.getRawValue();

        contact.query = this.codeMirrorInitialQuery;

        // Update the contact on the server
        this._viewsService.createView(contact).subscribe(() => {
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
