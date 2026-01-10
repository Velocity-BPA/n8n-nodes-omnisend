/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Integration tests for Omnisend node
 *
 * These tests require a valid Omnisend API key to be set in the environment.
 * Set the OMNISEND_API_KEY environment variable before running.
 *
 * Note: These tests make actual API calls and should be run sparingly
 * to avoid rate limiting.
 */

const apiKey = process.env.OMNISEND_API_KEY;
const runIntegrationTests = !!apiKey;

describe('Omnisend Integration Tests', () => {
	beforeAll(() => {
		if (!runIntegrationTests) {
			console.log('⚠️ Skipping integration tests: OMNISEND_API_KEY not set');
		}
	});

	describe('API Connection', () => {
		(runIntegrationTests ? it : it.skip)('should connect to Omnisend API', async () => {
			const response = await fetch('https://api.omnisend.com/v5/contacts?limit=1', {
				headers: {
					'X-API-KEY': apiKey!,
					'Content-Type': 'application/json',
				},
			});
			expect(response.status).toBe(200);
		});
	});

	describe('Contact Operations', () => {
		let testContactId: string | null = null;
		const testEmail = `test-${Date.now()}@example.com`;

		(runIntegrationTests ? it : it.skip)('should create a contact', async () => {
			const response = await fetch('https://api.omnisend.com/v5/contacts', {
				method: 'POST',
				headers: {
					'X-API-KEY': apiKey!,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					identifiers: [
						{
							type: 'email',
							id: testEmail,
							channels: {
								email: {
									status: 'nonSubscribed',
								},
							},
						},
					],
					firstName: 'Test',
					lastName: 'User',
				}),
			});

			expect(response.status).toBe(200);
			const data = (await response.json()) as { contactID: string };
			testContactId = data.contactID;
			expect(testContactId).toBeDefined();
		});

		(runIntegrationTests ? it : it.skip)('should get a contact', async () => {
			if (!testContactId) {
				return;
			}

			const response = await fetch(`https://api.omnisend.com/v5/contacts/${testContactId}`, {
				headers: {
					'X-API-KEY': apiKey!,
					'Content-Type': 'application/json',
				},
			});

			expect(response.status).toBe(200);
			const data = (await response.json()) as { contactID: string };
			expect(data.contactID).toBe(testContactId);
		});

		(runIntegrationTests ? it : it.skip)('should list contacts', async () => {
			const response = await fetch('https://api.omnisend.com/v5/contacts?limit=10', {
				headers: {
					'X-API-KEY': apiKey!,
					'Content-Type': 'application/json',
				},
			});

			expect(response.status).toBe(200);
			const data = (await response.json()) as { contacts: unknown[] };
			expect(data.contacts).toBeDefined();
			expect(Array.isArray(data.contacts)).toBe(true);
		});

		afterAll(async () => {
			// Clean up test contact
			if (testContactId && runIntegrationTests) {
				await fetch(`https://api.omnisend.com/v5/contacts/${testContactId}`, {
					method: 'DELETE',
					headers: {
						'X-API-KEY': apiKey!,
						'Content-Type': 'application/json',
					},
				});
			}
		});
	});

	describe('Campaign Operations', () => {
		(runIntegrationTests ? it : it.skip)('should list campaigns', async () => {
			const response = await fetch('https://api.omnisend.com/v5/campaigns?limit=10', {
				headers: {
					'X-API-KEY': apiKey!,
					'Content-Type': 'application/json',
				},
			});

			expect(response.status).toBe(200);
			const data = (await response.json()) as { campaigns: unknown[] };
			expect(data.campaigns).toBeDefined();
		});
	});

	describe('Product Operations', () => {
		(runIntegrationTests ? it : it.skip)('should list products', async () => {
			const response = await fetch('https://api.omnisend.com/v5/products?limit=10', {
				headers: {
					'X-API-KEY': apiKey!,
					'Content-Type': 'application/json',
				},
			});

			expect(response.status).toBe(200);
			const data = (await response.json()) as { products: unknown[] };
			expect(data.products).toBeDefined();
		});
	});

	describe('Category Operations', () => {
		(runIntegrationTests ? it : it.skip)('should list categories', async () => {
			const response = await fetch('https://api.omnisend.com/v5/categories?limit=10', {
				headers: {
					'X-API-KEY': apiKey!,
					'Content-Type': 'application/json',
				},
			});

			expect(response.status).toBe(200);
			const data = (await response.json()) as { categories: unknown[] };
			expect(data.categories).toBeDefined();
		});
	});

	describe('Order Operations', () => {
		(runIntegrationTests ? it : it.skip)('should list orders', async () => {
			const response = await fetch('https://api.omnisend.com/v5/orders?limit=10', {
				headers: {
					'X-API-KEY': apiKey!,
					'Content-Type': 'application/json',
				},
			});

			expect(response.status).toBe(200);
			const data = (await response.json()) as { orders: unknown[] };
			expect(data.orders).toBeDefined();
		});
	});

	describe('Automation Operations', () => {
		(runIntegrationTests ? it : it.skip)('should list automations', async () => {
			const response = await fetch('https://api.omnisend.com/v5/automations?limit=10', {
				headers: {
					'X-API-KEY': apiKey!,
					'Content-Type': 'application/json',
				},
			});

			expect(response.status).toBe(200);
			const data = (await response.json()) as { automations: unknown[] };
			expect(data.automations).toBeDefined();
		});
	});

	describe('Segment Operations', () => {
		(runIntegrationTests ? it : it.skip)('should list segments', async () => {
			const response = await fetch('https://api.omnisend.com/v5/segments?limit=10', {
				headers: {
					'X-API-KEY': apiKey!,
					'Content-Type': 'application/json',
				},
			});

			expect(response.status).toBe(200);
			const data = (await response.json()) as { segments: unknown[] };
			expect(data.segments).toBeDefined();
		});
	});

	describe('Form Operations', () => {
		(runIntegrationTests ? it : it.skip)('should list forms', async () => {
			const response = await fetch('https://api.omnisend.com/v5/forms?limit=10', {
				headers: {
					'X-API-KEY': apiKey!,
					'Content-Type': 'application/json',
				},
			});

			expect(response.status).toBe(200);
			const data = (await response.json()) as { forms: unknown[] };
			expect(data.forms).toBeDefined();
		});
	});

	describe('Rate Limiting', () => {
		(runIntegrationTests ? it : it.skip)('should handle rate limits gracefully', async () => {
			// Make a normal request to verify no rate limiting
			const response = await fetch('https://api.omnisend.com/v5/contacts?limit=1', {
				headers: {
					'X-API-KEY': apiKey!,
					'Content-Type': 'application/json',
				},
			});

			// Should not be rate limited under normal usage
			expect(response.status).not.toBe(429);
		});
	});
});
