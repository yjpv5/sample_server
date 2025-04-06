const express = require("express");
const {
    getAllUniversities,
    createUniversity,
    getUniversityById,
    updateUniversityById,
    deleteUniversityById,
    toggleBookmarkById,
} = require("../services/universityService");
const { authJWT } = require('../middleware/auth');

const router = express.Router();


//get university or with filter
router.get('/university', async (req, res, next) => {
    try {
        const universities = await getAllUniversities(req.query);
        res.status(200).json(universities);
    } catch (error) {
        next(error);
    }
})

//create a new university
router.post('/university', authJWT, async (req, res, next) => {
    try {
        const newUniversity = await createUniversity(req.body);
        res.status(201).json(newUniversity);
    } catch (error) {
        next(error);
    }
})

//get university by id
router.get('/university/:id', async (req, res, next) => {
    try {
        const university = await getUniversityById(req.params.id);
        res.status(200).json(university);
    } catch (error) {
        next(error);
    }
})

//update a univsity by id
router.put('/university/:id', authJWT, async (req, res, next) => {
    try {
        const updatedUniversity = await updateUniversityById(req.params.id, req.body);
        res.status(200).json(updatedUniversity);
    } catch (error) {
        next(error);
    }
})

//soft delete by id
router.delete('/university/:id', authJWT, async (req, res, next) => {
    try {
        const deletedUniversity = await deleteUniversityById(req.params.id);
        res.status(200).json(deletedUniversity);
    } catch (error) {
        next(error);
    }
})

//toggle a bookmark by id
router.post('/university/bookmark/:id', authJWT, async (req, res, next) => {
    try {
        const deletedUniversity = await toggleBookmarkById(req.params.id);
        res.status(201).json(deletedUniversity);
    } catch (error) {
        next(error);
    }
})

module.exports = router;