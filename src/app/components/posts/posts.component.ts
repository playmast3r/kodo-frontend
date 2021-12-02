import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  @Input() thumbnail: any;
  @Input() name: any;
  @Input() description: any;
  @Input() dateLastEdited: any;

  constructor() { }

  ngOnInit(): void {
  }

  setDefaultPic() {
    this.thumbnail = "https://image-placeholder.com/images/actual-size/640x480.png";
  }

}
