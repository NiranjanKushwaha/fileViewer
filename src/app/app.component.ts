import { Component } from '@angular/core';
import { DocPreviewConfig } from './preview/docConfig';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'viewer';
  docPreviewConfig: DocPreviewConfig = {
    close: false,
  };

  // pdf url
  url = 'http://www.africau.edu/images/default/sample.pdf';

  // image url
  // url =
  //   'https://www.interactivesearchmarketing.com/wp-content/uploads/2014/06/png-vs-jpeg.jpg';
}
