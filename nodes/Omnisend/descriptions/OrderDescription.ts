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

export const orderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['order'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new order',
				action: 'Create an order',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an order',
				action: 'Delete an order',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an order by ID',
				action: 'Get an order',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many orders',
				action: 'Get many orders',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an order',
				action: 'Update an order',
			},
		],
		default: 'getAll',
	},
];

export const orderFields: INodeProperties[] = [
	// ----------------------------------
	//         order: create
	// ----------------------------------
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Unique order identifier (your order number)',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Customer email address',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['create'],
			},
		},
		default: 'USD',
		description: 'Currency code (e.g., USD, EUR)',
	},
	{
		displayName: 'Order Sum',
		name: 'orderSum',
		type: 'number',
		typeOptions: {
			numberPrecision: 2,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['create'],
			},
		},
		default: 0,
		description: 'Total order amount',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Cancel Reason',
				name: 'cancelReason',
				type: 'string',
				default: '',
				description: 'Reason for cancellation',
			},
			{
				displayName: 'Contact Note',
				name: 'contactNote',
				type: 'string',
				default: '',
				description: 'Note about the customer',
			},
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
				displayName: 'Note',
				name: 'note',
				type: 'string',
				default: '',
				description: 'Order note',
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
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Customer phone in E.164 format',
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
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags',
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
				resource: ['order'],
				operation: ['create'],
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
		description: 'Items in the order',
	},
	{
		displayName: 'Shipping Address',
		name: 'shippingAddress',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Address 1',
				name: 'address1',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Address 2',
				name: 'address2',
				type: 'string',
				default: '',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Country Code',
				name: 'countryCode',
				type: 'string',
				default: '',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
			},
			{
				displayName: 'State Code',
				name: 'stateCode',
				type: 'string',
				default: '',
			},
			{
				displayName: 'ZIP',
				name: 'zip',
				type: 'string',
				default: '',
			},
		],
	},
	{
		displayName: 'Billing Address',
		name: 'billingAddress',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Address 1',
				name: 'address1',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Address 2',
				name: 'address2',
				type: 'string',
				default: '',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Country Code',
				name: 'countryCode',
				type: 'string',
				default: '',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
			},
			{
				displayName: 'State Code',
				name: 'stateCode',
				type: 'string',
				default: '',
			},
			{
				displayName: 'ZIP',
				name: 'zip',
				type: 'string',
				default: '',
			},
		],
	},

	// ----------------------------------
	//         order: get / delete
	// ----------------------------------
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['get', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the order',
	},

	// ----------------------------------
	//         order: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['order'],
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
				resource: ['order'],
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
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Filter by customer email',
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
				default: '',
				description: 'Filter by fulfillment status',
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
				default: '',
				description: 'Filter by payment status',
			},
		],
	},

	// ----------------------------------
	//         order: update
	// ----------------------------------
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The ID of the order to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Cancel Reason',
				name: 'cancelReason',
				type: 'string',
				default: '',
				description: 'Reason for cancellation',
			},
			{
				displayName: 'Cancelled At',
				name: 'cancelledAt',
				type: 'dateTime',
				default: '',
				description: 'When the order was cancelled',
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
				default: '',
				description: 'Order fulfillment status',
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				default: '',
				description: 'Order note',
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
				default: '',
				description: 'Payment status',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags',
			},
		],
	},
];
