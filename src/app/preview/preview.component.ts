import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DocPreviewConfig } from './docConfig';
import { HelperService } from './services/helper.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
})
export class PreviewComponent implements OnInit {
  private _docPreviewConfig: DocPreviewConfig;
  private _documentURL: string;
  private _fileName: string;
  get docPreviewConfig(): DocPreviewConfig {
    return this._docPreviewConfig;
  }
  @Input() set docPreviewConfig(value: DocPreviewConfig) {
    if (value !== this._docPreviewConfig) {
      this._docPreviewConfig = value;
    }
  }

  get documentURL(): string {
    return this._documentURL;
  }

  @Input() set documentURL(value: string) {
    if (value !== this._documentURL) {
      this._documentURL = value;
    }
  }

  get fileName(): string {
    return this._fileName;
  }

  @Input() set fileName(value: string) {
    if (value !== this._fileName) {
      this._fileName = value;
    }
  }

  documentType: string;
  contentType: string;
  zoom_in: number = 1;
  rotation: number = 0;
  modalRef: NgbModalRef;
  // isModalView:boolean=false;

  @ViewChild('view_img') view_img: ElementRef;
  // @Output() inputModelRef: NgbModalRef;

  constructor(private _helper: HelperService, private modalService: NgbModal) {}
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
      Object.keys(sampleDocPreviewConfig).forEach((key: any) => {
        if (this.docPreviewConfig[key] === undefined) {
          this.docPreviewConfig[key] = true;
        }
        if (typeof this.docPreviewConfig[key] !== 'boolean') {
          this.docPreviewConfig[key] = false;
        }
      });
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
  upDateZoom(zoomType: string) {
    if (this.documentType === 'pdf') {
      switch (zoomType) {
        case 'decrement':
          if (this.zoom_in) {
            this.zoom_in = this.zoom_in - 0.5;
          }
          break;
        case 'increment':
          this.zoom_in = this.zoom_in + 0.5;
          break;

        default:
          this.zoom_in = 1;
          break;
      }
    }
    if (this.documentType === 'image') {
      const currWidth = this.view_img.nativeElement.clientWidth;
      switch (zoomType) {
        case 'decrement':
          if (this.zoom_in) {
            this.zoom_in = this.zoom_in - 0.5;
            this.view_img.nativeElement.style.width = currWidth - 150 + 'px';
          }
          break;
        case 'increment':
          this.zoom_in = this.zoom_in + 0.5;
          this.view_img.nativeElement.style.width = currWidth + 150 + 'px';
          break;

        default:
          this.zoom_in = 1;
          break;
      }
    }
  }

  rotateDoc() {
    if (this.documentType === 'pdf') {
      this.rotation += 90;
    }
    if (this.documentType === 'image') {
      this.rotation += 90;
      this.view_img.nativeElement.style.webkitTransform =
        'rotate(' + this.rotation + 'deg)';
      this.view_img.nativeElement.style.mozTransform =
        'rotate(' + this.rotation + 'deg)';
      this.view_img.nativeElement.style.msTransform =
        'rotate(' + this.rotation + 'deg)';
      this.view_img.nativeElement.style.oTransform =
        'rotate(' + this.rotation + 'deg)';
      this.view_img.nativeElement.style.transform =
        'rotate(' + this.rotation + 'deg)';
    }
  }

  // onCloseModal() {
  //   this.inputModelRef && this.inputModelRef.close();
  //   this.closed.emit(true);
  //   this.isModalView = false;
  // }

  viewInFullScreen() {
    // this.isModalView = true;
    this.modalRef = this.modalService.open(PreviewComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: false,
    });
    this.modalRef.componentInstance.documentURL = this.documentURL;
    this.modalRef.componentInstance.inputModelRef = this.modalRef;
    this.modalRef.componentInstance.fileName = this.fileName;
    this.modalRef.componentInstance.docPreviewConfig = {
      openModal: false,
    };
  }
}
