const University = require("../models/University");
const mongoose = require("mongoose");

//get all data with/without filter
const getAllUniversities = async (filters) => {
    try {
        const page = parseInt(filters.page) || 1;
        const limit = parseInt(filters.limit) || 10;
        if (page < 1) {
            const error = new Error("Page must be greater than or equal to 1");
            error.statusCode = 400;
            throw error;
        }

        if (limit < 1 || limit > 100) {
            const error = new Error("Limit must be between 1 and 100");
            error.statusCode = 400;
            throw error;
        }
        const skip = (page - 1) * limit;


        let query = University.find();
        if (filters.active === "true") {
            query = query.active();
        } else if (filters.active === "false") {
            query = query.activeFalse();
        }

        if (filters.deleted === "true") {
            query = query.deleted();
        } else if (filters.deleted === "false") {
            query = query.deletedFalse();
        }

        if (filters.bookmarked === "true") {
            query = query.bookmarked();
        } else if (filters.bookmarked === "false") {
            query = query.bookmarkedFalse();
        }

        if (filters.country) {
            query = query.byCountry(filters.country);
        }
        if (filters.createdAfter) {
            const date = new Date(filters.createdAfter);
            if (isNaN(date)) {
                const error = new Error("Invalid date format");
                error.statusCode = 400;
                throw error;
            }
            query = query.createdAfter(date);
        }

        query = query.sort({ isBookmark: -1 });

        const countQuery = query.clone();
        const total = await countQuery.countDocuments();
        const totalPages = Math.ceil(total / limit);

        if (page > totalPages && total > 0) {
            const error = new Error(`Page number ${page} is out of range. Total pages: ${totalPages}`);
            error.statusCode = 400;
            throw error;
        }

        const universities = await query.skip(skip).limit(limit).exec();
        return {
            universities,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1
            }
        };
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

//create new university
const createUniversity = async (universityData) => {
    try {
        delete universityData.deletedAt;

        const university = new University(universityData);
        await university.validate();
        return await university.save();
    } catch (error) {
        const statusCode = error.name === 'ValidationError' ? 400 : error.code === 11000 ? 409 : 500;
        const serviceError = new Error(`University creation failed: ${error.message}`);
        serviceError.statusCode = statusCode;
        throw serviceError;
    }
};

//get by data by id
const getUniversityById = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('Invalid university ID format');
            error.statusCode = 400;
            throw error;
        }
        const university = await University.findById(id);
        if (!university) {
            const error = new Error('University not found');
            error.statusCode = 404;
            throw error;
        }
        return university;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

// update a data by id
const updateUniversityById = async (id, updateData) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('Invalid university ID format');
            error.statusCode = 400;
            throw error;
        }

        const university = await University.findById(id);
        if (!university) {
            const error = new Error('University not found');
            error.statusCode = 404;
            throw error;
        }

        delete updateData.deletedAt;

        Object.keys(updateData).forEach((key) => {
            university[key] = updateData[key];
        });

        return await university.save();
    } catch (error) {
        const statusCode = error.name === 'ValidationError' ? 400 : error.statusCode || 500;
        const serviceError = new Error(`Update failed: ${error.message}`);
        serviceError.statusCode = statusCode;
        throw serviceError;
    }
};

//delete a data by id
const deleteUniversityById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('Invalid university ID format');
        error.statusCode = 400;
        throw error;
    }

    try {
        const university = await University.softDelete(id);
        if (!university) {
            const error = new Error('University not found');
            error.statusCode = 404;
            throw error;
        }
        return university;
    } catch (error) {
        const serviceError = new Error(`Delete failed: ${error.message}`);
        serviceError.statusCode = error.statusCode || 500;
        throw serviceError;
    }
};

//toggle a bookmark
const toggleBookmarkById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('Invalid university ID format');
        error.statusCode = 400;
        throw error;
    }
    try {
        const university = await University.toggleBookmark(id);
        if (!university) {
            const error = new Error('University not found');
            error.statusCode = 404;
            throw error;
        }
        return university;
    } catch (error) {
        const serviceError = new Error(`Toggle bookmark (service) failed: ${error.message}`);
        serviceError.statusCode = error.statusCode || 500;
        throw serviceError;
    }
};

module.exports = {
    getAllUniversities,
    createUniversity,
    getUniversityById,
    updateUniversityById,
    deleteUniversityById,
    toggleBookmarkById,
};
