import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private categoryIcons: any = [
    { name: 'beverage', path: 'beverage.svg' },
    { name: 'book', path: 'book.svg' },
    { name: 'pet', path: 'pet.svg' },
    { name: 'food', path: 'food.svg' },
    { name: 'home', path: 'home.svg' },
    { name: 'healthcare', path: 'healthcare.svg' },
    { name: 'electricity', path: 'electricity.svg' },
    { name: 'gas', path: 'gas.svg' },
    { name: 'water', path: 'water.svg' },
    { name: 'rent', path: 'rent.svg' },
    { name: 'car', path: 'car.svg' },
    { name: 'shoes', path: 'shoes.svg' },
    { name: 'bag', path: 'bag.svg' },
    { name: 'clothes', path: 'clothes.svg' },
    { name: 'beauty', path: 'beauty.svg' },
    { name: 'travel', path: 'travel.svg' },
    { name: 'film', path: 'film.svg' },
    { name: 'fun', path: 'fun.svg' },
    { name: 'games', path: 'games.svg' },
    { name: 'sport', path: 'sport.svg' },
    { name: 'gym', path: 'gym.svg' },
    { name: 'education', path: 'education.svg' },
    { name: 'camera', path: 'camera.svg' },
    { name: 'tech', path: 'tech.svg' },
    { name: 'phone', path: 'phone.svg' },
    { name: 'wedding', path: 'wedding.svg' },
    { name: 'snacks', path: 'snacks.svg' },
    { name: 'meat', path: 'meat.svg' },
    { name: 'fruit', path: 'fruit.svg' },
    { name: 'vegetables', path: 'vegetables.svg' },
    { name: 'social', path: 'social.svg' },
    { name: 'bath', path: 'bath.svg' },
    { name: 'music', path: 'music.svg' },
    { name: 'others', path: 'others.svg' },
  ];

  private incomeIcon = [
    { name: 'salary', path: 'salary.svg' },
    { name: 'side-job', path: 'side-job.svg' },
    { name: 'gift', path: 'gift.svg' },
    { name: 'rent', path: 'rent.svg' },
    { name: 'investment', path: 'investment.svg' },
    { name: 'friend', path: 'friend.svg' },
    { name: 'bonus', path: 'bonus.svg' },
    { name: 'others', path: 'others.svg' },
  ];

  constructor() {}

  getCategoryList(): any {
    return this.categoryIcons;
  }

  getIncomeList(): any {
    return this.incomeIcon;
  }
}
