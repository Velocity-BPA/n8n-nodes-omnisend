/**
 * [Velocity BPA Licensing Notice]
 *
 * This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
 *
 * Use of this node by for-profit organizations in production environments
 * requires a commercial license from Velocity BPA.
 *
 * For licensing information, visit https://velobpa.com/licensing
 * or contact licensing@velobpa.com.
 */

// Contact Types
export interface IOmnisendContact {
	contactID?: string;
	email?: string;
	phone?: string;
	firstName?: string;
	lastName?: string;
	tags?: string[];
	customProperties?: Record<string, unknown>;
	status?: 'subscribed' | 'unsubscribed' | 'nonSubscribed';
	emailStatus?: 'subscribed' | 'unsubscribed' | 'nonSubscribed';
	smsStatus?: 'subscribed' | 'unsubscribed' | 'nonSubscribed';
	pushStatus?: 'subscribed' | 'unsubscribed' | 'nonSubscribed';
	country?: string;
	countryCode?: string;
	city?: string;
	state?: string;
	postalCode?: string;
	address?: string;
	gender?: string;
	birthdate?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface IOmnisendContactIdentifiers {
	type: 'email' | 'phone';
	id: string;
	channels?: {
		email?: {
			status: 'subscribed' | 'unsubscribed' | 'nonSubscribed';
			statusDate?: string;
		};
		sms?: {
			status: 'subscribed' | 'unsubscribed' | 'nonSubscribed';
			statusDate?: string;
		};
		push?: {
			status: 'subscribed' | 'unsubscribed' | 'nonSubscribed';
			statusDate?: string;
		};
	};
}

// Campaign Types
export interface IOmnisendCampaign {
	campaignID?: string;
	type?: 'email' | 'sms' | 'push';
	status?: 'draft' | 'scheduled' | 'sending' | 'sent';
	name?: string;
	subject?: string;
	sentAt?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface IOmnisendCampaignStats {
	sent?: number;
	delivered?: number;
	opened?: number;
	clicked?: number;
	bounced?: number;
	unsubscribed?: number;
	complained?: number;
}

// Event Types
export interface IOmnisendEvent {
	eventName: string;
	eventID: string;
	eventVersion?: string;
	origin?: string;
	contact?: {
		email?: string;
		phone?: string;
	};
	properties?: Record<string, unknown>;
	occurredAt?: string;
}

export interface IOmnisendOrderEvent {
	orderID: string;
	totalPrice: number;
	currency: string;
	paymentStatus?: 'paid' | 'partiallyPaid' | 'unpaid' | 'refunded';
	fulfillmentStatus?: 'fulfilled' | 'unfulfilled' | 'partiallyFulfilled';
	lineItems?: IOmnisendLineItem[];
	shippingAddress?: IOmnisendAddress;
	billingAddress?: IOmnisendAddress;
}

export interface IOmnisendLineItem {
	productID: string;
	productTitle: string;
	productPrice: number;
	quantity: number;
	productUrl?: string;
	imageUrl?: string;
	sku?: string;
	variantID?: string;
	variantTitle?: string;
	discount?: number;
	categoryIDs?: string[];
}

export interface IOmnisendAddress {
	firstName?: string;
	lastName?: string;
	company?: string;
	address1?: string;
	address2?: string;
	city?: string;
	state?: string;
	stateCode?: string;
	zip?: string;
	country?: string;
	countryCode?: string;
	phone?: string;
}

// Product Types
export interface IOmnisendProduct {
	productID: string;
	title: string;
	productUrl?: string;
	imageUrl?: string;
	price?: number;
	oldPrice?: number;
	currency?: string;
	status?: 'inStock' | 'outOfStock';
	vendor?: string;
	description?: string;
	tags?: string[];
	categoryIDs?: string[];
	variants?: IOmnisendProductVariant[];
	createdAt?: string;
	updatedAt?: string;
}

export interface IOmnisendProductVariant {
	variantID: string;
	title?: string;
	sku?: string;
	price?: number;
	oldPrice?: number;
	status?: 'inStock' | 'outOfStock';
	imageUrl?: string;
}

// Category Types
export interface IOmnisendCategory {
	categoryID: string;
	title: string;
	createdAt?: string;
	updatedAt?: string;
}

// Order Types
export interface IOmnisendOrder {
	orderID: string;
	email?: string;
	phone?: string;
	orderNumber?: string;
	currency: string;
	orderSum: number;
	subTotalSum?: number;
	discountSum?: number;
	taxSum?: number;
	shippingSum?: number;
	paymentStatus?: 'paid' | 'partiallyPaid' | 'unpaid' | 'refunded';
	fulfillmentStatus?: 'fulfilled' | 'unfulfilled' | 'partiallyFulfilled';
	orderStatusUrl?: string;
	cancelReason?: string;
	cancelledAt?: string;
	lineItems?: IOmnisendLineItem[];
	shippingAddress?: IOmnisendAddress;
	billingAddress?: IOmnisendAddress;
	note?: string;
	tags?: string[];
	contactNote?: string;
	createdAt?: string;
	updatedAt?: string;
}

// Cart Types
export interface IOmnisendCart {
	cartID: string;
	email?: string;
	phone?: string;
	currency: string;
	cartSum: number;
	cartRecoveryUrl?: string;
	lineItems?: IOmnisendLineItem[];
	createdAt?: string;
	updatedAt?: string;
}

// Automation Types
export interface IOmnisendAutomation {
	automationID?: string;
	name?: string;
	status?: 'started' | 'paused' | 'draft';
	trigger?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface IOmnisendAutomationStats {
	sent?: number;
	opened?: number;
	clicked?: number;
	revenue?: number;
}

// Segment Types
export interface IOmnisendSegment {
	segmentID?: string;
	name?: string;
	type?: 'static' | 'dynamic';
	contactsCount?: number;
	createdAt?: string;
	updatedAt?: string;
}

// Form Types
export interface IOmnisendForm {
	formID?: string;
	name?: string;
	type?: 'popup' | 'embedded' | 'flyout';
	status?: 'enabled' | 'disabled';
	createdAt?: string;
	updatedAt?: string;
}

export interface IOmnisendFormStats {
	views?: number;
	submissions?: number;
	conversionRate?: number;
}

// Pagination Types
export interface IOmnisendPaging {
	limit: number;
	offset: number;
	total: number;
	next?: string;
	previous?: string;
}

export interface IOmnisendListResponse<T> {
	[key: string]: T[] | IOmnisendPaging;
	paging: IOmnisendPaging;
}

// Error Types
export interface IOmnisendError {
	error: string;
	message: string;
	field?: string;
}

// API Request Types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface IOmnisendApiRequestOptions {
	method: HttpMethod;
	endpoint: string;
	body?: Record<string, unknown>;
	query?: Record<string, unknown>;
}
