const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { Note, Notification, User } = require('../models/model')
router.post('/upload', verifyToken, async (req, res) => {
  try {
    const adminsAndCR = await User.find({ role: { $in: ["admin", "cr"] } });
    const isAdminOrCR = adminsAndCR.some(
      u => u.studentId === req.user.studentId
    );
    const newNote = new Note({
      ...req.body,
      user: req.user.userId,
      approved: isAdminOrCR ? true : false
    });
    await newNote.save();
   
    if (!isAdminOrCR) {
      const uploader = await User.findOne({ studentId: req.user.studentId })
      await Promise.all(adminsAndCR.map(user =>
        Notification.create({
          message: `⏳${uploader.userName} has uploaded a material. Please Check`,
          type: "approval",
          receiverStudentId: user.studentId,
        })
      ));
    }
    res.status(200).json({
      success: true,
      message: 'Note added successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
router.get('/', verifyToken, async (req, res) => {
  try {
    const { search, page = 1, limit = 6 } = req.query;

    let query = { approved: true };
    console.log(search)
    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const totalCount = await Note.countDocuments(query);

    const result = await Note.find(query)
      .populate("user", "userName photoUrl studentId -_id")
      .populate('comments.user', 'userName studentId photoUrl')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      data: result,
      totalCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get('/pending', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // total pending notes count
    const total = await Note.countDocuments({ approved: false });

    // paginated notes
    const notes = await Note.find({ approved: false })
      .populate("user", "userName photoUrl studentId -_id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      data: notes,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// for reacts 
router.patch("/:id/react", verifyToken, async (req, res) => {
  try {
    const id = req.params.id
    const note = await Note.findById({ _id: id });
    const { studentId } = req.user;
    const exist = note.reacts.includes(studentId)
    if (exist) {
      await Note.updateOne({ _id: id }, {
        $pull: { reacts: studentId }
      })
    }
    else {
      await Note.updateOne({ _id: id }, {
        $addToSet: { reacts: studentId }
      })
    }
    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
});

// for comments
router.post('/:id/comment', verifyToken, async (req, res) => {
  try {
    const noteId = req.params.id;
    const { text } = req.body
    const note = await Note.findById({ _id: noteId }).populate("user", "studentId")
    const newComment = {
      text,
      user: req.user.userId
    }
    note.comments.push(newComment)
    await note.save()
    const commenter = await User.findOne({ studentId: req.user.studentId })
    if (req.user.studentId != note.user.studentId) {
      await Notification.create({
        message: `💬 ${commenter.userName} commented on your note: ${note.title}`,
        type: "comment",
        receiverStudentId: note.user.studentId
      })
    }
    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
})
router.delete('/:noteId/comment/:commentId', verifyToken, async (req, res) => {
  try {
    const { noteId, commentId } = req.params;
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const comment = note.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.userId)
      return res.status(403).json({ message: "Not authorized" });

    // Safe remove
    note.comments = note.comments.filter(c => c._id.toString() !== commentId);

    await note.save();
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
// for update status 
router.patch('/:id/approve', verifyToken, async (req, res) => {
  try {
    const noteId = req.params.id;

    // 🔹 Find & approve note
    const note = await Note.findByIdAndUpdate(
      noteId,
      { approved: true },
      { new: true }
    ).populate('user', 'studentId userName');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    // 🔔 1️⃣ Notification for everyone
    await Notification.create({
      message: ` "${note.title}" . A new note/metarial Uploaded`,
      type: 'announcement',
      receiverStudentId: null, // everyone
    });

    // 🔔 2️⃣ Notification for note owner
    await Notification.create({
      message: `Your note "${note.title}" has been approved.`,
      type: 'approval',
      receiverStudentId: note.user.studentId,
    });

    res.status(200).json({
      success: true,
      message: 'Note approved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const noteId = req.params.id;
    const { reason } = req.body;

    // 🔹 Find note first
    const note = await Note.findById(noteId).populate(
      'user',
      'studentId userName'
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    // 🔔 1️⃣ Notification for note owner (IMPORTANT)
    await Notification.create({
      message: `Your note "${note.title}" was rejected. Reason: ${reason}`,
      type: 'approval',
      receiverStudentId: note.user.studentId,
    });

    await Note.findByIdAndDelete(noteId);

    res.status(200).json({
      success: true,
      message: 'Note rejected and deleted successfully',
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


router.get('/overview', verifyToken, async (req, res) => {
  try {
    const { role, userId, studentId } = req.user; // make sure studentId comes from token

    let data = {};

    // ==========================
    // 🔹 ADMIN / CR DASHBOARD
    // ==========================
    if (role === 'admin' || role === 'cr') {
      data.totalNotes = await Note.countDocuments();
      data.approvedNotes = await Note.countDocuments({ approved: true });
      data.pendingNotes = await Note.countDocuments({ approved: false });
      data.totalStudents = await User.countDocuments();

      data.subjectStats = await Note.aggregate([
        { $group: { _id: '$subject', count: { $sum: 1 } } },
      ]);

      data.recentNotes = await Note.find()
        .populate('user', 'studentId')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title approved createdAt user');
    }

    // ==========================
    // 🔹 STUDENT DASHBOARD (filter by studentId)
    // ==========================
    else {
      // Use aggregation with $lookup to match by studentId
      const matchStage = {
        $lookup: {
          from: 'users',           // collection to join
          localField: 'user',      // field in Note
          foreignField: '_id',     // field in User
          as: 'userData',
        },
      };

      const filterStage = {
        $match: {
          'userData.studentId': studentId, // filter by studentId
        },
      };

      // Total reacts
      const reactsAgg = await Note.aggregate([
        matchStage,
        filterStage,
        {
          $project: {
            reactCount: { $size: { $ifNull: ['$reacts', []] } },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$reactCount' },
          },
        },
      ]);
      data.totalReacts = reactsAgg.length > 0 ? reactsAgg[0].total : 0;

      // Total notes / approved / pending
      const notesAgg = await Note.aggregate([
        matchStage,
        filterStage,
        {
          $group: {
            _id: null,
            totalNotes: { $sum: 1 },
            approvedNotes: { $sum: { $cond: ['$approved', 1, 0] } },
            pendingNotes: { $sum: { $cond: ['$approved', 0, 1] } },
          },
        },
      ]);

      if (notesAgg.length > 0) {
        data.totalNotes = notesAgg[0].totalNotes;
        data.approvedNotes = notesAgg[0].approvedNotes;
        data.pendingNotes = notesAgg[0].pendingNotes;
      } else {
        data.totalNotes = data.approvedNotes = data.pendingNotes = 0;
      }

      // Notes per subject
      const subjectStats = await Note.aggregate([
        matchStage,
        filterStage,
        { $group: { _id: '$subject', count: { $sum: 1 } } },
      ]);
      data.subjectStats = subjectStats;

      // Recent 5 notes
      const recentNotes = await Note.aggregate([
        matchStage,
        filterStage,
        { $sort: { createdAt: -1 } },
        { $limit: 5 },
        { $project: { title: 1, approved: 1, createdAt: 1, subject: 1 } },
      ]);
      data.recentNotes = recentNotes;
    }

    res.status(200).json({
      success: true,
      role,
      ...data,
    });
  } catch (error) {
    console.error('Overview error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
router.get('/leaderboard', verifyToken, async (req, res) => {
  try {
    // Aggregate users with their notes
    const leaderboard = await User.aggregate([
      // Only include students (optional)

      // Lookup notes for each user
      {
        $lookup: {
          from: 'notes',
          localField: '_id',
          foreignField: 'user',
          as: 'userNotes',
        },
      },

      // Project required fields
      {
        $project: {
          userName: 1,
          studentId: 1,
          photoUrl: 1,
          totalNotes: { $size: '$userNotes' }, 
          role:1,
          totalComments: {
            $sum: {
              $map: {
                input: '$userNotes',
                as: 'note',
                in: { $size: { $ifNull: ['$$note.comments', []] } },
              },
            },
          },
          totalReacts: {
            $sum: {
              $map: {
                input: '$userNotes',
                as: 'note',
                in: { $size: { $ifNull: ['$$note.reacts', []] } },
              },
            },
          },
        },
      },

      // Sort by totalReacts descending
      { $sort: { totalReacts: -1 } },

      // Optional: limit to top 10
      { $limit: 10 },
    ]);

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('User Leaderboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});



// my notes 
router.get('/my', verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.patch('/my/:id', verifyToken, async (req, res) => {
  try {
    const { title, subject, link } = req.body;

    // খুঁজে বের করি user role
    const uploader = await User.findById(req.user.userId);

    // approved flag set
    let approved = false;
    if (uploader.role === 'admin' || uploader.role === 'cr') {
      approved = true;
    }

    // note update
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { title, subject, link, approved },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // 🔔 Notification only if normal user updates
    if (uploader.role !== 'admin' && uploader.role !== 'cr') {
      const adminsAndCR = await User.find({ role: { $in: ['admin', 'cr'] } });
      await Promise.all(
        adminsAndCR.map(user =>
          Notification.create({
            message: `⏳ ${uploader.userName} has updated a material. Please check.`,
            type: 'approval',
            receiverStudentId: user.studentId,
          })
        )
      );
    }

    res.json({
      success: true,
      message: approved
        ? 'Note updated successfully (auto-approved)'
        : 'Note updated & sent for review',
      note,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
});


router.delete('/my/:id', verifyToken, async (req, res) => {
  try {
    await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

;
