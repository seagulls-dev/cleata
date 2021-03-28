import { FileUploader } from 'ng2-file-upload';
// import { HttpClient } from '../services/HttpClient';
export abstract class BaseClass{
  public showLoader:boolean = true;  
  public progressLoadingValue:number = 0;
  public uploader: FileUploader;
  public fileUploadDataObject: any;
  public serviceBase:any;
  public showMessage:boolean = true;
  constructor(){ }

  uploadNow(uploader,httpClient, allowedExtensions=[], options = {showLoader:false, showMessage: false}){
    if(options && typeof options.showLoader != "undefined") this.showLoader = options.showLoader;
    if(options && typeof options.showMessage != "undefined") this.showMessage = options.showMessage;
    var self = this;
    uploader.onAfterAddingFile = (fileItem) => {
      fileItem.withCredentials = false;
      if (allowedExtensions.length) {
        if (this.checkFileExpension(fileItem.file.name, allowedExtensions)) {
          if(self.showLoader) httpClient.showLoader = true;
          uploader.uploadAll();
        }
        else {
          httpClient.showError("You have uploaded an invalid file type. Allowed file types are "+allowedExtensions.toString());
        }
      }
      else {
        if(self.showLoader) httpClient.showLoader = true;
        uploader.uploadAll();
      }
    };
    uploader.onProgressAll = (progress: any) => {
      httpClient.progressLoadingValue = progress;
    }
    uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      if(this.showLoader) httpClient.showLoader = false;
    };

    uploader.onSuccessItem = (item:any, response:any, status:any, headers:any) => {
      if(this.showLoader) httpClient.showLoader = false;
      response = JSON.parse(response);
      if(this.showMessage) httpClient.showSuccess(response.message);
      this.onSuccessFunction(response, true);
    };
    
    uploader.onErrorItem = (item:any, response:any, status:any, headers:any) => {
      if(this.showLoader) httpClient.showLoader = false;

      httpClient.showError(response.message);
    };
  }

  checkFileExpension(fileName, allowedExtensions) : any {
    var fileExtension = fileName.split('.').pop();
    if(this.isInArray(allowedExtensions, fileExtension)) {
      return true;
    } else {
      return false;
    }
  }

  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }
  abstract onSuccessFunction(response, fileAllowed);
}