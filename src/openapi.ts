export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Michi Sweatshop API',
    version: '1.0.0',
    description: 'API for managing users, products, variants, and images'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ],
  paths: {
    '/api/users': {
      post: {
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' },
                  name: { type: 'string' },
                  role: { type: 'string' }
                },
                required: ['username', 'password', 'name']
              }
            }
          }
        },
        responses: {
          200: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        username: { type: 'string' },
                        name: { type: 'string' },
                        role: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          field: { type: 'string' },
                          message: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/users/login': {
      post: {
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' }
                },
                required: ['username', 'password']
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        username: { type: 'string' },
                        name: { type: 'string' },
                        role: { type: 'string' },
                        token: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          field: { type: 'string' },
                          message: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/products': {
      get: {
        summary: 'Get all products',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 }
          }
        ],
        responses: {
          200: {
            description: 'List of products',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          uuid: { type: 'string' },
                          title: { type: 'string' },
                          description: { type: 'string' },
                          product_type: { type: 'string' },
                          vendor: { type: 'string' },
                          tags: { type: 'array', items: { type: 'string' } },
                          status: { type: 'string' },
                          published_at: { type: 'string', format: 'date-time' },
                          created_at: { type: 'string', format: 'date-time' },
                          updated_at: { type: 'string', format: 'date-time' },
                          variants: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                uuid: { type: 'string' },
                                title: { type: 'string' },
                                price: { type: 'number' },
                                sku: { type: 'string' },
                                inventory_quantity: { type: 'number' },
                                inventory_policy: { type: 'string' },
                                option1: { type: 'string' },
                                created_at: { type: 'string', format: 'date-time' },
                                updated_at: { type: 'string', format: 'date-time' }
                              }
                            }
                          }
                        }
                      }
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        totalPages: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create a new product',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  product_type: { type: 'string' },
                  vendor: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } },
                  status: { type: 'string' },
                  variants: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: { type: 'string' },
                        price: { type: 'number' },
                        sku: { type: 'string' },
                        inventory_policy: { type: 'string' },
                        option1: { type: 'string' },
                        inventory_item: {
                          type: 'object',
                          properties: {
                            sku: { type: 'string' },
                            tracked: { type: 'boolean' },
                            available: { type: 'number' },
                            cost: { type: 'number' }
                          }
                        }
                      }
                    }
                  }
                },
                required: ['title', 'product_type', 'vendor', 'status', 'variants']
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Product created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        uuid: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        product_type: { type: 'string' },
                        vendor: { type: 'string' },
                        tags: { type: 'array', items: { type: 'string' } },
                        status: { type: 'string' },
                        published_at: { type: 'string', format: 'date-time' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                        variants: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              uuid: { type: 'string' },
                              title: { type: 'string' },
                              price: { type: 'number' },
                              sku: { type: 'string' },
                              inventory_quantity: { type: 'number' },
                              inventory_policy: { type: 'string' },
                              option1: { type: 'string' },
                              created_at: { type: 'string', format: 'date-time' },
                              updated_at: { type: 'string', format: 'date-time' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          field: { type: 'string' },
                          message: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/products/{uuid}': {
      get: {
        summary: 'Get product by UUID',
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Product details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        uuid: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        product_type: { type: 'string' },
                        vendor: { type: 'string' },
                        tags: { type: 'array', items: { type: 'string' } },
                        status: { type: 'string' },
                        published_at: { type: 'string', format: 'date-time' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                        variants: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              uuid: { type: 'string' },
                              title: { type: 'string' },
                              price: { type: 'number' },
                              sku: { type: 'string' },
                              inventory_quantity: { type: 'number' },
                              inventory_policy: { type: 'string' },
                              option1: { type: 'string' },
                              created_at: { type: 'string', format: 'date-time' },
                              updated_at: { type: 'string', format: 'date-time' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      },
      patch: {
        summary: 'Update product',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  product_type: { type: 'string' },
                  vendor: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } },
                  status: { type: 'string' },
                  variants: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        uuid: { type: 'string' },
                        title: { type: 'string' },
                        price: { type: 'number' },
                        sku: { type: 'string' },
                        inventory_policy: { type: 'string' },
                        option1: { type: 'string' },
                        inventory_item: {
                          type: 'object',
                          properties: {
                            sku: { type: 'string' },
                            tracked: { type: 'boolean' },
                            available: { type: 'number' },
                            cost: { type: 'number' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Product updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        uuid: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        product_type: { type: 'string' },
                        vendor: { type: 'string' },
                        tags: { type: 'array', items: { type: 'string' } },
                        status: { type: 'string' },
                        published_at: { type: 'string', format: 'date-time' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                        variants: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              uuid: { type: 'string' },
                              title: { type: 'string' },
                              price: { type: 'number' },
                              sku: { type: 'string' },
                              inventory_quantity: { type: 'number' },
                              inventory_policy: { type: 'string' },
                              option1: { type: 'string' },
                              created_at: { type: 'string', format: 'date-time' },
                              updated_at: { type: 'string', format: 'date-time' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          field: { type: 'string' },
                          message: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'string' }
                  }
                }
              }
            }
          },
          404: {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        summary: 'Delete product',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Product deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'boolean' }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'string' }
                  }
                }
              }
            }
          },
          404: {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/products/{uuid}/detail': {
      get: {
        summary: 'Get product detail by UUID',
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Product detail',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        uuid: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        product_type: { type: 'string' },
                        vendor: { type: 'string' },
                        tags: { type: 'array', items: { type: 'string' } },
                        status: { type: 'string' },
                        published_at: { type: 'string', format: 'date-time' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                        variants: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              uuid: { type: 'string' },
                              title: { type: 'string' },
                              price: { type: 'number' },
                              sku: { type: 'string' },
                              inventory_quantity: { type: 'number' },
                              inventory_policy: { type: 'string' },
                              option1: { type: 'string' },
                              created_at: { type: 'string', format: 'date-time' },
                              updated_at: { type: 'string', format: 'date-time' },
                              inventory_item: {
                                type: 'object',
                                properties: {
                                  uuid: { type: 'string' },
                                  sku: { type: 'string' },
                                  tracked: { type: 'boolean' },
                                  available: { type: 'number' },
                                  cost: { type: 'number' },
                                  created_at: { type: 'string', format: 'date-time' },
                                  updated_at: { type: 'string', format: 'date-time' }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/products/{uuid}/images': {
      post: {
        summary: 'Upload product image (URL-based)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  url: { type: 'string' },
                  alt_text: { type: 'string' },
                  position: { type: 'number' }
                },
                required: ['url']
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Image uploaded successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        uuid: { type: 'string' },
                        url: { type: 'string' },
                        alt_text: { type: 'string' },
                        position: { type: 'number' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                        productId: { type: 'string' },
                        variantId: { type: 'string', nullable: true }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          field: { type: 'string' },
                          message: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'string' }
                  }
                }
              }
            }
          },
          404: {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/products/{uuid}/images/upload': {
      post: {
        summary: 'Upload product image (file upload)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image file (JPEG, PNG, GIF, WebP)'
                  },
                  alt_text: { type: 'string' },
                  position: { type: 'number' }
                },
                required: ['image']
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Image uploaded successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        uuid: { type: 'string' },
                        url: { type: 'string' },
                        alt_text: { type: 'string' },
                        position: { type: 'number' },
                        filename: { type: 'string' },
                        size: { type: 'number' },
                        mime_type: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                        productId: { type: 'string' },
                        variantId: { type: 'string', nullable: true }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'string' }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'string' }
                  }
                }
              }
            }
          },
          404: {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/variants': {
      post: {
        summary: 'Create a new variant',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  title: { type: 'string' },
                  price: { type: 'number' },
                  sku: { type: 'string' },
                  inventory_policy: { type: 'string' },
                  option1: { type: 'string' },
                  inventory_item: {
                    type: 'object',
                    properties: {
                      sku: { type: 'string' },
                      tracked: { type: 'boolean' },
                      available: { type: 'number' },
                      cost: { type: 'number' }
                    }
                  }
                },
                required: ['productId', 'title', 'price', 'sku', 'inventory_policy', 'option1', 'inventory_item']
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Variant created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        uuid: { type: 'string' },
                        title: { type: 'string' },
                        price: { type: 'number' },
                        sku: { type: 'string' },
                        inventory_quantity: { type: 'number' },
                        inventory_policy: { type: 'string' },
                        option1: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                        images: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              uuid: { type: 'string' },
                              url: { type: 'string' },
                              alt_text: { type: 'string' },
                              position: { type: 'number' },
                              created_at: { type: 'string', format: 'date-time' },
                              updated_at: { type: 'string', format: 'date-time' }
                            }
                          }
                        },
                        inventory_item: {
                          type: 'object',
                          properties: {
                            uuid: { type: 'string' },
                            sku: { type: 'string' },
                            tracked: { type: 'boolean' },
                            available: { type: 'number' },
                            cost: { type: 'number' },
                            created_at: { type: 'string', format: 'date-time' },
                            updated_at: { type: 'string', format: 'date-time' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'string' }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'string' }
                  }
                }
              }
            }
          },
          404: {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/variants/{uuid}': {
      get: {
        summary: 'Get variant by UUID',
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Variant details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        uuid: { type: 'string' },
                        title: { type: 'string' },
                        price: { type: 'number' },
                        sku: { type: 'string' },
                        inventory_quantity: { type: 'number' },
                        inventory_policy: { type: 'string' },
                        option1: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                        images: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              uuid: { type: 'string' },
                              url: { type: 'string' },
                              alt_text: { type: 'string' },
                              position: { type: 'number' },
                              created_at: { type: 'string', format: 'date-time' },
                              updated_at: { type: 'string', format: 'date-time' }
                            }
                          }
                        },
                        inventory_item: {
                          type: 'object',
                          properties: {
                            uuid: { type: 'string' },
                            sku: { type: 'string' },
                            tracked: { type: 'boolean' },
                            available: { type: 'number' },
                            cost: { type: 'number' },
                            created_at: { type: 'string', format: 'date-time' },
                            updated_at: { type: 'string', format: 'date-time' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Variant not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      },
      patch: {
        summary: 'Update variant',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  price: { type: 'number' },
                  sku: { type: 'string' },
                  inventory_policy: { type: 'string' },
                  option1: { type: 'string' },
                  inventory_item: {
                    type: 'object',
                    properties: {
                      sku: { type: 'string' },
                      tracked: { type: 'boolean' },
                      available: { type: 'number' },
                      cost: { type: 'number' }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Variant updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        uuid: { type: 'string' },
                        title: { type: 'string' },
                        price: { type: 'number' },
                        sku: { type: 'string' },
                        inventory_quantity: { type: 'number' },
                        inventory_policy: { type: 'string' },
                        option1: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                        images: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              uuid: { type: 'string' },
                              url: { type: 'string' },
                              alt_text: { type: 'string' },
                              position: { type: 'number' },
                              created_at: { type: 'string', format: 'date-time' },
                              updated_at: { type: 'string', format: 'date-time' }
                            }
                          }
                        },
                        inventory_item: {
                          type: 'object',
                          properties: {
                            uuid: { type: 'string' },
                            sku: { type: 'string' },
                            tracked: { type: 'boolean' },
                            available: { type: 'number' },
                            cost: { type: 'number' },
                            created_at: { type: 'string', format: 'date-time' },
                            updated_at: { type: 'string', format: 'date-time' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          field: { type: 'string' },
                          message: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'string' }
                  }
                }
              }
            }
          },
          404: {
            description: 'Variant not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
}
