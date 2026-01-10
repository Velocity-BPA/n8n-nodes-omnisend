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

import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IHookFunctions,
	IWebhookFunctions,
	IHttpRequestMethods,
	IRequestOptions,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const BASE_URL = 'https://api.omnisend.com/v5';

/**
 * Make an API request to Omnisend
 */
export async function omnisendApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials('omnisendApi');

	const options: IRequestOptions = {
		method,
		uri: `${BASE_URL}${endpoint}`,
		headers: {
			'X-API-KEY': credentials.apiKey as string,
			'Content-Type': 'application/json',
		},
		json: true,
	};

	if (Object.keys(body).length > 0) {
		options.body = body;
	}

	if (Object.keys(query).length > 0) {
		options.qs = query;
	}

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: getErrorMessage(error),
		});
	}
}

/**
 * Make an API request with automatic pagination
 */
export async function omnisendApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	propertyName: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];

	let responseData: IDataObject;
	query.limit = query.limit || 250;
	query.offset = query.offset || 0;

	let hasMore = true;
	while (hasMore) {
		responseData = await omnisendApiRequest.call(this, method, endpoint, body, query);

		const items = responseData[propertyName] as IDataObject[];
		if (items) {
			returnData.push(...items);
		}

		const paging = responseData.paging as IDataObject;
		if (paging && paging.next) {
			query.offset = (query.offset as number) + (query.limit as number);
		} else {
			hasMore = false;
		}
	}

	return returnData;
}

/**
 * Extract error message from API response
 */
function getErrorMessage(error: unknown): string {
	const err = error as IDataObject;

	if (err.response && typeof err.response === 'object') {
		const response = err.response as IDataObject;
		if (response.body && typeof response.body === 'object') {
			const body = response.body as IDataObject;
			if (body.message) {
				return body.message as string;
			}
			if (body.error) {
				return body.error as string;
			}
		}
	}

	if (err.message) {
		return err.message as string;
	}

	return 'An unknown error occurred';
}

/**
 * Validate E.164 phone number format
 */
export function validateE164Phone(phone: string): boolean {
	const e164Regex = /^\+[1-9]\d{1,14}$/;
	return e164Regex.test(phone);
}

/**
 * Format phone number to E.164 if possible
 */
export function formatPhoneE164(phone: string, countryCode?: string): string {
	// Remove all non-digit characters except leading +
	let cleaned = phone.replace(/[^\d+]/g, '');

	// If it doesn't start with +, add country code
	if (!cleaned.startsWith('+')) {
		if (countryCode) {
			cleaned = `+${countryCode}${cleaned}`;
		} else {
			// Default to US if no country code
			cleaned = `+1${cleaned}`;
		}
	}

	return cleaned;
}

/**
 * Build contact identifier object
 */
export function buildContactIdentifier(
	email?: string,
	phone?: string,
): IDataObject {
	const identifiers: IDataObject[] = [];

	if (email) {
		identifiers.push({
			type: 'email',
			id: email,
			channels: {
				email: {
					status: 'subscribed',
					statusDate: new Date().toISOString(),
				},
			},
		});
	}

	if (phone) {
		identifiers.push({
			type: 'phone',
			id: phone,
			channels: {
				sms: {
					status: 'subscribed',
					statusDate: new Date().toISOString(),
				},
			},
		});
	}

	return { identifiers };
}

/**
 * Build event payload
 */
export function buildEventPayload(
	eventName: string,
	eventID: string,
	email?: string,
	phone?: string,
	properties?: IDataObject,
): IDataObject {
	const payload: IDataObject = {
		eventName,
		eventID,
		eventVersion: 'v2',
		origin: 'api',
	};

	if (email || phone) {
		payload.contact = {};
		if (email) {
			(payload.contact as IDataObject).email = email;
		}
		if (phone) {
			(payload.contact as IDataObject).phone = phone;
		}
	}

	if (properties && Object.keys(properties).length > 0) {
		payload.properties = properties;
	}

	return payload;
}

/**
 * Build line items array from input
 */
export function buildLineItems(items: IDataObject[]): IDataObject[] {
	return items.map((item) => ({
		productID: item.productID || item.productId,
		productTitle: item.productTitle || item.title,
		productPrice: parseFloat(item.productPrice as string) || item.price,
		quantity: parseInt(item.quantity as string, 10) || 1,
		productUrl: item.productUrl,
		imageUrl: item.imageUrl,
		sku: item.sku,
		variantID: item.variantID || item.variantId,
		variantTitle: item.variantTitle,
		discount: item.discount ? parseFloat(item.discount as string) : undefined,
		categoryIDs: item.categoryIDs || item.categoryIds,
	}));
}

/**
 * Build address object from input
 */
export function buildAddress(addressData: IDataObject): IDataObject {
	return {
		firstName: addressData.firstName,
		lastName: addressData.lastName,
		company: addressData.company,
		address1: addressData.address1 || addressData.address,
		address2: addressData.address2,
		city: addressData.city,
		state: addressData.state,
		stateCode: addressData.stateCode,
		zip: addressData.zip || addressData.postalCode,
		country: addressData.country,
		countryCode: addressData.countryCode,
		phone: addressData.phone,
	};
}

/**
 * Clean object by removing undefined/null values
 */
export function cleanObject(obj: IDataObject): IDataObject {
	const cleaned: IDataObject = {};

	for (const [key, value] of Object.entries(obj)) {
		if (value !== undefined && value !== null && value !== '') {
			if (typeof value === 'object' && !Array.isArray(value)) {
				const cleanedNested = cleanObject(value as IDataObject);
				if (Object.keys(cleanedNested).length > 0) {
					cleaned[key] = cleanedNested;
				}
			} else if (Array.isArray(value)) {
				if (value.length > 0) {
					cleaned[key] = value;
				}
			} else {
				cleaned[key] = value;
			}
		}
	}

	return cleaned;
}

/**
 * Parse tags from string or array
 */
export function parseTags(tags: string | string[]): string[] {
	if (Array.isArray(tags)) {
		return tags;
	}

	if (typeof tags === 'string') {
		return tags.split(',').map((tag) => tag.trim()).filter(Boolean);
	}

	return [];
}

/**
 * Generate unique event ID
 */
export function generateEventId(prefix: string = 'evt'): string {
	const timestamp = Date.now();
	const random = Math.random().toString(36).substring(2, 10);
	return `${prefix}_${timestamp}_${random}`;
}

/**
 * Emit licensing notice once per session
 */
let licensingNoticeEmitted = false;

export function emitLicensingNotice(
	context: IExecuteFunctions,
): void {
	if (!licensingNoticeEmitted) {
		context.logger.warn(
			'[Velocity BPA Licensing Notice] This n8n node is licensed under the Business Source License 1.1 (BSL 1.1). ' +
			'Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA. ' +
			'For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.',
		);
		licensingNoticeEmitted = true;
	}
}
