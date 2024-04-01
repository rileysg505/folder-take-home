import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeComponent } from './tree.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTreeHarness } from '@angular/material/tree/testing';

describe('TreeComponent', () => {
  let component: TreeComponent;
  let fixture: ComponentFixture<TreeComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TreeComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should apply text-green-500 class if node value is greater than 10', () => {
    component.dataSource.data = [
      {
        id: 1,
        name: 'Node 1',
        value: 15, // Simulating a node value greater than 10
        createdAt: new Date(),
        type: 'PROPERTY',
      },
    ];
    fixture.detectChanges(); // Trigger change detection

    const spanElement: HTMLElement =
      fixture.nativeElement.querySelector('#propValue');
    console.log(spanElement);
    expect(spanElement.classList.contains('text-green-500')).toBe(true);
  });
});
