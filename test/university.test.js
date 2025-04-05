const { getAllUniversities, createUniversity, getUniversityById, updateUniversityById } = require('../src/services/universityService');
const University = require('../src/models/University');
const mongoose = require('mongoose');



jest.mock('../src/models/University', () => ({
    find: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    active: jest.fn().mockReturnThis(),
    deleted: jest.fn().mockReturnThis(),
    bookmarked: jest.fn().mockReturnThis(),
    byCountry: jest.fn().mockReturnThis(),
    createdAfter: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    save: jest.fn(),
}));

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
                exec: jest.fn().mockResolvedValue([])
            };

            // 2. Properly mock the find() method
            University.find = jest.fn().mockReturnValue(mockQuery);

            // 3. Execute the service function
            await getAllUniversities({ active: 'true' });

            // 4. Verify the calls
            expect(University.find).toHaveBeenCalled();
            expect(mockQuery.active).toHaveBeenCalled();
            expect(mockQuery.exec).toHaveBeenCalled();
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


    });
})