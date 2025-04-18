const { getAllUniversities, createUniversity, getUniversityById, updateUniversityById, deleteUniversityById, toggleBookmarkById } = require('../src/services/universityService');
const University = require('../src/models/University');
const mongoose = require('mongoose');



jest.mock('../src/models/University', () => {
    const mockSave = jest.fn();
    const mockValidate = jest.fn();
    const MockUniversity = jest.fn().mockImplementation((data) => {
        return {
            ...data,
            validate: mockValidate,
            save: mockSave
        };
    });

    // Add static methods to the constructor
    MockUniversity.find = jest.fn().mockReturnThis();
    MockUniversity.findById = jest.fn();
    MockUniversity.active = jest.fn().mockReturnThis();
    MockUniversity.deleted = jest.fn().mockReturnThis();
    MockUniversity.bookmarked = jest.fn().mockReturnThis();
    MockUniversity.byCountry = jest.fn().mockReturnThis();
    MockUniversity.createdAfter = jest.fn().mockReturnThis();
    MockUniversity.exec = jest.fn();

    // Add the mock functions as properties to allow access in tests
    MockUniversity.mockSave = mockSave;
    MockUniversity.mockValidate = mockValidate;

    return MockUniversity;


});

describe('University Service', () => {
    const validId = new mongoose.Types.ObjectId().toHexString();
    const mockUniversity = {
        _id: validId,
        name: 'Test University',
        save: jest.fn(),
    };
    beforeEach(() => {
        jest.clearAllMocks();
        University.find.mockReturnValue({
            active: jest.fn().mockReturnThis(),
            deleted: jest.fn().mockReturnThis(),
            bookmarked: jest.fn().mockReturnThis(),
            byCountry: jest.fn().mockReturnThis(),
            createdAfter: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue([]),
        });
    })
    describe('getAllUniversities', () => {
        it('Should apply active filter', async () => {
            const mockQuery = {
                active: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([]),
                sort: jest.fn().mockReturnThis(),
                clone: jest.fn().mockReturnThis(),
                countDocuments: jest.fn().mockResolvedValue(0),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
            };

            University.find = jest.fn().mockReturnValue(mockQuery);

            await getAllUniversities({ active: 'true' });

            expect(University.find).toHaveBeenCalled();
            expect(mockQuery.active).toHaveBeenCalled();
            expect(mockQuery.exec).toHaveBeenCalled();
            expect(mockQuery.sort).toHaveBeenCalled();
            expect(mockQuery.clone).toHaveBeenCalled();
            expect(mockQuery.countDocuments).toHaveBeenCalled();
            expect(mockQuery.skip).toHaveBeenCalled();
            expect(mockQuery.limit).toHaveBeenCalled();
        });
        it('should handle date parsing error', async () => {
            await expect(getAllUniversities({ createdAfter: 'invalid-date' })).rejects.toThrow('Invalid date format');
        });
    });

    describe('getUniversityById', () => {
        it('should throw error for invalid ID', async () => {
            await expect(getUniversityById('invalid-id'))
                .rejects.toThrow('Invalid university ID format');
        });

        it('should return university when found', async () => {
            University.findById.mockImplementation((id) => {
                if (id === validId) {
                    return mockUniversity;
                }
                return null;
            });

            const result = await getUniversityById(validId);
            expect(result).toMatchObject(mockUniversity);
            expect(University.findById).toHaveBeenCalledWith(validId);
        });
    });

    describe('updateUniversityById', () => {

        it('should prevent updating deletedAt', async () => {
            University.findById.mockImplementation((id) => {
                if (id === validId) {
                    return mockUniversity;
                }
                return null;
            });
            await updateUniversityById(validId, { deletedAt: new Date() });
            expect(mockUniversity.deletedAt).toBeUndefined();
        });

        it('should update valid fields', async () => {
            University.findById.mockImplementation((id) => {
                if (id === validId) {
                    return mockUniversity;
                }
                return null;
            });

            await updateUniversityById(validId, { name: 'New Name' });
            expect(mockUniversity.name).toBe('New Name');
            expect(mockUniversity.save).toHaveBeenCalled();
        });
    });

    describe('createUniversity', () => {
        const validUniversityData = {
            name: 'New University',
            country: 'Canada',
            website: 'https://example.com'
        };

        it('should successfully create a university with valid data', async () => {
            const savedUniversity = {
                _id: validId,
                ...validUniversityData,
                isActive: true,
                isBookmark: false,
                deletedAt: null
            };
            University.mockValidate.mockResolvedValue(undefined);
            University.mockSave.mockResolvedValue(savedUniversity);
            const result = await createUniversity(validUniversityData);

            expect(University).toHaveBeenCalledWith(validUniversityData);
            expect(University.mockValidate).toHaveBeenCalled();
            expect(University.mockSave).toHaveBeenCalled();
            expect(result).toEqual(savedUniversity);

        });

        it('should throw validation error for invalid data', async () => {
            University.mockValidate.mockRejectedValue(new Error('Country is required'));

            await expect(createUniversity({ name: 'Invalid University' }))
                .rejects.toThrow('University creation failed: Country is required');
        });

        it('should throw error for invalid URLs in webpages', async () => {
            const dataWithInvalidURL = {
                name: 'New University',
                country: 'Canada',
                webpages: ['invalid-url']
            };

            University.mockValidate.mockRejectedValue(new Error('invalid-url contains invalid url'));

            await expect(createUniversity(dataWithInvalidURL))
                .rejects.toThrow('University creation failed: invalid-url contains invalid url');
        });

    });

    describe('deleteUniversityById', () => {  
        it('should throw an error for invalid ID format', async () => {
            await expect(deleteUniversityById('invalid-id'))
                .rejects.toThrow('Invalid university ID format');
        });
    
        it('should return the university when softDelete is successful', async () => {
            // simulate the softdelete to resolve a valid object
            University.softDelete = jest.fn().mockResolvedValue(mockUniversity);
    
            const result = await deleteUniversityById(validId);
            expect(University.softDelete).toHaveBeenCalledWith(validId);
            expect(result).toEqual(mockUniversity);
        });
    
        it('should throw an error if university is not found', async () => {
            // simulate a softdelete but no data
            University.softDelete = jest.fn().mockResolvedValue(null);
    
            await expect(deleteUniversityById(validId))
                .rejects.toThrow('University not found');
        });
    });
    
    describe('toggleBookmarkById', () => {    
        it('should throw an error for invalid ID format', async () => {
            await expect(toggleBookmarkById('invalid-id'))
                .rejects.toThrow('Invalid university ID format');
        });
    
        it('should return the university when toggleBookmark is successful', async () => {
            University.toggleBookmark = jest.fn().mockResolvedValue(mockUniversity);
    
            const result = await toggleBookmarkById(validId);
            expect(University.toggleBookmark).toHaveBeenCalledWith(validId);
            expect(result).toEqual(mockUniversity);
        });
    
        it('should throw an error if university is not found', async () => {
            University.toggleBookmark = jest.fn().mockResolvedValue(null);
    
            await expect(toggleBookmarkById(validId))
                .rejects.toThrow('University not found');
        });
    });
    
})