import { FormGroup, FormBuilder, Validators } from '@angular/forms';
export abstract class PaginationClass {
	public pagination:any = null;  
  public activePage:any=1;
  public count:any=0;
  public perPage:any=5;
  public prevPage:boolean=false;
  public nextPage:boolean=false;
  public pageCount:any=0;
  public pageArray:any=[];
  public pageUrl:any = "?page="+this.activePage;
  public searchString:any = null;
  public searchingForm: FormGroup;
  public fb = new FormBuilder();
  constructor(){
  	this.searchingForm = this.fb.group({
      title: [''],
      from: [''],
      to: [''],
      days:['']
    });
  }
  setPagination(pagination){
    this.count=pagination.count;
    this.perPage=pagination.perPage;
    
    this.pageCount = Math.ceil(pagination.count / pagination.perPage);
    this.prevPage= this.activePage > 1 ? true : false;
    this.nextPage= this.activePage < this.pageCount ? true : false;
    this.pageArray=[];
    var start_node = (this.activePage - 4) >=1 ? (this.activePage - 4) : 1;
    var max_node = (this.activePage + 4);
    var end_node = max_node > this.pageCount ? this.pageCount : max_node;
    for (var i = start_node; i <= end_node; i++) {
      this.pageArray.push(i);
    }
  }
  gotoPage(number){
    this.activePage=number;
    this.createUrl();
    this.hitApi();
  }

  hitApi(){

  }

  createUrl(){
    this.pageUrl="?page="+this.activePage;
  }
  gotoLast(){
    this.activePage=this.pageCount;
    this.createUrl();
    this.hitApi();
  }
  gotoFirst(){
    this.activePage=1;
    this.createUrl();
    this.hitApi();
  }
  gotoNext(){
    this.activePage++;
    this.createUrl();
    this.hitApi();
  }
  gotoPrevious(){
    this.activePage--;
    this.createUrl();
    this.hitApi();
  }
}