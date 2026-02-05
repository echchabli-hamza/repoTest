export interface OrderItem {
    dishId: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    tableNumber: number;
    clientName: string;
    items: OrderItem[];
    totalPrice: number;
    status: 'PENDING' | 'COMPLETED';
    createdAt: Date;
}
