const express = require("express")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const nodemailer = require('nodemailer');
const { User, Notification } = require('../models/model')
require('dotenv').config()
// GET /users
router.get('/', verifyToken, async (req, res) => {
  try {
    const search = req.query.search || '';
    const limit = parseInt(req.query.limit) || 10;

    const query = {
      _id: { $ne: req.user.userId }, // skip current user
      $or: [
        { userName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
      ],
    };

    const users = await User.find(query)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});
// PATCH /users/:id/status
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status, reason } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.status = status;
    await user.save();

    // ✅ Only create notification for Accept or Block
    if (status === 'Accepted' || status === 'Blocked') {
      let message = '';
      if (status === 'Accepted') {
        message = `You member request accepted .Now you can use all the features`;
      } else if (status === 'Blocked') {
        message = `You are blocked by Admin/cr. Reason: ${reason}`;
      }

      await Notification.create({
        message,
        type: 'approval',
        receiverStudentId: user.studentId, // user will see this notification
      });
    }

    res.status(200).json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});
// DELETE /users/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await User.deleteOne({ _id: userId });
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const exist = await User.findOne({ studentId: req?.body.studentId })
    if (exist) {
      return res.status(400).json({
        error: "user already exist"
      });
    }
    const hashedPassword = await bcrypt.hash(req?.body.password, 10);
    const newUser = new User({
      ...req.body,
      password: hashedPassword
    });
    await newUser.save()
    const adminsAndCR = await User.find({ role: { $in: ["admin", "cr"] } });
    await Promise.all(adminsAndCR.map(user =>
      Notification.create({
        message: `A new user ${newUser.userName} has registered. Please approve.`,
        type: "approval",
        receiverStudentId: user.studentId,
      })
    ));
    const token = jwt.sign({ studentId: newUser?.studentId, userId: newUser?._id, role: newUser?.role }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    })

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      massage: 'user added successfully'
    })

  } catch (error) {
    res.status(500).json({
      error: error
    });
  }


})
router.post('/signin', async (req, res) => {
  try {
    const { studentId, password } = req.body;

    const user = await User.findOne({ studentId });
    if (!user) {
      return res.status(400).json({ error: "User not exist" });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json({ error: "Password incorrect" });
    }

    const token = jwt.sign(
      { studentId: user.studentId, userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: 'User signed in successfully',
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/me', verifyToken, async (req, res) => {
  try {
    const { studentId } = req.user;
    const user = await User.findOne({ studentId }).select({ password: 0 });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ success: true, message: "User exists", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
router.post('/logout', async (req, res) => {
  try {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // production e sameSite: "lax" or "none" (HTTPS required)
    });


    return res.status(200).json({
      success: true,
      message: 'User logged out successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong during logout',
    });
  }
});


// forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const token = jwt.sign({ studentId: user?.studentId, userId: user?._id, role: user?.role }, process.env.JWT_SECRET, {
      expiresIn: '10m'
    })
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.GOOGLEPASS
      }
    });

    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Reset Your Password',
      text: `
Hello ${user.userName|| ''},

We received a request to reset your password for your ClassVault account.

Please click the link below to reset your password. This link will expire in 10 minutes for security reasons:

https://classvaultbubt.vercel.app/reset-password/${user.studentId}/${token}

If you did not request a password reset, please ignore this email. Your account is safe.

Thank you,
The ClassVault Team
  `
    };


    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json({
          success: true,
          message: 'User log out successfully',
        })
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
router.post('/reset-password/:id/:token', async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(500).json({ error: "Link exiperd" })
      }
      else {
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.findOneAndUpdate({ studentId: id }, { password: hashedPassword })
      }
      res.status(200).json({ success: true, message: "Updated Successfully" })
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
// PATCH /users/:id  => update profile
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, email, photoUrl } = req.body;

    // Only allow user to update their own profile OR admin
    if (req.user.userId !== id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Update fields
    if (userName) user.userName = userName;
    if (email) user.email = email;
    if (photoUrl) user.photoUrl = photoUrl;

    await user.save();

    res.status(200).json({ success: true, message: 'Profile updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});
// PATCH /users/:id/password => change password
router.patch('/:id/password', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    // Only allow user to update their own password OR admin
    if (req.user.userId !== id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Old password incorrect' });

    // Update to new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router