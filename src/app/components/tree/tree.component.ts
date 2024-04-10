import { Component, inject } from '@angular/core';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { TreeNode } from '../../models/node';
import { DialogService } from '../../services/dialog.service';
import { DataAccessService } from '../../services/data-access.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import { TimeAgoPipe } from '../../time-ago.pipe';

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [
    MatTreeModule,
    MatIconModule,
    NgClass,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    TimeAgoPipe,
  ],
  templateUrl: './tree.component.html',
})
export class TreeComponent {
  // Used for MatTree with nested nodes
  treeControl = new NestedTreeControl<TreeNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();

  // Injects the dataService and allows us to use it in this component
  dataAccessService: DataAccessService = inject(DataAccessService);

  // Used for data the is searched, allows us to keep the root node in memory so we do not have to call it
  queriedDataSource = new MatTreeNestedDataSource<TreeNode>();

  // Used to display any messages when the user queries  in the search bar
  queryMessage = '';

  // Used to check if the data is loading
  isLoading = true;

  // Create a variable that is listening to the query
  private searchQuerySubject: Subject<string> = new Subject<string>();
  private searchQuerySubscription: Subscription | undefined;

  constructor(private dialog: DialogService) {
    // subscribe to the query and do something if it has changed
    // also have a debounceTime
    //
    this.searchQuerySubscription = this.searchQuerySubject
      .pipe(
        debounceTime(300), // Wait for 300ms after each keystroke
        distinctUntilChanged(), // Only emit when the value has changed
        switchMap((query: string) => {
          // Use to transform the query into an observable
          this.isLoading = true;
          return this.dataAccessService.getSubtree(query);
        }),
      )
      .subscribe({
        next: (subtree: TreeNode[] | null) => {
          // Changes other variables above
          // Changes behavior based on if the query found data or not
          this.isLoading = false;
          this.queryMessage = 'Found results!';
          if (subtree) {
            this.queriedDataSource.data = subtree;
          } else {
            this.queryMessage =
              'No path matches specified path, here is the root';
            this.queriedDataSource.data = []; // Clear the queried data if subtree is null
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error fetching subtree:', error);
        },
      });
  }

  // listening to the input changing
  onInputChange(query: string) {
    if (query.trim() !== '') {
      // Check if the query is not empty after trimming whitespace
      this.searchQuerySubject.next(query);
    } else {
      this.queryMessage = '';
    }
  }

  // destroy subsciptions to prevent memory leak
  ngOnDestroy() {
    if (this.searchQuerySubscription) {
      this.searchQuerySubscription.unsubscribe();
    }
  }
  // on init, get the initial data
  ngOnInit() {
    this.getTree();
  }

  // get the data from the data service
  getTree() {
    this.dataAccessService.getTree().subscribe({
      next: (rootNode: TreeNode[]) => {
        this.dataSource.data = rootNode;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching tree data:', error);
        this.isLoading = false;
      },
    });
  }

  // used for determing if the node has a child node
  hasChild = (_: number, node: TreeNode) =>
    !!node.children && node.children.length > 0;

  // open the delete confirmation dialog with the data from that specific node
  openDeleteConfirmationDialog({ node }: { node: TreeNode }) {
    this.dialog.confirmDialog({
      title: node.name,
      message: 'Are you sure you want to delete this node?',
      actionCaption: 'Delete',
      cancelCaption: 'Cancel',
      isDestructive: true,
    });
  }

  // Open the create dialog
  openCreateDialog() {
    this.dialog.createDialog();
  }
}
