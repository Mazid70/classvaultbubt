const express = require("express");
const router = express.Router();
const { Notification } = require('../models/model');
const verifyToken = require("../middleware/auth");
router.get('/', verifyToken, async (req, res) => {
  try {
    const query = {
      $and: [
        {
          $or: [
            { receiverStudentId: null },
            { receiverStudentId: req.user.studentId },
          ],
        },
        {
          deletedBy: { $ne: req.user.studentId },
        },
      ],
    }
    const notifications = await Notification.find(query).sort({ createdAt:-1 })
    res.status(200).json({
      data:notifications
    })
  } catch (error) {
    res.status(500).json({
      error
    })
  }
})
router.patch('/up', verifyToken, async (req, res) => {
  try {
    await Notification.updateMany(
      {
        $or: [
          { receiverStudentId: null },
          { receiverStudentId: req.user.studentId },
        ],
        readBy: { $ne: req.user.studentId },
      },
      {
        $addToSet: { readBy: req.user.studentId },
      }
    );
    res.status(200).json({
      success: true,
      message:"update successfully"
})
  } catch (error) {
    res.status(500).json({
      error
    })
  }
})
router.patch('/delete-all', verifyToken, async (req, res) => {
  try {
    await Notification.updateMany(
      {
        $or: [
          { receiverStudentId: null },
          { receiverStudentId: req.user.studentId },
        ],
      },
      {
        $addToSet: { deletedBy: req.user.studentId },
      }
    );

    res.json({ success: true, message: 'All notifications deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports=router