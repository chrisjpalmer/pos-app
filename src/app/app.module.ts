import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShopPageComponent } from './pages/shop-page/shop-page.component';
import { ReceiptPageComponent } from './pages/receipt-page/receipt-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ShopPageComponent,
    ReceiptPageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      [
        { path: '',
          redirectTo: '/shop',
          pathMatch: 'full'
        },
        { path: 'shop', component: ShopPageComponent },
        { path: 'receipt', component: ReceiptPageComponent },
      ],{enableTracing: true}
    )
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
