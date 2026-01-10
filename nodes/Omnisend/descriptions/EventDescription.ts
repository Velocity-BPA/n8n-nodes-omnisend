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

import type { INodeProperties } from 'n8n-workflow';

export const eventOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['event'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get events for a contact',
				action: 'Get many events',
			},
			{
				name: 'Track',
				value: 'track',
				description: 'Send a custom event',
				action: 'Track an event',
			},
			{
				name: 'Track Cart',
				value: 'trackCart',
				description: 'Send cart data',
				action: 'Track cart event',
			},
			{
				name: 'Track Order',
				value: 'trackOrder',
				description: 'Send order data',
				action: 'Track order event',
			},
			{
				name: 'Track Product View',
				value: 'trackProductView',
				description: 'Send product view data',
				action: 'Track product view event',
			},
		],
		default: 'track',
	},
];

export const eventFields: INodeProperties[] = [
	// ----------------------------------
	//         event: track (custom event)
	// ----------------------------------
	{
		displayName: 'Event Name',
		name: 'eventName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['track'],
			},
		},
		default: '',
		description: 'Name of the custom event',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['track', 'trackCart', 'trackOrder', 'trackProductView'],
			},
		},
		default: '',
		description: 'Email address of the contact (required if phone not provided)',
	},
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['track', 'trackCart', 'trackOrder', 'trackProductView'],
			},
		},
		default: '',
		description: 'Phone number in E.164 format (required if email not provided)',
	},
	{
		displayName: 'Event ID',
		name: 'eventId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['track'],
			},
		},
		default: '',
		description: 'Unique identifier for this event (auto-generated if not provided)',
	},
	{
		displayName: 'Properties',
		name: 'properties',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Property',
		default: {},
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['track'],
			},
		},
		options: [
			{
				name: 'property',
				displayName: 'Property',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Property name',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Property value',
					},
				],
			},
		],
		description: 'Custom properties for the event',
	},

	// ----------------------------------
	//         event: trackOrder
	// ----------------------------------
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['trackOrder'],
			},
		},
		default: '',
		description: 'Unique order identifier',
	},
	{
		displayName: 'Total Price',
		name: 'totalPrice',
		type: 'number',
		required: true,
		typeOptions: {
			numberPrecision: 2,
		},
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['trackOrder'],
			},
		},
		default: 0,
		description: 'Total order amount',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['trackOrder'],
			},
		},
		default: 'USD',
		description: 'Currency code (e.g., USD, EUR)',
	},
	{
		displayName: 'Order Additional Fields',
		name: 'orderAdditionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['trackOrder'],
			},
		},
		options: [
			{
				displayName: 'Discount Sum',
				name: 'discountSum',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: 0,
				description: 'Total discount amount',
			},
			{
				displayName: 'Fulfillment Status',
				name: 'fulfillmentStatus',
				type: 'options',
				options: [
					{ name: 'Fulfilled', value: 'fulfilled' },
					{ name: 'Unfulfilled', value: 'unfulfilled' },
					{ name: 'Partially Fulfilled', value: 'partiallyFulfilled' },
				],
				default: 'unfulfilled',
				description: 'Order fulfillment status',
			},
			{
				displayName: 'Order Number',
				name: 'orderNumber',
				type: 'string',
				default: '',
				description: 'Display order number',
			},
			{
				displayName: 'Order Status URL',
				name: 'orderStatusUrl',
				type: 'string',
				default: '',
				description: 'URL to check order status',
			},
			{
				displayName: 'Payment Status',
				name: 'paymentStatus',
				type: 'options',
				options: [
					{ name: 'Paid', value: 'paid' },
					{ name: 'Partially Paid', value: 'partiallyPaid' },
					{ name: 'Unpaid', value: 'unpaid' },
					{ name: 'Refunded', value: 'refunded' },
				],
				default: 'paid',
				description: 'Payment status',
			},
			{
				displayName: 'Shipping Sum',
				name: 'shippingSum',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: 0,
				description: 'Shipping cost',
			},
			{
				displayName: 'Sub-Total Sum',
				name: 'subTotalSum',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: 0,
				description: 'Sub-total before taxes/shipping',
			},
			{
				displayName: 'Tax Sum',
				name: 'taxSum',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: 0,
				description: 'Tax amount',
			},
		],
	},
	{
		displayName: 'Line Items',
		name: 'lineItems',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Line Item',
		default: {},
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['trackOrder', 'trackCart'],
			},
		},
		options: [
			{
				name: 'item',
				displayName: 'Item',
				values: [
					{
						displayName: 'Product ID',
						name: 'productID',
						type: 'string',
						required: true,
						default: '',
						description: 'Product SKU or ID',
					},
					{
						displayName: 'Product Title',
						name: 'productTitle',
						type: 'string',
						required: true,
						default: '',
						description: 'Product name',
					},
					{
						displayName: 'Product Price',
						name: 'productPrice',
						type: 'number',
						typeOptions: {
							numberPrecision: 2,
						},
						required: true,
						default: 0,
						description: 'Price per unit',
					},
					{
						displayName: 'Quantity',
						name: 'quantity',
						type: 'number',
						required: true,
						default: 1,
						description: 'Number of units',
					},
					{
						displayName: 'Product URL',
						name: 'productUrl',
						type: 'string',
						default: '',
						description: 'URL to product page',
					},
					{
						displayName: 'Image URL',
						name: 'imageUrl',
						type: 'string',
						default: '',
						description: 'Product image URL',
					},
					{
						displayName: 'SKU',
						name: 'sku',
						type: 'string',
						default: '',
						description: 'Product SKU',
					},
					{
						displayName: 'Variant ID',
						name: 'variantID',
						type: 'string',
						default: '',
						description: 'Variant identifier',
					},
					{
						displayName: 'Variant Title',
						name: 'variantTitle',
						type: 'string',
						default: '',
						description: 'Variant name',
					},
					{
						displayName: 'Discount',
						name: 'discount',
						type: 'number',
						typeOptions: {
							numberPrecision: 2,
						},
						default: 0,
						description: 'Discount on this item',
					},
				],
			},
		],
		description: 'Items in the order or cart',
	},

	// ----------------------------------
	//         event: trackCart
	// ----------------------------------
	{
		displayName: 'Cart ID',
		name: 'cartId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['trackCart'],
			},
		},
		default: '',
		description: 'Unique cart identifier',
	},
	{
		displayName: 'Cart Sum',
		name: 'cartSum',
		type: 'number',
		required: true,
		typeOptions: {
			numberPrecision: 2,
		},
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['trackCart'],
			},
		},
		default: 0,
		description: 'Total cart value',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['trackCart'],
			},
		},
		default: 'USD',
		description: 'Currency code (e.g., USD, EUR)',
	},
	{
		displayName: 'Cart Recovery URL',
		name: 'cartRecoveryUrl',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['trackCart'],
			},
		},
		default: '',
		description: 'URL to recover the abandoned cart',
	},

	// ----------------------------------
	//         event: trackProductView
	// ----------------------------------
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['trackProductView'],
			},
		},
		default: '',
		description: 'Product SKU or ID',
	},
	{
		displayName: 'Product Title',
		name: 'productTitle',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['trackProductView'],
			},
		},
		default: '',
		description: 'Product name',
	},
	{
		displayName: 'Product Additional Fields',
		name: 'productAdditionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['trackProductView'],
			},
		},
		options: [
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: 'USD',
				description: 'Currency code',
			},
			{
				displayName: 'Image URL',
				name: 'imageUrl',
				type: 'string',
				default: '',
				description: 'Product image URL',
			},
			{
				displayName: 'Old Price',
				name: 'oldPrice',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: 0,
				description: 'Original price (for sale items)',
			},
			{
				displayName: 'Price',
				name: 'price',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: 0,
				description: 'Current price',
			},
			{
				displayName: 'Product URL',
				name: 'productUrl',
				type: 'string',
				default: '',
				description: 'URL to product page',
			},
			{
				displayName: 'Vendor',
				name: 'vendor',
				type: 'string',
				default: '',
				description: 'Brand or vendor name',
			},
		],
	},

	// ----------------------------------
	//         event: getAll
	// ----------------------------------
	{
		displayName: 'Identifier Type',
		name: 'identifierType',
		type: 'options',
		options: [
			{ name: 'Contact ID', value: 'contactID' },
			{ name: 'Email', value: 'email' },
		],
		required: true,
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['getAll'],
			},
		},
		default: 'email',
		description: 'How to identify the contact',
	},
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['getAll'],
				identifierType: ['contactID'],
			},
		},
		default: '',
		description: 'The ID of the contact',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['getAll'],
				identifierType: ['email'],
			},
		},
		default: '',
		description: 'Email address of the contact',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 250,
		},
		default: 50,
		description: 'Max number of results to return',
	},
];
