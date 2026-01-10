/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { Omnisend } from '../../nodes/Omnisend/Omnisend.node';
import type { INodeTypeDescription } from 'n8n-workflow';

describe('Omnisend Node', () => {
	let omnisendNode: Omnisend;
	let description: INodeTypeDescription;

	beforeAll(() => {
		omnisendNode = new Omnisend();
		description = omnisendNode.description;
	});

	describe('Node Configuration', () => {
		it('should have correct node name', () => {
			expect(description.name).toBe('omnisend');
		});

		it('should have correct display name', () => {
			expect(description.displayName).toBe('Omnisend');
		});

		it('should have correct node icon', () => {
			expect(description.icon).toBe('file:omnisend.svg');
		});

		it('should have correct group', () => {
			expect(description.group).toContain('transform');
		});

		it('should have correct version', () => {
			expect(description.version).toBe(1);
		});

		it('should require omnisendApi credentials', () => {
			expect(description.credentials).toEqual([
				{
					name: 'omnisendApi',
					required: true,
				},
			]);
		});

		it('should have main input and output', () => {
			expect(description.inputs).toEqual(['main']);
			expect(description.outputs).toEqual(['main']);
		});
	});

	describe('Resources', () => {
		it('should have resource property', () => {
			const resourceProperty = description.properties.find((p) => p.name === 'resource');
			expect(resourceProperty).toBeDefined();
		});

		it('should have 10 resources', () => {
			const resourceProperty = description.properties.find((p) => p.name === 'resource');
			expect(resourceProperty?.options).toHaveLength(10);
		});

		it('should include all expected resources', () => {
			const resourceProperty = description.properties.find((p) => p.name === 'resource');
			const options = resourceProperty?.options as Array<{ value: string }> | undefined;

			const expectedResources = [
				'contact',
				'campaign',
				'event',
				'product',
				'category',
				'order',
				'cart',
				'automation',
				'segment',
				'form',
			];

			expectedResources.forEach((resource) => {
				expect(options?.some((o) => o.value === resource)).toBe(true);
			});
		});
	});

	describe('Contact Operations', () => {
		it('should have contact operations', () => {
			const operationProperty = description.properties.find(
				(p) =>
					p.name === 'operation' &&
					(p.displayOptions?.show?.resource as string[] | undefined)?.includes('contact')
			);
			expect(operationProperty).toBeDefined();
		});

		it('should include expected contact operations', () => {
			const operationProperty = description.properties.find(
				(p) =>
					p.name === 'operation' &&
					(p.displayOptions?.show?.resource as string[] | undefined)?.includes('contact')
			);
			const options = operationProperty?.options as Array<{ value: string }> | undefined;

			const expectedOperations = [
				'create',
				'get',
				'getAll',
				'update',
				'delete',
				'getActivities',
				'addTag',
				'removeTag',
				'updateIdentifiers',
			];

			expectedOperations.forEach((operation) => {
				expect(options?.some((o) => o.value === operation)).toBe(true);
			});
		});
	});

	describe('Event Operations', () => {
		it('should have event operations', () => {
			const operationProperty = description.properties.find(
				(p) =>
					p.name === 'operation' &&
					(p.displayOptions?.show?.resource as string[] | undefined)?.includes('event')
			);
			expect(operationProperty).toBeDefined();
		});

		it('should include expected event operations', () => {
			const operationProperty = description.properties.find(
				(p) =>
					p.name === 'operation' &&
					(p.displayOptions?.show?.resource as string[] | undefined)?.includes('event')
			);
			const options = operationProperty?.options as Array<{ value: string }> | undefined;

			const expectedOperations = [
				'track',
				'trackOrder',
				'trackCart',
				'trackProductView',
				'getAll',
			];

			expectedOperations.forEach((operation) => {
				expect(options?.some((o) => o.value === operation)).toBe(true);
			});
		});
	});

	describe('Product Operations', () => {
		it('should have product operations', () => {
			const operationProperty = description.properties.find(
				(p) =>
					p.name === 'operation' &&
					(p.displayOptions?.show?.resource as string[] | undefined)?.includes('product')
			);
			expect(operationProperty).toBeDefined();
		});

		it('should include expected product operations', () => {
			const operationProperty = description.properties.find(
				(p) =>
					p.name === 'operation' &&
					(p.displayOptions?.show?.resource as string[] | undefined)?.includes('product')
			);
			const options = operationProperty?.options as Array<{ value: string }> | undefined;

			const expectedOperations = ['create', 'get', 'getAll', 'update', 'delete', 'sync'];

			expectedOperations.forEach((operation) => {
				expect(options?.some((o) => o.value === operation)).toBe(true);
			});
		});
	});

	describe('Order Operations', () => {
		it('should have order operations', () => {
			const operationProperty = description.properties.find(
				(p) =>
					p.name === 'operation' &&
					(p.displayOptions?.show?.resource as string[] | undefined)?.includes('order')
			);
			expect(operationProperty).toBeDefined();
		});

		it('should include expected order operations', () => {
			const operationProperty = description.properties.find(
				(p) =>
					p.name === 'operation' &&
					(p.displayOptions?.show?.resource as string[] | undefined)?.includes('order')
			);
			const options = operationProperty?.options as Array<{ value: string }> | undefined;

			const expectedOperations = ['create', 'get', 'getAll', 'update', 'delete'];

			expectedOperations.forEach((operation) => {
				expect(options?.some((o) => o.value === operation)).toBe(true);
			});
		});
	});

	describe('Automation Operations', () => {
		it('should have automation operations', () => {
			const operationProperty = description.properties.find(
				(p) =>
					p.name === 'operation' &&
					(p.displayOptions?.show?.resource as string[] | undefined)?.includes('automation')
			);
			expect(operationProperty).toBeDefined();
		});

		it('should include expected automation operations', () => {
			const operationProperty = description.properties.find(
				(p) =>
					p.name === 'operation' &&
					(p.displayOptions?.show?.resource as string[] | undefined)?.includes('automation')
			);
			const options = operationProperty?.options as Array<{ value: string }> | undefined;

			const expectedOperations = ['get', 'getAll', 'getStats', 'trigger'];

			expectedOperations.forEach((operation) => {
				expect(options?.some((o) => o.value === operation)).toBe(true);
			});
		});
	});

	describe('Campaign Operations', () => {
		it('should have campaign operations', () => {
			const operationProperty = description.properties.find(
				(p) =>
					p.name === 'operation' &&
					(p.displayOptions?.show?.resource as string[] | undefined)?.includes('campaign')
			);
			expect(operationProperty).toBeDefined();
		});

		it('should include expected campaign operations', () => {
			const operationProperty = description.properties.find(
				(p) =>
					p.name === 'operation' &&
					(p.displayOptions?.show?.resource as string[] | undefined)?.includes('campaign')
			);
			const options = operationProperty?.options as Array<{ value: string }> | undefined;

			const expectedOperations = ['get', 'getAll', 'getStats', 'cancel'];

			expectedOperations.forEach((operation) => {
				expect(options?.some((o) => o.value === operation)).toBe(true);
			});
		});
	});
});
