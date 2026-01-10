# n8n-nodes-omnisend

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for **Omnisend**, the omnichannel marketing automation platform for e-commerce. This node enables workflow automation for contacts, campaigns, e-commerce events, product catalog sync, and multi-channel marketing across email, SMS, and push notifications.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

- **10 Resource Categories** with 50+ operations
- **Multi-channel Contact Management** - Email, SMS, and push notification subscriptions
- **E-commerce Event Tracking** - Orders, carts, product views, and custom events
- **Product Catalog Sync** - Full product and category management with variants
- **Campaign Analytics** - Performance metrics and campaign management
- **Automation Triggering** - Trigger custom automations programmatically
- **Segment Management** - Access dynamic and static segments
- **Form Analytics** - Track popup, embedded, and flyout form performance

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** → **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-omnisend`
5. Click **Install**
6. Restart n8n when prompted

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-omnisend

# Restart n8n
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-omnisend.git
cd n8n-nodes-omnisend

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-omnisend

# Restart n8n
```

## Credentials Setup

### Omnisend API Key

| Field | Description |
|-------|-------------|
| **API Key** | Your Omnisend API key from Store Settings → API Keys |

To obtain your API key:
1. Log in to your Omnisend dashboard
2. Navigate to **Store Settings** → **API Keys**
3. Click **Create API Key**
4. Copy the generated key and paste it into n8n

## Resources & Operations

### Contact

Manage subscriber contacts across all channels.

| Operation | Description |
|-----------|-------------|
| **Create** | Create a new contact with email/phone identifiers |
| **Get** | Retrieve contact by ID or email |
| **Get All** | List all contacts with filters |
| **Update** | Update contact details and preferences |
| **Delete** | Remove a contact |
| **Get Activities** | Get activity history for a contact |
| **Add Tag** | Add a tag to a contact |
| **Remove Tag** | Remove a tag from a contact |
| **Update Identifiers** | Update email or phone identifiers |

### Campaign

Manage email, SMS, and push notification campaigns.

| Operation | Description |
|-----------|-------------|
| **Get** | Retrieve campaign by ID |
| **Get All** | List all campaigns with filters |
| **Get Stats** | Get campaign performance metrics |
| **Cancel** | Cancel a scheduled campaign |

### Event

Track e-commerce and custom events.

| Operation | Description |
|-----------|-------------|
| **Track** | Send a custom event |
| **Track Order** | Send order placed event |
| **Track Cart** | Send cart updated/abandoned event |
| **Track Product View** | Send product view event |
| **Get All** | List events for a contact |

### Product

Manage product catalog.

| Operation | Description |
|-----------|-------------|
| **Create** | Add a product to the catalog |
| **Get** | Retrieve product by ID |
| **Get All** | List all products |
| **Update** | Update product details |
| **Delete** | Remove a product |
| **Sync** | Bulk sync products |

### Category

Manage product categories.

| Operation | Description |
|-----------|-------------|
| **Create** | Create a new category |
| **Get** | Retrieve category by ID |
| **Get All** | List all categories |
| **Update** | Update category details |
| **Delete** | Remove a category |

### Order

Track and manage orders.

| Operation | Description |
|-----------|-------------|
| **Create** | Create a new order |
| **Get** | Retrieve order by ID |
| **Get All** | List all orders |
| **Update** | Update order status |
| **Delete** | Remove an order |

### Cart

Track shopping carts for abandoned cart recovery.

| Operation | Description |
|-----------|-------------|
| **Create** | Create/track a cart |
| **Get** | Retrieve cart by ID |
| **Get All** | List all carts |
| **Update** | Update cart contents |
| **Delete** | Remove a cart |

### Automation

Manage and trigger automations.

| Operation | Description |
|-----------|-------------|
| **Get** | Retrieve automation by ID |
| **Get All** | List all automations |
| **Get Stats** | Get automation performance data |
| **Trigger** | Trigger a custom automation |

### Segment

Access contact segments.

| Operation | Description |
|-----------|-------------|
| **Get** | Retrieve segment by ID |
| **Get All** | List all segments |
| **Get Contacts** | List contacts in a segment |

### Form

Track form performance.

| Operation | Description |
|-----------|-------------|
| **Get** | Retrieve form by ID |
| **Get All** | List all forms |
| **Get Stats** | Get form performance metrics |

## Usage Examples

### Create a Contact

```javascript
// Node configuration
{
  "resource": "contact",
  "operation": "create",
  "email": "customer@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "emailStatus": "subscribed",
  "tags": "newsletter,vip"
}
```

### Track an Order Event

```javascript
// Node configuration
{
  "resource": "event",
  "operation": "trackOrder",
  "email": "customer@example.com",
  "orderID": "ORD-12345",
  "currency": "USD",
  "orderSum": 99.99,
  "paymentStatus": "paid",
  "fulfillmentStatus": "unfulfilled",
  "lineItems": [
    {
      "productID": "SKU-001",
      "productTitle": "Widget Pro",
      "quantity": 2,
      "price": 49.99
    }
  ]
}
```

### Sync Products

```javascript
// Node configuration
{
  "resource": "product",
  "operation": "sync",
  "products": [
    {
      "productID": "SKU-001",
      "title": "Widget Pro",
      "price": 49.99,
      "currency": "USD",
      "productUrl": "https://store.example.com/products/widget-pro",
      "imageUrl": "https://store.example.com/images/widget-pro.jpg",
      "status": "inStock"
    }
  ]
}
```

## Omnisend Concepts

### Contact Identifiers

Contacts can be identified by:
- **Email**: Primary identifier for email marketing
- **Phone**: E.164 format (e.g., +12025551234) for SMS marketing
- **Contact ID**: Omnisend's internal identifier

### Channel Status

Each channel (email, SMS, push) has its own subscription status:
- `subscribed`: Opted in to receive messages
- `unsubscribed`: Opted out of messages
- `nonSubscribed`: Has identifier but hasn't opted in

### Event Schema

Events use version 2 schema with:
- `eventName`: Type of event (e.g., "placed order")
- `eventID`: Unique identifier for idempotency
- `origin`: Source of event (use "api")
- `contact`: Email or phone identifier
- `properties`: Event-specific data

## API Information

| Property | Value |
|----------|-------|
| Base URL | `https://api.omnisend.com/v5` |
| Rate Limit | 100 requests/minute |
| Pagination | Offset/limit (max 250/page) |

## Error Handling

The node handles common Omnisend API errors:

| Status Code | Meaning |
|-------------|---------|
| 200/201 | Success |
| 400 | Bad request - Check parameters |
| 401 | Invalid API key |
| 403 | Forbidden - Check permissions |
| 404 | Resource not found |
| 422 | Validation error |
| 429 | Rate limited - Slow down requests |

## Security Best Practices

1. **Store API keys securely** - Use n8n credentials, never hardcode
2. **Limit API key scope** - Create keys with minimal required permissions
3. **Monitor usage** - Check Omnisend dashboard for unusual activity
4. **Rotate keys regularly** - Generate new keys periodically
5. **Use HTTPS only** - All API calls use encrypted connections

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code passes linting and tests before submitting.

## Support

- **Documentation**: [Omnisend API Docs](https://api-docs.omnisend.com/)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-omnisend/issues)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io/)

## Acknowledgments

- [Omnisend](https://www.omnisend.com/) for their comprehensive marketing API
- [n8n](https://n8n.io/) for the workflow automation platform
- The open-source community for inspiration and support
