const { registerUser, loginUser } = require('../src/services/userService');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock the dependencies  Avoid real database/JWT operations during testing
jest.mock('../src/models/User');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('User Authentication', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      // Arrange mockuser
      const mockUser = { _id: '123', username: 'testuser' };
      // Simulate no existing user
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);

      // Execute the function
      const result = await registerUser('testuser', 'password123');

      // verify
      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(User.create).toHaveBeenCalledWith({ username: 'testuser', password: 'password123' });
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if username already exists', async () => {
      // Simulate found user
      User.findOne.mockResolvedValue({ _id: '123', username: 'testuser' });

      // Execute the function & verify
      await expect(registerUser('testuser', 'password123')).rejects.toThrow('Username already exists');
      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(User.create).not.toHaveBeenCalled();
    });
  });

  describe('loginUser', () => {
    it('should login user and return JWT token if credentials are valid', async () => {
      // Arrange mockuser and mocktoken
      const mockUser = { _id: '123', username: 'testuser', password: 'hashedPassword' };
      const mockToken = 'valid.jwt.token';
      
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      // Forces JWT to return predictable token for testing
      jwt.sign.mockReturnValue(mockToken);

      // Execute the function
      const result = await loginUser('testuser', 'password123');

      // verify
      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: '123' },
        'test-secret',
        { expiresIn: '8h' }
      );
      expect(result).toEqual(mockToken);
    });

    it('should throw an error if user does not exist', async () => {
      // Arrange null user
      User.findOne.mockResolvedValue(null);

      // Execute the function & verify
      await expect(loginUser('testuser', 'password123')).rejects.toThrow('Invalid credentials');
      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw an error if password is incorrect', async () => {
      // Arrange mockuser
      const mockUser = { _id: '123', username: 'testuser', password: 'hashedPassword' };
      
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      // Execute the function  & verify
      await expect(loginUser('testuser', 'wrongpassword')).rejects.toThrow('Invalid credentials');
      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });
});