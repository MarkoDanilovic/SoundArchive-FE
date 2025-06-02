export interface IBasket {
  id:string,
  items: IBasketItem[]
}

export interface IBasketItem{
  id:number;
  price:number
  quantity:number
}

export class Basket implements IBasket{
  id = 'guid';
  items: IBasketItem[]
}
