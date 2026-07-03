/* Category interface removed */

export interface Product {
    id: number;
    name: string;
    description: string;
    purchasePriceHT: number;
    profitMarginPercent: number;
    vatPercent: number;
    sellingPriceTTC: number;
    characteristics: { [key: string]: string };
    imageUrls: string[];
    active?: boolean;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CheckoutRequest {
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    email?: string;
    items: { [key: number]: number };
}

export interface OrderItem {
    id: number;
    product: Product;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface Order {
    id: number;
    reference: string;
    orderDate: string;
    status: string;
    items: OrderItem[];
    totalAmount: number;
    deliveryFee: number;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    email?: string;
    hasStockShortage: boolean;
}

export interface LogEntry {
    id: number;
    ipAddress: string;
    timestamp: string;
    logType: string;
    message: string;
    details?: string;
    userAgent?: string;
    pageUrl?: string;
}

export interface LogEntryRequest {
    logType: string;
    message: string;
    details?: string;
    userAgent?: string;
    pageUrl?: string;
}
