import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Testimonial {
    id: bigint;
    review: string;
    from: string;
    timestamp: Time;
    rating: bigint;
}
export type Time = bigint;
export interface MenuCategory {
    id: string;
    name: string;
    description: string;
    items: Array<MenuItem>;
}
export interface ContactSubmission {
    id: bigint;
    name: string;
    email: string;
    message: string;
    timestamp: Time;
    phone: string;
}
export interface Infographic {
    title: string;
    icon: string;
    description: string;
    graphic: ExternalBlob;
}
export interface Subsection {
    title: string;
    content: string;
    items: Array<SubsectionItem>;
}
export interface PromotionalMaterial {
    id: string;
    title: string;
    file: ExternalBlob;
}
export type OrderType = {
    __kind__: "cart";
    cart: {
        items: Array<MenuItem>;
    };
} | {
    __kind__: "singleItem";
    singleItem: MenuItem;
};
export interface Order {
    id: bigint;
    status: OrderStatus;
    deliveryCharge: number;
    total: number;
    orderType: OrderType;
    whatsappNumber: string;
    address: string;
    timestamp: Time;
    upiId: string;
    deliveryDistanceKm: number;
}
export interface DeploymentStatus {
    verified: boolean;
    canisterURL: string;
    dnsInstructions: string;
    isPermanent: boolean;
}
export interface MenuItem {
    isVaishnav: boolean;
    name: string;
    description: string;
    isJain: boolean;
    category: string;
    price: number;
}
export interface SubsectionItem {
    title: string;
    description: string;
}
export interface Section {
    title: string;
    subsections: Array<Subsection>;
    icon: string;
    description: string;
    infographic?: Infographic;
}
export interface DetailedMenu {
    categories: Array<MenuCategory>;
    sections: Array<Section>;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum OrderStatus {
    cancelled = "cancelled",
    pending = "pending",
    paid = "paid",
    whatsappConfirmed = "whatsappConfirmed",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addTestimonial(from: string, review: string, rating: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    confirmUpiPayment(orderId: bigint): Promise<void>;
    downloadMenuPDF(): Promise<ExternalBlob | null>;
    getAllContactSubmissions(): Promise<Array<ContactSubmission>>;
    getAllMenuSections(): Promise<Array<Section>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllTestimonials(): Promise<Array<Testimonial>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDeploymentStatus(): Promise<DeploymentStatus>;
    getDetailedMenu(): Promise<DetailedMenu>;
    getLogo(): Promise<PromotionalMaterial | null>;
    getMenu(): Promise<Array<MenuCategory>>;
    getMenuCategory(id: string): Promise<MenuCategory | null>;
    getMenuSection(title: string): Promise<Section | null>;
    getOrderById(id: bigint): Promise<Order | null>;
    getPermanentCanisterURL(): Promise<string>;
    getPromoMaterial(id: string): Promise<PromotionalMaterial | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    importTestimonial(from: string, review: string, rating: bigint): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(orderType: OrderType, total: number, address: string, deliveryDistanceKm: number): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContactForm(name: string, email: string, phone: string, message: string): Promise<void>;
    updateLogo(newLogo: ExternalBlob): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
    uploadPromoMaterial(id: string, title: string, file: ExternalBlob): Promise<void>;
}
