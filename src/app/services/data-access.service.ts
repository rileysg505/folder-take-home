import { Injectable } from '@angular/core';
import { NewNodeParams, TreeNode } from '../models/node';
import { Observable, of, delay, tap, map, BehaviorSubject } from 'rxjs';

// Acts as the dummy data
const TREE_DATA: TreeNode[] = [
  {
    id: 0,
    name: 'Rocket',
    type: 'NODE',
    createdAt: new Date('2020-12-12'),
    children: [
      {
        id: 2,
        name: 'Height',
        type: 'PROPERTY',
        value: '18.000',
        createdAt: new Date('2021-05-05'),
      },
      {
        id: 3,
        name: 'Mass',
        type: 'PROPERTY',
        value: '12000.000',
        createdAt: new Date('2022-03-02'),
      },
      {
        id: 4,
        name: 'Stage1',
        type: 'NODE',
        createdAt: new Date('2022-03-03'),
        children: [
          {
            id: 5,
            name: 'Engine 1',
            type: 'NODE',
            createdAt: new Date('2023-01-01'),
            children: [
              {
                id: 5,
                name: 'Thrust',
                type: 'PROPERTY',
                value: '9.493',
                createdAt: new Date('2023-02-02'),
              },
              {
                id: 6,
                name: 'ISP',
                type: 'PROPERTY',
                value: '12.156',
                createdAt: new Date('2022-03-29'),
              },
            ],
          },
          {
            id: 7,
            name: 'Engine 2',
            type: 'NODE',
            createdAt: new Date('2023-07-19'),
            children: [
              {
                id: 8,
                name: 'Thrust',
                type: 'PROPERTY',
                value: '9.413',
                createdAt: new Date('2020-11-26'),
              },
              {
                id: 9,
                name: 'ISP',
                type: 'PROPERTY',
                value: '11.632',
                createdAt: new Date('2023-05-18'),
              },
            ],
          },
          {
            id: 10,
            name: 'Engine 3',
            type: 'NODE',
            createdAt: new Date('2022-05-05'),
            children: [
              {
                id: 11,
                name: 'Thrust',
                type: 'PROPERTY',
                value: '9.899',
                createdAt: new Date('2024-01-02'),
              },
              {
                id: 12,
                name: 'ISP',
                type: 'PROPERTY',
                value: '12.551',
                createdAt: new Date('2022-11-23'),
              },
            ],
          },
        ],
      },
      {
        id: 13,
        name: 'Stage 2',
        type: 'NODE',
        createdAt: new Date('2024-01-20'),
        children: [
          {
            id: 14,
            name: 'Engine 1',
            type: 'NODE',
            createdAt: new Date('2020-10-23'),
            children: [
              {
                id: 15,
                name: 'Thrust',
                type: 'PROPERTY',
                value: '',
                createdAt: new Date('2020-06-26'),
              },
              {
                id: 16,
                name: 'ISP',
                type: 'PROPERTY',
                value: '12.551',
                createdAt: new Date('2020-06-27'),
              },
            ],
          },
        ],
      },
    ],
  },
];
@Injectable({
  providedIn: 'root',
})
export class DataAccessService {
  // Behavior subject is like a subject, but uses an init value
  private treeData: BehaviorSubject<TreeNode[]>; // Placeholder for tree data

  // Use default data
  constructor() {
    this.treeData = new BehaviorSubject<TreeNode[]>(TREE_DATA);
  }

  // Get the entire tree
  getTree(): Observable<TreeNode[]> {
    return this.treeData.asObservable().pipe();
  }

  createNode(path: string, newNode: NewNodeParams): void {
    // Mocking backend writing uuid and createdAt time
    const randomId = Math.floor(Math.random() * (1000 + 1));
    const createdAt = new Date();

    const newTreeNode: TreeNode = {
      id: randomId,
      createdAt: createdAt,
      type: newNode.type,
      name: newNode.name,
    };

    // Format based on type
    if (newNode.type === 'NODE') {
      newTreeNode.children = [];
      newTreeNode.expandable = true;
    } else {
      newTreeNode.value = newNode.value;
    }

    const parentNode = this.findNodeByPath(path);
    if (parentNode && parentNode.children) {
      parentNode.children.push(newTreeNode);
    }
    const clonedTreeData = JSON.parse(JSON.stringify(this.treeData.getValue())); // Create a deep copy of the tree data

    // Signal the behvaior subject that it has been updated
    this.treeData.next(clonedTreeData);
  }

  // Mock an async call to return the subtree of nodes with their properties for a provided node path
  //
  getSubtree(nodePath: string): Observable<TreeNode[] | null> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const pathParts = nodePath.split('/');
        let currentNode: TreeNode | undefined = this.treeData
          .getValue()
          .find((node) => node.name === pathParts[0]);

        if (!currentNode) {
          return null;
        }

        for (let i = 1; i < pathParts.length; i++) {
          currentNode = currentNode.children?.find(
            (node) => node.name === pathParts[i],
          );
          if (!currentNode) {
            return null;
          }
        }

        return currentNode.children || null;
      }),
    );
  }

  // similar to above, but instead is only used within the function
  private findNodeByPath(
    path: string,
    nodes: TreeNode[] = this.treeData.getValue(),
  ): TreeNode | null {
    const pathParts = path.split('/');

    // find root node
    let currentNode: TreeNode | undefined = nodes.find(
      (node) => node.name === pathParts[0],
    );

    // if no root node found, return null
    if (!currentNode) {
      return null; // Node not found
    }

    // if it is found, repeat with each iteration of the nodes
    // Ex. [Stage1, Engine1] = find the children with name Stage1, if it exist, move on to the next part
    for (let i = 1; i < pathParts.length; i++) {
      currentNode = currentNode.children?.find(
        (node) => node.name === pathParts[i],
      );

      if (!currentNode) {
        return null; // Node not found
      }
    }

    // Retun the node and it's children
    return currentNode || null;
  }
  // Function to get all node paths recursively
  getAllNodePaths(node: TreeNode, parentPath: string = ''): string[] {
    let paths: string[] = [];
    const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
    if (node.type === 'NODE') {
      paths.push(currentPath);
    }

    // recursively call the fucntion
    // does a depth first search
    if (node.children) {
      for (const child of node.children) {
        paths = paths.concat(this.getAllNodePaths(child, currentPath));
      }
    }

    return paths;
  }

  // Function to get all node paths in the tree
  getAllTreePaths(): string[] {
    let paths: string[] = [];
    for (const node of this.treeData.getValue()) {
      paths = paths.concat(this.getAllNodePaths(node));
    }
    return paths;
  }
}
