const University = require('../models/University');
const mongoose = require('mongoose');

const getAllUniversities = async (filters) => {
    let query = University.find();
    if (filters.active === 'true') {
        query = query.active();
    };
    if (filters.deleted === 'true') {
        query = query.deleted();
    };
    if (filters.bookmarked === 'true') {
        query = query.bookmarked();
    };
    if (filters.country) {
        query = query.byCountry(filters.country);
    };
    if (filters.createdAfter) {
        const date = new Date(filters.createdAfter);
        if (isNaN(date)) {
            throw new Error('Invalid date format');
        }
        query = query.createdAfter(date);
    }
    return await query.exec();
}

const createUniversity = async (universityData) => {
    try {
        // Prevent setting deletion status on creation
        delete universityData.deletedAt;

        const university = new University(universityData);
        await university.validate(); // Explicit validation
        return await university.save();
    } catch (error) {
        throw new Error(`University creation failed: ${error.message}`);
    }
};

const getUniversityById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid university ID format');
    }
    const university = await University.findById(id);
    if (!university) throw new Error('University not found');
    return university;
};

const updateUniversityById = async (id, updateData) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid university ID format');
    }

    const university = await University.findById(id);
    if (!university) throw new Error('University not found');

    // Prevent updating deletion status through this service
    delete updateData.deletedAt;

    Object.keys(updateData).forEach(key => {
        university[key] = updateData[key];
    });

    return await university.save();
};

const deleteUniversityById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid university ID format');
    }

    try {
        const university = await University.softDelete(id);
        return university;
    } catch (error) {
        throw new Error(`Delete failed: ${error.message}`);
    }
};

const toggleBookmarkById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid university ID format');
    }
    try {
        const university = await University.toggleBookmark(id);
        return university;
    } catch (error) {
        throw new Error(`Toggle bookmark failed: ${error.message}`);
    }
}

module.exports = {
    getAllUniversities,
    createUniversity,
    getUniversityById,
    updateUniversityById,
    deleteUniversityById,
    toggleBookmarkById
}