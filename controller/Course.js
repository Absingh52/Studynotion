const Tag = require('../models/Tags');
const Course = require('../models/Course');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

exports.createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      instructorId,
      tagId,
      price,
      whatYouWillLearn,
    } = req.body;

    // Get uploaded thumbnail from form-data
    const file = req.files?.thumbnail;

    // Validation
    if (
      !courseName ||
      !courseDescription ||
      !instructorId ||
      !tagId ||
      !price ||
      !whatYouWillLearn ||
      !file
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required including thumbnail',
      });
    }

    // Check tag exists
    const tag = await Tag.findById(tagId);
    if (!tag) {
      return res.status(400).json({
        success: false,
        message: 'Tag not found',
      });
    }

    // Check instructor exists
    const instructor = await User.findById(instructorId);
    if (!instructor) {
      return res.status(400).json({
        success: false,
        message: 'Instructor not found',
      });
    }

    // Upload thumbnail to Cloudinary
    const uploaded = await uploadImageToCloudinary(file, 'course_thumbnails', 500, 80);
    const thumbnailUrl = uploaded.secure_url;

    // Create course
    const course = await Course.create({
      courseName: courseName.trim(),
      courseDescription: courseDescription.trim(),
      instructor: instructorId,
      tag: tagId,
      price: price,
      whatYouWillLearn: whatYouWillLearn.trim(),
      thumbnail: thumbnailUrl,
    });

    // Add course to Tag and User
    await Tag.findByIdAndUpdate(tagId, {
      $push: { course: course._id },
    });
    await User.findByIdAndUpdate(instructorId, {
      $push: { course: course._id },
    });

    return res.status(200).json({
      success: true,
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    console.error('Error creating course:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to create course',
    });
  }
};
