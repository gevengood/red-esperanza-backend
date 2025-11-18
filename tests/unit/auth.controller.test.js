/**
 * @file auth.controller.test.js
 * @description Pruebas unitarias para el controlador de autenticación
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-18
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authController = require('../../src/controllers/auth.controller');
const { supabaseAdmin } = require('../../src/config/supabase');

// Mock de Supabase
jest.mock('../../src/config/supabase', () => ({
  supabase: {},
  supabaseAdmin: {
    from: jest.fn()
  }
}));

// Mock de bcrypt
jest.mock('bcryptjs');

// Mock de jwt
jest.mock('jsonwebtoken');

describe('Auth Controller - Pruebas Unitarias', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      user: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('register', () => {
    test('Debe fallar si faltan campos obligatorios', async () => {
      req.body = {
        nombre: 'Test User'
        // Falta correo y password
      };

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Nombre, correo y contraseña son obligatorios'
      });
    });

    test('Debe fallar con formato de correo inválido', async () => {
      req.body = {
        nombre: 'Test User',
        correo: 'correo-invalido',
        password: 'password123'
      };

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Formato de correo inválido'
      });
    });

    test('Debe fallar si la contraseña es muy corta', async () => {
      req.body = {
        nombre: 'Test User',
        correo: 'test@example.com',
        password: '12345' // Solo 5 caracteres
      };

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres'
      });
    });

    test('Debe fallar si el correo ya está registrado', async () => {
      req.body = {
        nombre: 'Test User',
        correo: 'existing@example.com',
        password: 'password123'
      };

      // Mock: usuario ya existe
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: { correo: 'existing@example.com' },
        error: null
      });

      supabaseAdmin.from.mockReturnValue({
        select: mockSelect.mockReturnValue({
          eq: mockEq.mockReturnValue({
            single: mockSingle
          })
        })
      });

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'El correo ya está registrado'
      });
    });
  });

  describe('login', () => {
    test('Debe fallar si faltan credenciales', async () => {
      req.body = {
        correo: 'test@example.com'
        // Falta password
      };

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Correo y contraseña son obligatorios'
      });
    });

    test('Debe fallar con credenciales incorrectas', async () => {
      req.body = {
        correo: 'test@example.com',
        password: 'wrongpassword'
      };

      // Mock: usuario no existe
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'No rows found' }
      });

      supabaseAdmin.from.mockReturnValue({
        select: mockSelect.mockReturnValue({
          eq: mockEq.mockReturnValue({
            single: mockSingle
          })
        })
      });

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Credenciales inválidas'
      });
    });
  });

  describe('getMe', () => {
    test('Debe retornar el perfil del usuario autenticado', async () => {
      const mockUser = {
        id_usuario: 1,
        nombre: 'Test User',
        correo: 'test@example.com',
        es_administrador: false
      };

      req.user = { id_usuario: 1 };

      // Mock: obtener usuario
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockUser,
        error: null
      });

      supabaseAdmin.from.mockReturnValue({
        select: mockSelect.mockReturnValue({
          eq: mockEq.mockReturnValue({
            single: mockSingle
          })
        })
      });

      await authController.getMe(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser
      });
    });
  });
});
