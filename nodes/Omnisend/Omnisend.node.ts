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
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
	omnisendApiRequest,
	omnisendApiRequestAllItems,
	buildEventPayload,
	buildLineItems,
	buildAddress,
	cleanObject,
	parseTags,
	generateEventId,
	emitLicensingNotice,
} from './GenericFunctions';

import {
	contactOperations,
	contactFields,
	campaignOperations,
	campaignFields,
	eventOperations,
	eventFields,
	productOperations,
	productFields,
	categoryOperations,
	categoryFields,
	orderOperations,
	orderFields,
	cartOperations,
	cartFields,
	automationOperations,
	automationFields,
	segmentOperations,
	segmentFields,
	formOperations,
	formFields,
} from './descriptions';

export class Omnisend implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Omnisend',
		name: 'omnisend',
		icon: 'file:omnisend.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Omnisend API for omnichannel marketing automation',
		defaults: {
			name: 'Omnisend',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'omnisendApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Automation',
						value: 'automation',
					},
					{
						name: 'Campaign',
						value: 'campaign',
					},
					{
						name: 'Cart',
						value: 'cart',
					},
					{
						name: 'Category',
						value: 'category',
					},
					{
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'Event',
						value: 'event',
					},
					{
						name: 'Form',
						value: 'form',
					},
					{
						name: 'Order',
						value: 'order',
					},
					{
						name: 'Product',
						value: 'product',
					},
					{
						name: 'Segment',
						value: 'segment',
					},
				],
				default: 'contact',
			},
			// Contact
			...contactOperations,
			...contactFields,
			// Campaign
			...campaignOperations,
			...campaignFields,
			// Event
			...eventOperations,
			...eventFields,
			// Product
			...productOperations,
			...productFields,
			// Category
			...categoryOperations,
			...categoryFields,
			// Order
			...orderOperations,
			...orderFields,
			// Cart
			...cartOperations,
			...cartFields,
			// Automation
			...automationOperations,
			...automationFields,
			// Segment
			...segmentOperations,
			...segmentFields,
			// Form
			...formOperations,
			...formFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Emit licensing notice once per execution
		emitLicensingNotice(this);

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// ==================== CONTACT ====================
				if (resource === 'contact') {
					if (operation === 'create') {
						const email = this.getNodeParameter('email', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const customPropertiesUi = this.getNodeParameter('customProperties', i) as IDataObject;

						const body: IDataObject = {
							identifiers: [
								{
									type: 'email',
									id: email,
									channels: {
										email: {
											status: additionalFields.emailStatus || 'subscribed',
											statusDate: new Date().toISOString(),
										},
									},
								},
							],
						};

						if (additionalFields.phone) {
							(body.identifiers as IDataObject[]).push({
								type: 'phone',
								id: additionalFields.phone,
								channels: {
									sms: {
										status: additionalFields.smsStatus || 'subscribed',
										statusDate: new Date().toISOString(),
									},
								},
							});
						}

						if (additionalFields.firstName) body.firstName = additionalFields.firstName;
						if (additionalFields.lastName) body.lastName = additionalFields.lastName;
						if (additionalFields.gender) body.gender = additionalFields.gender;
						if (additionalFields.birthdate) body.birthdate = additionalFields.birthdate;
						if (additionalFields.country) body.country = additionalFields.country;
						if (additionalFields.countryCode) body.countryCode = additionalFields.countryCode;
						if (additionalFields.state) body.state = additionalFields.state;
						if (additionalFields.city) body.city = additionalFields.city;
						if (additionalFields.address) body.address = additionalFields.address;
						if (additionalFields.postalCode) body.postalCode = additionalFields.postalCode;

						if (additionalFields.tags) {
							body.tags = parseTags(additionalFields.tags as string);
						}

						if (customPropertiesUi.property) {
							const customProperties: IDataObject = {};
							for (const prop of customPropertiesUi.property as IDataObject[]) {
								customProperties[prop.name as string] = prop.value;
							}
							body.customProperties = customProperties;
						}

						responseData = await omnisendApiRequest.call(this, 'POST', '/contacts', cleanObject(body));
					}

					if (operation === 'get') {
						const identifierType = this.getNodeParameter('identifierType', i) as string;
						let endpoint: string;

						if (identifierType === 'contactID') {
							const contactId = this.getNodeParameter('contactId', i) as string;
							endpoint = `/contacts/${contactId}`;
						} else {
							const email = this.getNodeParameter('email', i) as string;
							endpoint = `/contacts/${encodeURIComponent(email)}`;
						}

						responseData = await omnisendApiRequest.call(this, 'GET', endpoint);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = { ...filters };

						if (returnAll) {
							responseData = await omnisendApiRequestAllItems.call(
								this,
								'GET',
								'/contacts',
								'contacts',
								{},
								query,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await omnisendApiRequest.call(this, 'GET', '/contacts', {}, query);
							responseData = response.contacts as IDataObject[];
						}
					}

					if (operation === 'update') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};
						if (updateFields.firstName) body.firstName = updateFields.firstName;
						if (updateFields.lastName) body.lastName = updateFields.lastName;
						if (updateFields.gender) body.gender = updateFields.gender;
						if (updateFields.birthdate) body.birthdate = updateFields.birthdate;
						if (updateFields.country) body.country = updateFields.country;
						if (updateFields.countryCode) body.countryCode = updateFields.countryCode;
						if (updateFields.state) body.state = updateFields.state;
						if (updateFields.city) body.city = updateFields.city;
						if (updateFields.address) body.address = updateFields.address;
						if (updateFields.postalCode) body.postalCode = updateFields.postalCode;

						if (updateFields.tags) {
							body.tags = parseTags(updateFields.tags as string);
						}

						responseData = await omnisendApiRequest.call(
							this,
							'PATCH',
							`/contacts/${contactId}`,
							cleanObject(body),
						);
					}

					if (operation === 'delete') {
						const identifierType = this.getNodeParameter('identifierType', i) as string;
						let endpoint: string;

						if (identifierType === 'contactID') {
							const contactId = this.getNodeParameter('contactId', i) as string;
							endpoint = `/contacts/${contactId}`;
						} else {
							const email = this.getNodeParameter('email', i) as string;
							endpoint = `/contacts/${encodeURIComponent(email)}`;
						}

						responseData = await omnisendApiRequest.call(this, 'DELETE', endpoint);
						responseData = { success: true };
					}

					if (operation === 'getActivities') {
						const identifierType = this.getNodeParameter('identifierType', i) as string;
						let contactId: string;

						if (identifierType === 'contactID') {
							contactId = this.getNodeParameter('contactId', i) as string;
						} else {
							const email = this.getNodeParameter('email', i) as string;
							const contact = await omnisendApiRequest.call(
								this,
								'GET',
								`/contacts/${encodeURIComponent(email)}`,
							);
							contactId = contact.contactID as string;
						}

						responseData = await omnisendApiRequest.call(
							this,
							'GET',
							`/contacts/${contactId}/activities`,
						);
					}

					if (operation === 'addTag') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const tag = this.getNodeParameter('tag', i) as string;

						responseData = await omnisendApiRequest.call(
							this,
							'POST',
							`/contacts/${contactId}/tags`,
							{ tag },
						);
					}

					if (operation === 'removeTag') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const tag = this.getNodeParameter('tag', i) as string;

						responseData = await omnisendApiRequest.call(
							this,
							'DELETE',
							`/contacts/${contactId}/tags/${encodeURIComponent(tag)}`,
						);
						responseData = { success: true };
					}

					if (operation === 'updateIdentifiers') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const identifierType = this.getNodeParameter('identifierType', i) as string;

						const body: IDataObject = {
							type: identifierType,
						};

						if (identifierType === 'email') {
							body.id = this.getNodeParameter('newEmail', i) as string;
							body.channels = {
								email: { status: 'subscribed', statusDate: new Date().toISOString() },
							};
						} else {
							body.id = this.getNodeParameter('newPhone', i) as string;
							body.channels = {
								sms: { status: 'subscribed', statusDate: new Date().toISOString() },
							};
						}

						responseData = await omnisendApiRequest.call(
							this,
							'POST',
							`/contacts/${contactId}/identifiers`,
							body,
						);
					}
				}

				// ==================== CAMPAIGN ====================
				if (resource === 'campaign') {
					if (operation === 'get') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						responseData = await omnisendApiRequest.call(this, 'GET', `/campaigns/${campaignId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = { ...filters };

						if (returnAll) {
							responseData = await omnisendApiRequestAllItems.call(
								this,
								'GET',
								'/campaigns',
								'campaigns',
								{},
								query,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await omnisendApiRequest.call(this, 'GET', '/campaigns', {}, query);
							responseData = response.campaigns as IDataObject[];
						}
					}

					if (operation === 'getStats') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						responseData = await omnisendApiRequest.call(
							this,
							'GET',
							`/campaigns/${campaignId}/stats`,
						);
					}

					if (operation === 'cancel') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						responseData = await omnisendApiRequest.call(
							this,
							'POST',
							`/campaigns/${campaignId}/actions/cancel`,
						);
					}
				}

				// ==================== EVENT ====================
				if (resource === 'event') {
					if (operation === 'track') {
						const eventName = this.getNodeParameter('eventName', i) as string;
						const email = this.getNodeParameter('email', i) as string;
						const phone = this.getNodeParameter('phone', i) as string;
						let eventId = this.getNodeParameter('eventId', i) as string;
						const propertiesUi = this.getNodeParameter('properties', i) as IDataObject;

						if (!email && !phone) {
							throw new NodeOperationError(
								this.getNode(),
								'Either email or phone is required',
								{ itemIndex: i },
							);
						}

						if (!eventId) {
							eventId = generateEventId();
						}

						const properties: IDataObject = {};
						if (propertiesUi.property) {
							for (const prop of propertiesUi.property as IDataObject[]) {
								properties[prop.name as string] = prop.value;
							}
						}

						const body = buildEventPayload(eventName, eventId, email, phone, properties);
						responseData = await omnisendApiRequest.call(this, 'POST', '/events', cleanObject(body));
					}

					if (operation === 'trackOrder') {
						const email = this.getNodeParameter('email', i) as string;
						const phone = this.getNodeParameter('phone', i) as string;
						const orderId = this.getNodeParameter('orderId', i) as string;
						const totalPrice = this.getNodeParameter('totalPrice', i) as number;
						const currency = this.getNodeParameter('currency', i) as string;
						const additionalFields = this.getNodeParameter('orderAdditionalFields', i) as IDataObject;
						const lineItemsUi = this.getNodeParameter('lineItems', i) as IDataObject;

						if (!email && !phone) {
							throw new NodeOperationError(
								this.getNode(),
								'Either email or phone is required',
								{ itemIndex: i },
							);
						}

						const orderProperties: IDataObject = {
							orderID: orderId,
							totalPrice,
							currency,
							...additionalFields,
						};

						if (lineItemsUi.item) {
							orderProperties.lineItems = buildLineItems(lineItemsUi.item as IDataObject[]);
						}

						const body = buildEventPayload(
							'placed order',
							orderId,
							email,
							phone,
							orderProperties,
						);

						responseData = await omnisendApiRequest.call(this, 'POST', '/events', cleanObject(body));
					}

					if (operation === 'trackCart') {
						const email = this.getNodeParameter('email', i) as string;
						const phone = this.getNodeParameter('phone', i) as string;
						const cartId = this.getNodeParameter('cartId', i) as string;
						const cartSum = this.getNodeParameter('cartSum', i) as number;
						const currency = this.getNodeParameter('currency', i) as string;
						const cartRecoveryUrl = this.getNodeParameter('cartRecoveryUrl', i) as string;
						const lineItemsUi = this.getNodeParameter('lineItems', i) as IDataObject;

						if (!email && !phone) {
							throw new NodeOperationError(
								this.getNode(),
								'Either email or phone is required',
								{ itemIndex: i },
							);
						}

						const cartProperties: IDataObject = {
							cartID: cartId,
							cartSum,
							currency,
						};

						if (cartRecoveryUrl) {
							cartProperties.cartRecoveryUrl = cartRecoveryUrl;
						}

						if (lineItemsUi.item) {
							cartProperties.lineItems = buildLineItems(lineItemsUi.item as IDataObject[]);
						}

						const body = buildEventPayload(
							'added product to cart',
							cartId,
							email,
							phone,
							cartProperties,
						);

						responseData = await omnisendApiRequest.call(this, 'POST', '/events', cleanObject(body));
					}

					if (operation === 'trackProductView') {
						const email = this.getNodeParameter('email', i) as string;
						const phone = this.getNodeParameter('phone', i) as string;
						const productId = this.getNodeParameter('productId', i) as string;
						const productTitle = this.getNodeParameter('productTitle', i) as string;
						const additionalFields = this.getNodeParameter('productAdditionalFields', i) as IDataObject;

						if (!email && !phone) {
							throw new NodeOperationError(
								this.getNode(),
								'Either email or phone is required',
								{ itemIndex: i },
							);
						}

						const viewProperties: IDataObject = {
							productID: productId,
							productTitle,
							...additionalFields,
						};

						const body = buildEventPayload(
							'viewed product',
							generateEventId('view'),
							email,
							phone,
							viewProperties,
						);

						responseData = await omnisendApiRequest.call(this, 'POST', '/events', cleanObject(body));
					}

					if (operation === 'getAll') {
						const identifierType = this.getNodeParameter('identifierType', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						let contactId: string;

						if (identifierType === 'contactID') {
							contactId = this.getNodeParameter('contactId', i) as string;
						} else {
							const email = this.getNodeParameter('email', i) as string;
							const contact = await omnisendApiRequest.call(
								this,
								'GET',
								`/contacts/${encodeURIComponent(email)}`,
							);
							contactId = contact.contactID as string;
						}

						if (returnAll) {
							responseData = await omnisendApiRequestAllItems.call(
								this,
								'GET',
								`/contacts/${contactId}/events`,
								'events',
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await omnisendApiRequest.call(
								this,
								'GET',
								`/contacts/${contactId}/events`,
								{},
								{ limit },
							);
							responseData = response.events as IDataObject[];
						}
					}
				}

				// ==================== PRODUCT ====================
				if (resource === 'product') {
					if (operation === 'create') {
						const productId = this.getNodeParameter('productId', i) as string;
						const title = this.getNodeParameter('title', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const variantsUi = this.getNodeParameter('variants', i) as IDataObject;

						const body: IDataObject = {
							productID: productId,
							title,
							...additionalFields,
						};

						if (additionalFields.categoryIDs) {
							body.categoryIDs = parseTags(additionalFields.categoryIDs as string);
						}

						if (additionalFields.tags) {
							body.tags = parseTags(additionalFields.tags as string);
						}

						if (variantsUi.variant) {
							body.variants = variantsUi.variant;
						}

						responseData = await omnisendApiRequest.call(this, 'POST', '/products', cleanObject(body));
					}

					if (operation === 'get') {
						const productId = this.getNodeParameter('productId', i) as string;
						responseData = await omnisendApiRequest.call(this, 'GET', `/products/${productId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await omnisendApiRequestAllItems.call(
								this,
								'GET',
								'/products',
								'products',
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await omnisendApiRequest.call(
								this,
								'GET',
								'/products',
								{},
								{ limit },
							);
							responseData = response.products as IDataObject[];
						}
					}

					if (operation === 'update') {
						const productId = this.getNodeParameter('productId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						const variantsUi = this.getNodeParameter('variants', i) as IDataObject;

						const body: IDataObject = { ...updateFields };

						if (updateFields.categoryIDs) {
							body.categoryIDs = parseTags(updateFields.categoryIDs as string);
						}

						if (updateFields.tags) {
							body.tags = parseTags(updateFields.tags as string);
						}

						if (variantsUi.variant) {
							body.variants = variantsUi.variant;
						}

						responseData = await omnisendApiRequest.call(
							this,
							'PUT',
							`/products/${productId}`,
							cleanObject(body),
						);
					}

					if (operation === 'delete') {
						const productId = this.getNodeParameter('productId', i) as string;
						responseData = await omnisendApiRequest.call(this, 'DELETE', `/products/${productId}`);
						responseData = { success: true };
					}

					if (operation === 'sync') {
						const productsJson = this.getNodeParameter('productsJson', i) as string;
						const products = JSON.parse(productsJson);
						responseData = await omnisendApiRequest.call(this, 'POST', '/products/batch', {
							products,
						});
					}
				}

				// ==================== CATEGORY ====================
				if (resource === 'category') {
					if (operation === 'create') {
						const categoryId = this.getNodeParameter('categoryId', i) as string;
						const title = this.getNodeParameter('title', i) as string;

						responseData = await omnisendApiRequest.call(this, 'POST', '/categories', {
							categoryID: categoryId,
							title,
						});
					}

					if (operation === 'get') {
						const categoryId = this.getNodeParameter('categoryId', i) as string;
						responseData = await omnisendApiRequest.call(this, 'GET', `/categories/${categoryId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await omnisendApiRequestAllItems.call(
								this,
								'GET',
								'/categories',
								'categories',
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await omnisendApiRequest.call(
								this,
								'GET',
								'/categories',
								{},
								{ limit },
							);
							responseData = response.categories as IDataObject[];
						}
					}

					if (operation === 'update') {
						const categoryId = this.getNodeParameter('categoryId', i) as string;
						const title = this.getNodeParameter('title', i) as string;

						responseData = await omnisendApiRequest.call(
							this,
							'PUT',
							`/categories/${categoryId}`,
							{ title },
						);
					}

					if (operation === 'delete') {
						const categoryId = this.getNodeParameter('categoryId', i) as string;
						responseData = await omnisendApiRequest.call(
							this,
							'DELETE',
							`/categories/${categoryId}`,
						);
						responseData = { success: true };
					}
				}

				// ==================== ORDER ====================
				if (resource === 'order') {
					if (operation === 'create') {
						const orderId = this.getNodeParameter('orderId', i) as string;
						const email = this.getNodeParameter('email', i) as string;
						const currency = this.getNodeParameter('currency', i) as string;
						const orderSum = this.getNodeParameter('orderSum', i) as number;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const lineItemsUi = this.getNodeParameter('lineItems', i) as IDataObject;
						const shippingAddress = this.getNodeParameter('shippingAddress', i) as IDataObject;
						const billingAddress = this.getNodeParameter('billingAddress', i) as IDataObject;

						const body: IDataObject = {
							orderID: orderId,
							email,
							currency,
							orderSum,
							...additionalFields,
						};

						if (additionalFields.tags) {
							body.tags = parseTags(additionalFields.tags as string);
						}

						if (lineItemsUi.item) {
							body.products = buildLineItems(lineItemsUi.item as IDataObject[]);
						}

						if (Object.keys(shippingAddress).length > 0) {
							body.shippingAddress = buildAddress(shippingAddress);
						}

						if (Object.keys(billingAddress).length > 0) {
							body.billingAddress = buildAddress(billingAddress);
						}

						responseData = await omnisendApiRequest.call(this, 'POST', '/orders', cleanObject(body));
					}

					if (operation === 'get') {
						const orderId = this.getNodeParameter('orderId', i) as string;
						responseData = await omnisendApiRequest.call(this, 'GET', `/orders/${orderId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = { ...filters };

						if (returnAll) {
							responseData = await omnisendApiRequestAllItems.call(
								this,
								'GET',
								'/orders',
								'orders',
								{},
								query,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await omnisendApiRequest.call(this, 'GET', '/orders', {}, query);
							responseData = response.orders as IDataObject[];
						}
					}

					if (operation === 'update') {
						const orderId = this.getNodeParameter('orderId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = { ...updateFields };

						if (updateFields.tags) {
							body.tags = parseTags(updateFields.tags as string);
						}

						responseData = await omnisendApiRequest.call(
							this,
							'PATCH',
							`/orders/${orderId}`,
							cleanObject(body),
						);
					}

					if (operation === 'delete') {
						const orderId = this.getNodeParameter('orderId', i) as string;
						responseData = await omnisendApiRequest.call(this, 'DELETE', `/orders/${orderId}`);
						responseData = { success: true };
					}
				}

				// ==================== CART ====================
				if (resource === 'cart') {
					if (operation === 'create') {
						const cartId = this.getNodeParameter('cartId', i) as string;
						const email = this.getNodeParameter('email', i) as string;
						const phone = this.getNodeParameter('phone', i) as string;
						const currency = this.getNodeParameter('currency', i) as string;
						const cartSum = this.getNodeParameter('cartSum', i) as number;
						const cartRecoveryUrl = this.getNodeParameter('cartRecoveryUrl', i) as string;
						const lineItemsUi = this.getNodeParameter('lineItems', i) as IDataObject;

						if (!email && !phone) {
							throw new NodeOperationError(
								this.getNode(),
								'Either email or phone is required',
								{ itemIndex: i },
							);
						}

						const body: IDataObject = {
							cartID: cartId,
							currency,
							cartSum,
						};

						if (email) body.email = email;
						if (phone) body.phone = phone;
						if (cartRecoveryUrl) body.cartRecoveryUrl = cartRecoveryUrl;

						if (lineItemsUi.item) {
							body.products = buildLineItems(lineItemsUi.item as IDataObject[]);
						}

						responseData = await omnisendApiRequest.call(this, 'POST', '/carts', cleanObject(body));
					}

					if (operation === 'get') {
						const cartId = this.getNodeParameter('cartId', i) as string;
						responseData = await omnisendApiRequest.call(this, 'GET', `/carts/${cartId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = { ...filters };

						if (returnAll) {
							responseData = await omnisendApiRequestAllItems.call(
								this,
								'GET',
								'/carts',
								'carts',
								{},
								query,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await omnisendApiRequest.call(this, 'GET', '/carts', {}, query);
							responseData = response.carts as IDataObject[];
						}
					}

					if (operation === 'update') {
						const cartId = this.getNodeParameter('cartId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						const lineItemsUi = this.getNodeParameter('lineItems', i) as IDataObject;

						const body: IDataObject = { ...updateFields };

						if (lineItemsUi.item) {
							body.products = buildLineItems(lineItemsUi.item as IDataObject[]);
						}

						responseData = await omnisendApiRequest.call(
							this,
							'PUT',
							`/carts/${cartId}`,
							cleanObject(body),
						);
					}

					if (operation === 'delete') {
						const cartId = this.getNodeParameter('cartId', i) as string;
						responseData = await omnisendApiRequest.call(this, 'DELETE', `/carts/${cartId}`);
						responseData = { success: true };
					}
				}

				// ==================== AUTOMATION ====================
				if (resource === 'automation') {
					if (operation === 'get') {
						const automationId = this.getNodeParameter('automationId', i) as string;
						responseData = await omnisendApiRequest.call(
							this,
							'GET',
							`/automations/${automationId}`,
						);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = { ...filters };

						if (returnAll) {
							responseData = await omnisendApiRequestAllItems.call(
								this,
								'GET',
								'/automations',
								'automations',
								{},
								query,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await omnisendApiRequest.call(
								this,
								'GET',
								'/automations',
								{},
								query,
							);
							responseData = response.automations as IDataObject[];
						}
					}

					if (operation === 'getStats') {
						const automationId = this.getNodeParameter('automationId', i) as string;
						responseData = await omnisendApiRequest.call(
							this,
							'GET',
							`/automations/${automationId}/stats`,
						);
					}

					if (operation === 'trigger') {
						const automationId = this.getNodeParameter('automationId', i) as string;
						const email = this.getNodeParameter('email', i) as string;
						const phone = this.getNodeParameter('phone', i) as string;
						const triggerDataUi = this.getNodeParameter('triggerData', i) as IDataObject;

						if (!email && !phone) {
							throw new NodeOperationError(
								this.getNode(),
								'Either email or phone is required',
								{ itemIndex: i },
							);
						}

						const body: IDataObject = {};
						if (email) body.email = email;
						if (phone) body.phone = phone;

						if (triggerDataUi.data) {
							const properties: IDataObject = {};
							for (const prop of triggerDataUi.data as IDataObject[]) {
								properties[prop.name as string] = prop.value;
							}
							body.properties = properties;
						}

						responseData = await omnisendApiRequest.call(
							this,
							'POST',
							`/automations/${automationId}/trigger`,
							cleanObject(body),
						);
					}
				}

				// ==================== SEGMENT ====================
				if (resource === 'segment') {
					if (operation === 'get') {
						const segmentId = this.getNodeParameter('segmentId', i) as string;
						responseData = await omnisendApiRequest.call(this, 'GET', `/segments/${segmentId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = { ...filters };

						if (returnAll) {
							responseData = await omnisendApiRequestAllItems.call(
								this,
								'GET',
								'/segments',
								'segments',
								{},
								query,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await omnisendApiRequest.call(this, 'GET', '/segments', {}, query);
							responseData = response.segments as IDataObject[];
						}
					}

					if (operation === 'getContacts') {
						const segmentId = this.getNodeParameter('segmentId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await omnisendApiRequestAllItems.call(
								this,
								'GET',
								`/segments/${segmentId}/contacts`,
								'contacts',
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await omnisendApiRequest.call(
								this,
								'GET',
								`/segments/${segmentId}/contacts`,
								{},
								{ limit },
							);
							responseData = response.contacts as IDataObject[];
						}
					}
				}

				// ==================== FORM ====================
				if (resource === 'form') {
					if (operation === 'get') {
						const formId = this.getNodeParameter('formId', i) as string;
						responseData = await omnisendApiRequest.call(this, 'GET', `/forms/${formId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = { ...filters };

						if (returnAll) {
							responseData = await omnisendApiRequestAllItems.call(
								this,
								'GET',
								'/forms',
								'forms',
								{},
								query,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await omnisendApiRequest.call(this, 'GET', '/forms', {}, query);
							responseData = response.forms as IDataObject[];
						}
					}

					if (operation === 'getStats') {
						const formId = this.getNodeParameter('formId', i) as string;
						responseData = await omnisendApiRequest.call(this, 'GET', `/forms/${formId}/stats`);
					}
				}

				// Return data
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
