import { Component, computed, input } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { NgClass } from '@angular/common';

export interface TableColumn<T = unknown> {
  key: string;
  header: string;
  cell?: (row: T) => unknown;
  imageSrc?: (row: T) => string; // if provided, renders an image cell
  cellClass?: (row: T) => string | string[] | Record<string, boolean>;
  headerClass?: string | string[] | Record<string, boolean>;
}

@Component({
  selector: 'app-table',
  imports: [CdkTableModule, NgClass],
  template: `
    <table cdk-table [dataSource]="data()" class="table w-full">
      @for (col of columns(); track col.key) {
      <ng-container [cdkColumnDef]="col.key">
        <th cdk-header-cell *cdkHeaderCellDef [ngClass]="col.headerClass">
          {{ col.header }}
        </th>
        <td cdk-cell *cdkCellDef="let row" [ngClass]="getCellClass(col, row)">
          @if (col.imageSrc) {
          <img
            [src]="col.imageSrc(row)"
            alt=""
            class="h-6 w-6 rounded inline-block"
          />
          } @else {
          {{ getCellValue(col, row) }}
          }
        </td>
      </ng-container>
      }
      <tr cdk-header-row *cdkHeaderRowDef="displayedColumns()"></tr>
      <tr cdk-row *cdkRowDef="let row; columns: displayedColumns()"></tr>
    </table>
  `,
})
export class TableComponent<T = unknown> {
  readonly data = input<T[]>([]);
  readonly columns = input<TableColumn<T>[]>([]);

  readonly displayedColumns = computed(() => this.columns().map((c) => c.key));

  getCellValue(column: TableColumn<T>, row: T): unknown {
    if (column.cell) {
      return column.cell(row);
    }
    const recordRow = row as unknown as Record<string, unknown>;
    return recordRow[column.key];
  }

  getCellClass(
    column: TableColumn<T>,
    row: T
  ): string | string[] | Record<string, boolean> | undefined {
    return column.cellClass ? column.cellClass(row) : undefined;
  }
}
