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
  treeControl = new NestedTreeControl<TreeNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();
  dataAccessService: DataAccessService = inject(DataAccessService);
  queriedDataSource = new MatTreeNestedDataSource<TreeNode>();
  queryMessage = '';
  isLoading = true;
  private searchQuerySubject: Subject<string> = new Subject<string>();
  private searchQuerySubscription: Subscription | undefined;
  refreshSubscription: Subscription | undefined;

  constructor(private dialog: DialogService) {
    this.searchQuerySubscription = this.searchQuerySubject
      .pipe(
        debounceTime(300), // Wait for 300ms after each keystroke
        distinctUntilChanged(), // Only emit when the value has changed
        switchMap((query: string) => {
          this.isLoading = true;
          return this.dataAccessService.getSubtree(query);
        })
      )
      .subscribe({
        next: (subtree: TreeNode[] | null) => {
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

  onInputChange(query: string) {
    if (query.trim() !== '') {
      // Check if the query is not empty after trimming whitespace
      this.searchQuerySubject.next(query);
    } else {
      this.queryMessage = '';
    }
  }

  ngOnDestroy() {
    if (this.searchQuerySubscription) {
      this.searchQuerySubscription.unsubscribe();
    }
  }
  ngOnInit() {
    // Subscribe to refreshTree$ observable from the shared service

    this.getTree();
  }
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
  hasChild = (_: number, node: TreeNode) =>
    !!node.children && node.children.length > 0;

  openDeleteConfirmationDialog({ node }: { node: TreeNode }) {
    this.dialog.confirmDialog({
      title: node.name,
      message: 'Are you sure you want to delete this node?',
      actionCaption: 'Delete',
      cancelCaption: 'Cancel',
      isDestructive: true,
    });
  }
  openCreateDialog() {
    this.dialog.createDialog();
  }
}
