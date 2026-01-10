/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { OmnisendApi } from '../../credentials/OmnisendApi.credentials';

describe('OmnisendApi Credentials', () => {
	let credentials: OmnisendApi;

	beforeEach(() => {
		credentials = new OmnisendApi();
	});

	describe('Credential Configuration', () => {
		it('should have correct credential name', () => {
			expect(credentials.name).toBe('omnisendApi');
		});

		it('should have correct display name', () => {
			expect(credentials.displayName).toBe('Omnisend API');
		});

		it('should have documentation URL', () => {
			expect(credentials.documentationUrl).toBeDefined();
		});
	});

	describe('Properties', () => {
		it('should have apiKey property', () => {
			const apiKeyProp = credentials.properties.find((p) => p.name === 'apiKey');
			expect(apiKeyProp).toBeDefined();
		});

		it('should have apiKey as password type', () => {
			const apiKeyProp = credentials.properties.find((p) => p.name === 'apiKey');
			expect(apiKeyProp?.typeOptions?.password).toBe(true);
		});

		it('should have apiKey as required', () => {
			const apiKeyProp = credentials.properties.find((p) => p.name === 'apiKey');
			expect(apiKeyProp?.required).toBe(true);
		});
	});

	describe('Authentication', () => {
		it('should use header authentication', () => {
			expect(credentials.authenticate).toBeDefined();
			expect(credentials.authenticate?.type).toBe('generic');
		});

		it('should use X-API-KEY header', () => {
			const authProperties = credentials.authenticate?.properties as {
				headers?: Record<string, string>;
			};
			expect(authProperties?.headers).toHaveProperty('X-API-KEY');
		});
	});
});
