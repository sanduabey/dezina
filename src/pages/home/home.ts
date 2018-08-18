import { Component } from '@angular/core';
import { NavController , ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {ProductProvider} from "../../providers/product/product";

import {ProductDetailPage } from "../../pages/product-detail/product-detail";

import { FilterModalPage } from "../filter-modal/filter-modal";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public allProducts = [];
  private femaleSelected = true;
  private maleSelected = true;


  constructor(private modalController: ModalController, private productProvider: ProductProvider, private http: Http, public navCtrl: NavController) {

  }

  ionViewDidLoad(){ //lifecycle event
    this.productProvider.getProducts()
    .subscribe((response) => {
      this.allProducts = response;
    });
  }

  goToProductDetailPage(product) {
    this.navCtrl.push(ProductDetailPage, {
      productDetails: product
    });
  }

  openFilterModal(){
    let filterStateFromMainPage = {
      femaleSelected: this.femaleSelected,
      maleSelected: this.maleSelected
    };
    let filterModal = this.modalController.create(FilterModalPage, filterStateFromMainPage);

    filterModal.onDidDismiss((filterState) =>{
      this.femaleSelected = filterState.femaleSelected;
      this.maleSelected = filterState.maleSelected;

      this.productProvider.getProducts()
      .subscribe((allProducts) =>{
        let products = allProducts;
        if(filterState.maleSelected && filterState.femaleSelected){
          this.allProducts = products;
          return;
        } else if(!filterState.maleSelected && !filterState.femaleSelected){
          this.allProducts = [];
          return;
        } else if (filterState.maleSelected && !filterState.femaleSelected){
          this.allProducts = products.filter((product) =>{
            return product.gender !== "female";
          });

        } else if (!filterState.maleSelected && filterState.femaleSelected){
          this.allProducts = products.filter((product) =>{
            return product.gender !== "male";
          });
        }
      });
    });
    filterModal.present();
  }

}
