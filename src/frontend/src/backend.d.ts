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
export interface Jatre {
    id: bigint;
    date: Time;
    name: string;
    activities: Array<string>;
    description: string;
}
export type Time = bigint;
export interface TempleContact {
    id: bigint;
    contactType: string;
    contactNumber: string;
}
export interface DonationReport {
    totalCollections: bigint;
    totalAmount: bigint;
}
export interface CommitteeMemberPublic {
    id: bigint;
    name: string;
    role: CommitteeRole;
}
export interface CommitteeMember {
    id: bigint;
    name: string;
    role: CommitteeRole;
    mobileNumber: string;
}
export interface PaymentConfirmation {
    id: bigint;
    status: PaymentStatus;
    verificationDate?: Time;
    date: Time;
    donorName: string;
    mobileNumber: string;
    amountPaid: bigint;
    paymentMode: PaymentMode;
    transactionId: string;
}
export interface TempleAccount {
    balance: bigint;
    lastUpdated: Time;
}
export interface Receipt {
    isCancelled: boolean;
    date: Time;
    donorName: string;
    templeName: string;
    paymentMode: PaymentMode;
    amount: bigint;
    receiver: string;
    location: string;
    receiptNumber: bigint;
    transactionId: string;
}
export interface DonorDetail {
    date: Time;
    donorName: string;
    paymentMode: PaymentMode;
    amount: bigint;
    transactionId: string;
}
export interface GalleryItem {
    id: bigint;
    title: string;
    externalBlob: ExternalBlob;
    description: string;
    mediaType: string;
}
export enum CommitteeRole {
    member = "member",
    secretary = "secretary",
    president = "president"
}
export enum PaymentMode {
    upi = "upi",
    cash = "cash",
    gPay = "gPay",
    cheque = "cheque",
    phonePe = "phonePe"
}
export enum PaymentStatus {
    pendingVerification = "pendingVerification",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCommitteeMember(name: string, role: CommitteeRole, mobileNumber: string): Promise<bigint>;
    addContact(contactType: string, contactNumber: string): Promise<bigint>;
    addGalleryItem(title: string, description: string, mediaType: string, externalBlob: ExternalBlob): Promise<bigint>;
    addJatre(name: string, date: Time, description: string, activities: Array<string>): Promise<bigint>;
    adminAdjustBalance(newBalance: bigint): Promise<void>;
    approvePayment(paymentId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelReceipt(receiptNumber: bigint): Promise<void>;
    editCommitteeMember(memberId: bigint, name: string, role: CommitteeRole, mobileNumber: string): Promise<void>;
    editContact(contactId: bigint, contactType: string, contactNumber: string): Promise<void>;
    editGalleryItem(itemId: bigint, title: string, description: string, mediaType: string): Promise<void>;
    editJatre(jatreId: bigint, name: string, date: Time, description: string, activities: Array<string>): Promise<void>;
    editPaymentConfirmation(paymentId: bigint, donorName: string, mobileNumber: string, amountPaid: bigint, paymentMode: PaymentMode, transactionId: string, date: Time): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getCommitteeMembers(): Promise<Array<CommitteeMemberPublic>>;
    getCommitteeMembersAdmin(): Promise<Array<CommitteeMember>>;
    getContacts(): Promise<Array<TempleContact>>;
    getDonationReport(): Promise<DonationReport>;
    getDonorList(): Promise<Array<DonorDetail>>;
    getGalleryItems(): Promise<Array<GalleryItem>>;
    getJatres(): Promise<Array<Jatre>>;
    getPendingPayments(): Promise<Array<PaymentConfirmation>>;
    getReceipt(receiptNumber: bigint): Promise<Receipt>;
    getTempleAccountBalance(): Promise<TempleAccount>;
    isCallerAdmin(): Promise<boolean>;
    regenerateReceipt(receiptNumber: bigint): Promise<Receipt>;
    rejectPayment(paymentId: bigint): Promise<void>;
    removeCommitteeMember(memberId: bigint): Promise<void>;
    removeContact(contactId: bigint): Promise<void>;
    removeGalleryItem(itemId: bigint): Promise<void>;
    removeJatre(jatreId: bigint): Promise<void>;
    submitPaymentConfirmation(donorName: string, mobileNumber: string, amountPaid: bigint, paymentMode: PaymentMode, transactionId: string, date: Time): Promise<bigint>;
}
