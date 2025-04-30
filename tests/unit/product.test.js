jest.mock('../../models/product-model.js');
jest.mock('nanoid', () => ({ nanoid: jest.fn().mockReturnValue('12345') }));

const {
  listProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
} = require('../../app/products');
const Product = require('../../models/product-model');

afterEach(() => jest.clearAllMocks());

describe('Product handlers - unit tests', () => {
  describe('listProducts', () => {
    test('succefully return array of products', async () => {
      const fakeData = [{ title: 'A' }];
      const populate = jest.fn().mockResolvedValue(fakeData);
      Product.find.mockReturnValue({ populate });
      const req = { query: { category: 'cat1' } };
      const res = { send: jest.fn(), sendStatus: jest.fn() };
      await listProducts(req, res);

      expect(Product.find).toHaveBeenCalledWith({ category: 'cat1' });
      expect(populate).toHaveBeenCalledWith('category', 'title description');
      expect(res.send).toHaveBeenCalledWith(fakeData);
    });

    test('return 500', async () => {
      Product.find.mockImplementation(() => {
        throw new Error('fail');
      });
      const req = { query: {} };
      const res = { send: jest.fn(), sendStatus: jest.fn() };
      await listProducts(req, res);
      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('getProductById', () => {
    test('return found product', async () => {
      const fake = { _id: 'xyz' };
      Product.findById.mockResolvedValue(fake);

      const req = { params: { id: 'xyz' } };
      const res = { send: jest.fn(), sendStatus: jest.fn() };
      await getProductById(req, res);
      expect(Product.findById).toHaveBeenCalledWith('xyz');
      expect(res.send).toHaveBeenCalledWith(fake);
    });
    test('return 404 if product not found', async () => {
      Product.findById.mockResolvedValue(null);
      const req = { params: { id: 'nope' } };
      const res = { send: jest.fn(), sendStatus: jest.fn() };
      await getProductById(req, res);
      expect(res.sendStatus).toHaveBeenCalledWith(404);
    });
    test('return 500', async () => {
      Product.findById.mockRejectedValue(new Error('err'));
      const req = { params: { id: '123' } };
      const res = { send: jest.fn(), sendStatus: jest.fn() };
      await getProductById(req, res);
      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('createProduct', () => {
    beforeEach(() => {
      Product.mockImplementation(data => ({ ...data, save: jest.fn().mockResolvedValue() }));
    });

    test('create product without file', async () => {
      const req = { body: { title: 't1' }, file: undefined };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await createProduct(req, res);
      expect(Product).toHaveBeenCalledWith({ title: 't1', image: null });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ title: 't1', image: null }));
    });
    test('create product with file', async () => {
      const req = { body: { title: 't2'}, file: { filename: 'file.png' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      await createProduct(req, res);

      expect(Product).toHaveBeenCalledWith({ title: 't2', image: 'file.png' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ title: 't2', image: 'file.png' })
      );
    });
    test('return 500 for create product',async()=>{
        Product.mockImplementation(()=>({
            save: jest.fn().mockRejectedValue(new Error('oops'))
        }))
        const req= {body:{}, file:undefined}
        const res ={status:jest.fn().mockReturnThis(),send:jest.fn() };
        await createProduct(req,res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(expect.any(Error));
        
    });
  });
});