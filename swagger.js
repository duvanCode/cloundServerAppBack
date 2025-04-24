const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clound server',
      version: '1.0.0',
      description: 'Servicio para cargar archivos y gestionar usuarios y directorios',
      license: {},
      contact: {}
    },
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000'
      },
      {
        url: 'https://cloundserverappback.onrender.com'
      }
    ],
    paths: {
      // USER endpoints
      '/api/login': {
        post: {
          summary: 'Login usuario',
          description: 'Iniciar sesión con nombre de usuario y contraseña',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: {
                      type: 'string',
                      description: 'Email del usuario'
                    },
                    password: {
                      type: 'string',
                      description: 'Contraseña del usuario'
                    }
                  },
                  required: ['username', 'password']
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Inicio de sesión exitoso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: {
                        type: 'string',
                        description: 'Token JWT de autenticación'
                      }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Datos de inicio de sesión incorrectos',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        description: 'Mensaje de error'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/register': {
        post: {
          summary: 'Registrar usuario',
          description: 'Registrar un nuevo usuario en el sistema',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: {
                      type: 'string',
                      description: 'Email del usuario'
                    },
                    password: {
                      type: 'string',
                      description: 'Contraseña del usuario'
                    },
                    name: {
                      type: 'string',
                      description: 'Nombre del usuario'
                    },
                    phone: {
                      type: 'string',
                      description: 'Número telefónico del usuario'
                    }
                  },
                  required: ['username', 'password', 'name', 'phone']
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Usuario registrado exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        description: 'Mensaje de confirmación'
                      }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Error en el registro',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        description: 'Mensaje de error'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/user/info': {
        get: {
          security: [{
            bearerAuth: []
          }],
          summary: 'Información del usuario',
          description: 'Obtener información del usuario autenticado',
          responses: {
            '200': {
              description: 'Información del usuario obtenida exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        description: 'ID del usuario'
                      },
                      username: {
                        type: 'string',
                        description: 'Email del usuario'
                      },
                      name: {
                        type: 'string',
                        description: 'Nombre del usuario'
                      },
                      phone: {
                        type: 'string',
                        description: 'Número telefónico del usuario'
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'No autorizado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        description: 'Mensaje de error de autenticación'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      
      // DIRECTORY endpoints
      '/api/directory/create': {
        post: {
          security: [{
            bearerAuth: []
          }],
          summary: 'Crear directorio o archivo',
          description: 'Crear un nuevo directorio o registrar un archivo en la estructura',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    fatherID: {
                      type: 'string',
                      description: 'ID del directorio padre ("0" para la raíz)'
                    },
                    name: {
                      type: 'string',
                      description: 'Nombre del directorio o archivo'
                    },
                    type: {
                      type: 'string',
                      description: 'Tipo de entrada ("directory" o "file")',
                      enum: ['directory', 'file']
                    },
                    fileID: {
                      type: 'string',
                      description: 'ID del archivo (solo si type=file)'
                    },
                    fileUrl: {
                      type: 'string',
                      description: 'URL del archivo (solo si type=file)'
                    }
                  },
                  required: ['fatherID', 'name', 'type']
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Directorio o archivo creado exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        description: 'ID del directorio o archivo creado'
                      },
                      message: {
                        type: 'string',
                        description: 'Mensaje de confirmación'
                      }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Error en la creación',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        description: 'Mensaje de error'
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'No autorizado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        description: 'Mensaje de error de autenticación'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/directory/get/{fatherId}': {
        get: {
          security: [{
            bearerAuth: []
          }],
          summary: 'Obtener contenido de directorio',
          description: 'Obtener el contenido de un directorio específico',
          parameters: [
            {
              name: 'fatherId',
              in: 'path',
              required: true,
              description: 'ID del directorio a consultar ("0" para la raíz)',
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Contenido del directorio obtenido exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        _id: {
                          type: 'string',
                          description: 'ID del elemento'
                        },
                        fatherID: {
                          type: 'string',
                          description: 'ID del directorio padre'
                        },
                        name: {
                          type: 'string',
                          description: 'Nombre del elemento'
                        },
                        type: {
                          type: 'string',
                          description: 'Tipo del elemento (directory o file)'
                        },
                        fileID: {
                          type: 'string',
                          description: 'ID del archivo (si es de tipo file)'
                        },
                        fileUrl: {
                          type: 'string',
                          description: 'URL del archivo (si es de tipo file)'
                        },
                        userID: {
                          type: 'string',
                          description: 'ID del usuario propietario'
                        }
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'No autorizado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        description: 'Mensaje de error de autenticación'
                      }
                    }
                  }
                }
              }
            },
            '404': {
              description: 'Directorio no encontrado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        description: 'Mensaje de error'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/directory/delete/{directoryId}': {
        delete: {
          security: [{
            bearerAuth: []
          }],
          summary: 'Eliminar directorio o archivo',
          description: 'Eliminar un directorio o archivo específico',
          parameters: [
            {
              name: 'directoryId',
              in: 'path',
              required: true,
              description: 'ID del directorio o archivo a eliminar',
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Directorio o archivo eliminado exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        description: 'Mensaje de confirmación'
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'No autorizado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        description: 'Mensaje de error de autenticación'
                      }
                    }
                  }
                }
              }
            },
            '404': {
              description: 'Directorio o archivo no encontrado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        description: 'Mensaje de error'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      
      // FILE endpoints
      '/api/file/getToken': {
        get: {
          security: [{
            bearerAuth: []
          }],
          summary: 'Obtener token para operaciones con archivos',
          description: 'Obtener un token para realizar operaciones con archivos',
          responses: {
            '200': {
              description: 'Token obtenido exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: {
                        type: 'string',
                        description: 'Token para operaciones con archivos'
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'No autorizado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        description: 'Mensaje de error de autenticación'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      
      // Mantengo los endpoints originales que podrían ser necesarios
      '/createFile': {
        post: {
          security: [{
            bearerAuth: []
          }],
          summary: 'Crear un nuevo archivo',
          description: 'Crear un nuevo archivo con los datos proporcionados',
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    file: {
                      type: 'string',
                      format: 'binary'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Archivo subido correctamente.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      url: {
                        type: 'string',
                        description: 'URL del archivo.'
                      }
                    }
                  }
                }
              },
            },
            '400': {
              description: 'Solicitud incorrecta (archivo faltante, error de validación).',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        description: 'Mensaje de error.'
                      }
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Error interno del servidor.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        description: 'Mensaje de error.'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/getFile/{id}': {
        get: {
          summary: 'Obtener un archivo por ID',
          description: 'Recuperar un archivo por su ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID del archivo a recuperar',
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Archivo',
              headers: {
                'Content-Disposition': {
                  type: 'string',
                  description: 'Cabecera Content-Disposition del archivo original'
                },
                'Content-Type': {
                  type: 'string',
                  description: 'Cabecera Content-Type del archivo original'
                },
                'Content-Length': {
                  type: 'string',
                  description: 'Cabecera Content-Length del archivo original'
                }
              },
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                    format: 'binary'
                  }
                }
              }
            },
            '404': {
              description: 'Archivo no encontrado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        description: 'Mensaje de error (e.g., "No encontrado")'
                      }
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Error interno del servidor',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        description: 'Mensaje de error'
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
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  apis: ['./src/routes/*.js']
};

module.exports = options;