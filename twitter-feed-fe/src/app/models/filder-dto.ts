export class FilterDTO{

  //TODO:Rename this
  filterValue: string;
  count : number;
  filterType: string;

  constructor(languageString: string, count?: number,filterType?: string){
    this.filterValue = languageString;
    this.count = count;
    this.filterType = filterType;
  }

}
