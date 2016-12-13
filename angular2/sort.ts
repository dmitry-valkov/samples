// Sorting
export enum Sort {
  ASC = 1,
  DESC = -1,
  NONE = 0
}

export interface Column {
  title: string;
  field: string;
  type: string;
  sort?: Sort;
}

export type Columns = Column[]

export class TableSort {

  /**
   * Drop columns to non-sorting state except selected
   *
   * @param columns {Columns}
   * @param column {Column}
   */
  public dropOtherSort(columns: Columns, column: Column): void {
    columns.forEach((c: Column) => {
      if (c.title !== column.title) {
        c.sort = Sort.NONE;
      }
    });
  }

  /**
   * Sorting target array with column info
   *
   * @param column {Column}
   * @param targetArray {Array<any>}
   * @return {Array<any>}
   */
  public sort(column: Column, targetArray: Array<any>): Array<any> {
    const comparator = this._createComparator(column);

    switch (column.sort) {
      case Sort.ASC:
        column.sort = Sort.DESC;
        targetArray = targetArray.sort(comparator(true));
        break;

      default:
        column.sort = Sort.ASC;
        targetArray = targetArray.sort(comparator(false));
    }

    return targetArray;
  }

  /**
   * Get sort object for server side sorting
   *
   * @param column {Column}
   * @return {object}
   */
  public sortServerFormat(column: Column): Object {
    let sortServerObj = {};

    switch (column.sort) {
      case Sort.ASC:
        column.sort = Sort.DESC;
        sortServerObj[column.field] = Sort.DESC;
        break;

      default:
        column.sort = Sort.ASC;
        sortServerObj[column.field] = Sort.ASC;
    }

    return sortServerObj;
  }

  /**
   * Create comparator for date type
   *
   * @param field {string}
   * @return {((direction?:boolean)=>(A:any, B:any)=>number)|any}
   * @private
   */
  private _createDateComparator(field: string): Function {
    let comparator;

    comparator = (direction = true) => (A, B) => {
      const a: number = new Date(A[field]).getTime();
      const b: number = new Date(B[field]).getTime();

      return direction ? a - b : b - a;
    };

    return comparator;
  }

  /**
   * Create comparator for number type
   *
   * @return {((direction?:boolean)=>(A:any, B:any)=>number)|any}
   * @private
   */
  private _createNumberComparator(): Function {
    let comparator;

    comparator = (direction = true) =>
      (A, B) => direction ? A - B : B - A;

    return comparator;
  }

  /**
   * Create comparator for string type
   *
   * @param field {string}
   * @return {((direction?:boolean)=>(A:any, B:any)=>number)|any}
   * @private
   */
  private _createStringComparator(field: string): Function {
    let comparator;

    comparator = (direction = true) => (A, B) => {
      const a: string = A[field].toLowerCase();
      const b: string = B[field].toLowerCase();
      const result = direction ? a > b : a < b;

      return result ? 1 : -1;
    };

    return comparator;
  }

  private _createComparator(column: Column): Function {
    let comparator;

    switch (column.type) {
      case 'date':
        comparator = this._createDateComparator(column.field);
        break;

      case 'number':
        comparator = this._createNumberComparator();
        break;

      default:
        comparator = this._createStringComparator(column.field);
    }

    return comparator;
  }
}
