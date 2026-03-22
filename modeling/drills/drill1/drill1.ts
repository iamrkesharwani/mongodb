interface Invoice {
  invoiceId: string;
  date: Date;
  items: {
    desc: string;
    qty: number;
    price: number;
  }[];
}

interface Product {
  productId: string;
  name: string;
  price: string;
  reviewIds: string[];
}

interface Review {
  reviewId: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
}
