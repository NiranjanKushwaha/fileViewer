import { Component, Input, OnInit } from '@angular/core';
import { DocPreviewConfig } from './docConfig';
import { HelperService } from './services/helper.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
})
export class PreviewComponent implements OnInit {
  @Input() documentURL: string;
  @Input() fileName: string;
  @Input() docPreviewConfig: DocPreviewConfig;
  documentType: string;
  contentType: string;
  currentZoomLevel: number = 1;

  constructor(private _helper: HelperService) {}
  ngOnInit(): void {
    const sampleDocPreviewConfig: DocPreviewConfig = {
      zoomIn: true,
      zoomOut: true,
      rotate: true,
      pageIndicator: true,
      download: true,
      openModal: true,
      close: true,
      docScreenWidth: '100%',
    };
    if (!this.docPreviewConfig) {
      this.docPreviewConfig = sampleDocPreviewConfig;
    } else {
      //   Object.keys(sampleDocPreviewConfig).forEach((key:any) => {
      //     if (this.docPreviewConfig[key] === undefined) {
      //       this.docPreviewConfig[key] = true;
      //     }
      //     if (typeof this.docPreviewConfig[key] !== "boolean") {
      //       this.docPreviewConfig[key] = false;
      //     }
      //   });
    }
    this.documentTypeDeterminer();
  }

  documentTypeDeterminer() {
    if (this.fileName || this.documentURL) {
      if (
        this._helper.fileTypeChecker(this.fileName) === 'pdf' ||
        this._helper.fileTypeChecker(this.documentURL) === 'pdf'
      ) {
        this.documentType = 'pdf';
        // this.archivedFileTypeChecker(this.documentURL);
      } else if (
        this._helper.fileTypeChecker(this.fileName) === 'image' ||
        this._helper.fileTypeChecker(this.documentURL) === 'image'
      ) {
        this.documentType = 'image';
        // this.archivedFileTypeChecker(this.documentURL);
      } else {
        // this.archivedFileTypeChecker(this.documentURL);
        setTimeout(() => {
          if (this.contentType !== undefined || this.contentType !== '') {
            if (this.contentType.split('/').includes('pdf')) {
              this.documentType = 'pdf';
            } else if (this.contentType.split('/').includes('image')) {
              this.documentType = 'image';
            } else {
              this.documentType = '';
              // this.isArchieved = true;
            }
          }
        }, 300);
      }
    } else {
      this.documentType = '';
    }
  }

  // async archivedFileTypeChecker(url: string) {
  //   this.contentType = "";
  //   let isBlobViewed = false;
  //   if (url) {
  //     let response = await fetch(url);
  //     this.contentType = response.headers.get("Content-Type");
  //     if (this.contentType === null || this.contentType === "text/html") {
  //       this.isArchieved = true;
  //       if (!isBlobViewed && response.status === 200) {
  //         isBlobViewed = true;
  //         this.onCloseModal();
  //         // this._commonService.getFileFromURLInNewTab(url);
  //       }
  //     }
  //   }
  // }

  // onCloseModal() {
  //   this.inputModelRef && this.inputModelRef.close();
  //   this.closed.emit(true);
  //   this.isModalView = false;
  // }

  downloadFile() {
    this._helper.downloadResource(this.documentURL, this.fileName);
  }
}
