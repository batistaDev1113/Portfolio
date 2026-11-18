import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

const openapi = {
  openapi: '3.1.0',
  info: {
    title: 'Yunior Batista Portfolio APIs',
    version: '1.0.0',
    description:
      'Machine-readable description of HTTP APIs available on yuniorbatista.com (portfolio chatbot and contact form).',
  },
  servers: [{ url: 'https://www.yuniorbatista.com' }],
  paths: {
    '/api/chat': {
      post: {
        summary: 'Send a chat message to the portfolio assistant',
        description:
          'Accepts a UI message array and returns a streaming AI SDK UI message response. Subject to per-minute and per-day rate limits.',
        operationId: 'postChat',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['messages'],
                properties: {
                  messages: {
                    type: 'array',
                    minItems: 1,
                    description:
                      'Array of AI SDK UI messages. Each message typically includes role and parts (e.g. text parts). The last message must contain non-empty text up to 500 characters.',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        role: {
                          type: 'string',
                          enum: ['system', 'user', 'assistant'],
                        },
                        parts: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              type: { type: 'string' },
                              text: { type: 'string' },
                            },
                            additionalProperties: true,
                          },
                        },
                        content: {
                          description:
                            'Legacy/content field that may appear depending on client format.',
                        },
                      },
                      additionalProperties: true,
                    },
                  },
                },
                additionalProperties: false,
              },
            },
          },
        },
        responses: {
          '200': {
            description:
              'Streaming UI message response (text/event-stream compatible AI SDK stream).',
            content: {
              'text/plain': {
                schema: { type: 'string' },
              },
              'text/event-stream': {
                schema: { type: 'string' },
              },
            },
          },
          '400': {
            description:
              'Invalid or missing messages / invalid message length.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '429': {
            description: 'Rate limited (per-minute or daily capacity/quota).',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description:
              'Chat service not configured or internal processing error.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '503': {
            description: 'All chat models temporarily unavailable.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/contact': {
      post: {
        summary: 'Submit the portfolio contact form',
        operationId: 'postContact',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['full_name', 'email', 'textarea'],
                properties: {
                  full_name: { type: 'string', minLength: 1 },
                  email: { type: 'string', format: 'email', minLength: 1 },
                  textarea: { type: 'string', minLength: 1 },
                },
                additionalProperties: true,
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Message sent successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      const: 'Email sent successfully',
                    },
                  },
                  required: ['message'],
                },
              },
            },
          },
          '400': {
            description: 'Missing required fields.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description: 'Email service not configured or send failure.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    details: { type: 'string' },
                  },
                  required: ['error'],
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
        required: ['error'],
        additionalProperties: true,
      },
    },
  },
} as const;

export function GET(): NextResponse {
  return NextResponse.json(openapi, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
