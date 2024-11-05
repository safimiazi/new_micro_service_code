/**
 * @swagger
 * /create:
 *   post:
 *     summary: Create a new agency
 *     tags: [LoiAgency]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *               banner:
 *                 type: string
 *                 format: binary
 *               signature:
 *                 type: string
 *                 format: binary
 *               sill:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Agency created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
