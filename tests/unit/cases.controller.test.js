/**
 * @file cases.controller.test.js
 * @description Pruebas unitarias para el controlador de casos
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-18
 */

const casesController = require('../../src/controllers/cases.controller');
const { supabaseAdmin } = require('../../src/config/supabase');

// Mock de Supabase
jest.mock('../../src/config/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn()
  }
}));

describe('Cases Controller - Pruebas Unitarias', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      user: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getAllCases', () => {
    test('Debe retornar solo casos ACTIVOS para usuarios no autenticados', async () => {
      const mockCases = [
        { id_caso: 1, nombre_desaparecido: 'Juan', estado_caso: 'ACTIVO' },
        { id_caso: 2, nombre_desaparecido: 'María', estado_caso: 'ACTIVO' }
      ];

      const mockSelect = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockRange = jest.fn().mockResolvedValue({
        data: mockCases,
        error: null,
        count: 2
      });

      supabaseAdmin.from.mockReturnValue({
        select: mockSelect.mockReturnValue({
          order: mockOrder.mockReturnValue({
            eq: mockEq.mockReturnValue({
              range: mockRange
            })
          })
        })
      });

      req.query = { limite: 50, pagina: 1 };

      await casesController.getAllCases(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCases,
        pagination: {
          pagina: 1,
          limite: 50,
          total: 2
        }
      });
    });

    test('Debe manejar errores de base de datos correctamente', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockRange = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
        count: 0
      });

      supabaseAdmin.from.mockReturnValue({
        select: mockSelect.mockReturnValue({
          order: mockOrder.mockReturnValue({
            eq: mockEq.mockReturnValue({
              range: mockRange
            })
          })
        })
      });

      await casesController.getAllCases(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error al obtener casos'
      });
    });
  });

  describe('createCase', () => {
    test('Debe fallar si faltan campos obligatorios', async () => {
      req.body = {
        nombre_desaparecido: 'Test'
        // Faltan otros campos obligatorios
      };
      req.user = { id_usuario: 1 };

      await casesController.createCase(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.any(String)
        })
      );
    });
  });

  describe('getCaseById', () => {
    test('Debe retornar 404 si el caso no existe', async () => {
      req.params = { id: '999' };

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

      await casesController.getCaseById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Caso no encontrado'
      });
    });


  });
});
