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

export const automationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['automation'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get an automation by ID',
				action: 'Get an automation',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many automations',
				action: 'Get many automations',
			},
			{
				name: 'Get Stats',
				value: 'getStats',
				description: 'Get automation performance data',
				action: 'Get automation stats',
			},
			{
				name: 'Trigger',
				value: 'trigger',
				description: 'Trigger a custom automation',
				action: 'Trigger an automation',
			},
		],
		default: 'getAll',
	},
];

export const automationFields: INodeProperties[] = [
	// ----------------------------------
	//         automation: get / getStats
	// ----------------------------------
	{
		displayName: 'Automation ID',
		name: 'automationId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['get', 'getStats'],
			},
		},
		default: '',
		description: 'The ID of the automation',
	},

	// ----------------------------------
	//         automation: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['automation'],
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
				resource: ['automation'],
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
				resource: ['automation'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Started', value: 'started' },
					{ name: 'Paused', value: 'paused' },
					{ name: 'Draft', value: 'draft' },
				],
				default: '',
				description: 'Filter by automation status',
			},
		],
	},

	// ----------------------------------
	//         automation: trigger
	// ----------------------------------
	{
		displayName: 'Automation ID',
		name: 'automationId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['trigger'],
			},
		},
		default: '',
		description: 'The ID of the automation to trigger',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['trigger'],
			},
		},
		default: '',
		description: 'Email of the contact to trigger (required if phone not provided)',
	},
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['trigger'],
			},
		},
		default: '',
		description: 'Phone in E.164 format (required if email not provided)',
	},
	{
		displayName: 'Trigger Data',
		name: 'triggerData',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Data',
		default: {},
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['trigger'],
			},
		},
		options: [
			{
				name: 'data',
				displayName: 'Data',
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
		description: 'Additional data to pass to the automation',
	},
];
