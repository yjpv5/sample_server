/**
 * @swagger
 * components:
 *   schemas:
 *     University:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: University ID
 *         name:
 *           type: string
 *           description: University name
 *         webpages:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of valid URLs for university webpages
 *         country:
 *           type: string
 *           description: University country
 *         isActive:
 *           type: boolean
 *           description: Whether the university is active
 *         isBookmark:
 *           type: boolean
 *           description: Whether the university is bookmarked
 *           default: false
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the university was soft deleted
 *           default: null
 *         created:
 *           type: string
 *           format: date-time
 *           description: Creation date
 *         lastModified:
 *           type: string
 *           format: date-time
 *           description: Last update date
 *     PaginatedUniversities:
 *       type: object
 *       properties:
 *         universities:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/University'
 *         pagination:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               description: Total number of universities matching the query
 *             page:
 *               type: integer
 *               description: Current page number
 *             limit:
 *               type: integer
 *               description: Number of items per page
 *             totalPages:
 *               type: integer
 *               description: Total number of pages
 *             hasNextPage:
 *               type: boolean
 *               description: Whether there is a next page
 *             hasPrevPage:
 *               type: boolean
 *               description: Whether there is a previous page
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *
 * /api/resources/university:
 *   get:
 *     summary: Get all universities with pagination and filtering
 *     tags: [Universities]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: active
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by active status
 *       - in: query
 *         name: deleted
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by deleted status
 *       - in: query
 *         name: bookmarked
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by bookmark status
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country
 *       - in: query
 *         name: createdAfter
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by creation date (ISO format)
 *     responses:
 *       200:
 *         description: List of universities with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedUniversities'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   post:
 *     summary: Create a new university
 *     tags: [Universities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: University name
 *               
 *               country:
 *                 type: string
 *                 description: University country
 *              
 *               webpages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of valid URLs for university webpages
 *               
 *     responses:
 *       201:
 *         description: University created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/University'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Duplicate university
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - missing or invalid JWT token
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /api/resources/university/{id}:
 *   get:
 *     summary: Get university by ID
 *     tags: [Universities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the university
 *     responses:
 *       200:
 *         description: University details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/University'
 *       400:
 *         description: Invalid university ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: University not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   put:
 *     summary: Update university by ID
 *     tags: [Universities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the university
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: University name
 *               
 *               country:
 *                 type: string
 *                 description: University country
 *               webpages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of valid URLs for university webpages
 *     responses:
 *       200:
 *         description: University updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/University'
 *       400:
 *         description: Invalid university ID format or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - missing or invalid JWT token
 *       404:
 *         description: University not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   delete:
 *     summary: Soft delete university by ID
 *     tags: [Universities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the university
 *     responses:
 *       200:
 *         description: University soft deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               
 *       400:
 *         description: Invalid university ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - missing or invalid JWT token
 *       404:
 *         description: University not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /api/resources/university/bookmark/{id}:
 *   post:
 *     summary: Toggle bookmark status for a university
 *     tags: [Universities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the university
 *     responses:
 *       201:
 *         description: Bookmark status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/University'
 *       400:
 *         description: Invalid university ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - missing or invalid JWT token
 *       404:
 *         description: University not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */