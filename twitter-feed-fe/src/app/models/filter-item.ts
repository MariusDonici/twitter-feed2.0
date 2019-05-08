export class FilterItem{
  type: string;
  values: string[] = [];


  constructor(type: string, values: string[]) {
    this.type = type;
    this.values = values;
  }
}
