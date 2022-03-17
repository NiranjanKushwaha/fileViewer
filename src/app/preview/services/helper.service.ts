import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor() {}

  downloadBlob(blob: string, fileName: string) {
    var a = document.createElement('a');
    a.download = fileName;
    a.href = blob;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  downloadResource(url: string, fileName: string = '') {
    if (url) {
      if (!fileName) fileName = url.split('/').pop();
      fetch(url, {
        headers: new Headers({
          Origin: location.origin,
        }),
        mode: 'cors',
      })
        .then((response) => response.blob())
        .then((blob) => {
          let blobUrl = window.URL.createObjectURL(blob);
          this.downloadBlob(blobUrl, fileName);
        })
        .catch((e) => {
          console.log('something went wrong');
        });
    }
  }

  fileTypeChecker(file: string) {
    const imgTagSupportableType = [
      '.png',
      '.jpeg',
      '.gif',
      '.apng',
      '.svg',
      '.bmp',
      '.ico',
      '.jpg',
      '.img',
    ];

    if (!file) {
      return '';
    } else {
      file = file.toLowerCase();
      if (file.includes('.pdf')) {
        return 'pdf';
      } else if (imgTagSupportableType.some((el) => file.includes(el))) {
        return 'image';
      } else {
        return '';
      }
    }
  }

  //  public downloadResourceFromURL(url: string): Observable<Blob> {
  //   const options = {
  //     headers: new HttpHeaders({ AccessToken: this.getCookie() }),
  //     responseType: "blob" as "json",
  //   };
  //   const file = this.http.get<Blob>(url, options);
  //   return file;
  // }

  // public async getFileFromURLInNewTab(url: string): Promise<void> {
  //   const file = await this.downloadResourceFromURL(url).toPromise();
  //   const blobUrl = window.URL.createObjectURL(file);
  //   window.open(blobUrl, "_blank");
  //   window.URL.revokeObjectURL(blobUrl);
  // }
}
