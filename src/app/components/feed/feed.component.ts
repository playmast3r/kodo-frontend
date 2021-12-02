import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Directive } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { fromEvent, Observable, Subscription } from 'rxjs/';
import { debounceTime} from 'rxjs/operators';
import { FeedService } from './feed.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})

export class FeedComponent implements OnInit {

  loading = false;
  public posts: any = [];
  searchParamObservable: Observable<Params> = this.route.queryParams;
  sortOptions = [{ label: 'Name', value: 'name' }, { label: 'Date Last Edited', value: 'dateLastEdited' }];
  sortBy = 'name';
  searchQuery = '';
  pageSize = 9;
  currentPage = 1;
  pages: any = [];
  queryParams: any = {};
  @ViewChild('search') search: ElementRef;
  @ViewChild('sort') sort: ElementRef;
  searchSubscription: Subscription;
  sortSubscription: Subscription;

  constructor(private feedService: FeedService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    if (!this.router.url.includes("sortBy=")) {
      this.queryParams['sortBy'] = this.sortBy;
    }
    if (!this.router.url.includes("page=")) {
      this.queryParams['page'] = this.currentPage;
    }
    if (!this.router.url.includes("searchQuery=")) {
      this.queryParams['searchQuery'] = this.searchQuery;
    }

    this.searchParamObservable.subscribe((event) => {
      this.sortBy = event.sortBy ?? this.sortBy;
      this.currentPage = event.page ?? this.currentPage;
      this.searchQuery = event.searchQuery ?? this.searchQuery;

      this.loading = true;
      this.posts = [];
      this.updateRoute();
      this.fetchPosts();
    });
  }

  ngAfterViewInit(): void {
    this.searchSubscription = fromEvent(this.search.nativeElement, 'keyup').pipe(debounceTime(500)).subscribe((event) => {
      if (this.search.nativeElement.value.trim().length === 0) {
        this.searchQuery = "";
      }
      else {
        this.searchQuery = this.search.nativeElement.value.trim();
      }
      this.currentPage = 1;
      this.updateRoute();
      this.fetchPosts();
    });

    this.sortSubscription = fromEvent(this.sort.nativeElement, 'change').subscribe((event) => {
      this.sortBy = this.sort.nativeElement.value;
      this.currentPage = 1;
      this.updateRoute();
      this.fetchPosts();
    });
    this.setFocus();
  }

  setFocus() {
    let blurElement: HTMLElement = document.getElementsByClassName('text_box__input')[0] as HTMLElement;
    blurElement.blur();

    setTimeout(function(){
      let focusElement: HTMLElement = document.getElementsByClassName('text_box__input')[0] as HTMLElement;
      focusElement.focus();
    },0);
  }

  changePage(page: number) {
    this.currentPage = page;
    this.updateRoute();
    this.fetchPosts();
  }

  fetchPosts() {
    this.feedService.getPosts(this.currentPage, this.pageSize, this.sortBy, this.searchQuery).subscribe(
      (res) => {
        this.posts = res.body.posts;
        this.pages = Array.from(Array(Math.round(res.body.totalCount / this.pageSize)).keys());
        this.loading = false;
      },
      (err) => {
        console.log(err);
        this.loading = false;
        alert('Something went wrong.');
      }
    );
    this.setFocus();
  }


  updateRoute() {
    const params = { sortBy: this.sortBy, page: this.currentPage, searchQuery: this.searchQuery };
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge'
    });
    this.setFocus();
  }
}
