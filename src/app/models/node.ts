export interface TreeNode {
  id: number;
  name: string;
  type: 'NODE' | 'PROPERTY';
  value?: string | number;
  createdAt: Date;
  children?: TreeNode[]; // Add children property
  expandable?: boolean; // Optional property
}

export interface NewNodeParams {
  name: string;
  type: 'NODE' | 'PROPERTY';
  value?: string | number;
}
