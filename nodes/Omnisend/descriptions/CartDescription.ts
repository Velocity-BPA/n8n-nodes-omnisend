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

export const cartOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['cart'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Track a cart',
				action: 'Create a cart',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Remove a cart',
				action: 'Delete a cart',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a cart by ID',
				action: 'Get a cart',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get abandoned carts',
				action: 'Get many carts',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a cart',
				action: 'Update a cart',
			},
		],
		default: 'getAll',
	},
];

export const cartFields: INodeProperties[] = [
	// ----------------------------------
	//         cart: create
	// ----------------------------------
	{
		displayName: 'Cart ID',
		name: 'cartId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['cart'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Unique cart identifier',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		displayOptions: {
			show: {
				resource: ['cart'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Customer email (required if phone not provided)',
	},
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['cart'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Customer phone in E.164 format (required if email not provided)',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['cart'],
				operation: ['create'],
			},
		},
		default: 'USD',
		description: 'Currency code (e.g., USD, EUR)',
	},
	{
		displayName: 'Cart Sum',
		name: 'cartSum',
		type: 'number',
		typeOptions: {
			numberPrecision: 2,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['cart'],
				operation: ['create'],
			},
		},
		default: 0,
		description: 'Total cart value',
	},
	{
		displayName: 'Cart Recovery URL',
		name: 'cartRecoveryUrl',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['cart'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'URL to recover the abandoned cart',
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
				resource: ['cart'],
				operation: ['create', 'update'],
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
				],
			},
		],
		description: 'Items in the cart',
	},

	// ----------------------------------
	//         cart: get / delete
	// ----------------------------------
	{
		displayName: 'Cart ID',
		name: 'cartId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['cart'],
				operation: ['get', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the cart',
	},

	// ----------------------------------
	//         cart: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['cart'],
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
				resource: ['cart'],
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
				resource: ['cart'],
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
		],
	},

	// ----------------------------------
	//         cart: update
	// ----------------------------------
	{
		displayName: 'Cart ID',
		name: 'cartId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['cart'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The ID of the cart to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['cart'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Cart Recovery URL',
				name: 'cartRecoveryUrl',
				type: 'string',
				default: '',
				description: 'URL to recover the cart',
			},
			{
				displayName: 'Cart Sum',
				name: 'cartSum',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: 0,
				description: 'Total cart value',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: '',
				description: 'Currency code',
			},
		],
	},
];
