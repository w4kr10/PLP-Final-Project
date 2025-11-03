const Appointment = require('../models/Appointment');
const PregnancyRecord = require('../models/PregnancyRecord');
const User = require('../models/User');

// Get medical dashboard data
const getDashboard = async (req, res) => {
  try {
    const todayAppointments = await Appointment.find({
      medicalPersonnelId: req.user.id,
      appointmentDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    }).populate('motherId', 'firstName lastName phone email profileImage');

    const upcomingAppointments = await Appointment.find({
      medicalPersonnelId: req.user.id,
      status: { $in: ['scheduled', 'confirmed'] },
      appointmentDate: { $gte: new Date() }
    }).populate('motherId', 'firstName lastName phone email').sort({ appointmentDate: 1 }).limit(10);

    const totalPatients = await Appointment.distinct('motherId', { medicalPersonnelId: req.user.id });

    res.json({
      success: true,
      data: {
        todayAppointments,
        upcomingAppointments,
        totalPatients: totalPatients.length
      }
    });
  } catch (error) {
    console.error('Medical dashboard error:', error);
    res.status(500).json({ message: 'Failed to load dashboard data' });
  }
};

// Get detailed patient information
const getPatientInfo = async (req, res) => {
  try {
    const { id } = req.params; // Changed from patientId to id to match route
    const patientId = id; // Keep patientId variable for internal use
    
    // Verify this medical personnel has appointments with this patient
    const hasAppointment = await Appointment.findOne({
      motherId: patientId,
      medicalPersonnelId: req.user.id
    });

    if (!hasAppointment) {
      return res.status(403).json({ message: 'Not authorized to view this patient\'s details' });
    }

    // Get patient's basic info
    const patient = await User.findOne({ 
      _id: patientId, 
      role: 'mother' 
    }).select('-password');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get pregnancy record with populated data
    const pregnancyRecord = await PregnancyRecord.findOne({ 
      motherId: patientId 
    })
    .populate('medications.prescribedBy', 'firstName lastName specialization');

    // Get all appointments with this patient
    const appointments = await Appointment.find({ 
      motherId: patientId,
      medicalPersonnelId: req.user.id
    })
    .sort({ appointmentDate: -1, appointmentTime: -1 });

    // Combine all data into proper structure
    const patientData = {
      patient: patient.toObject(),
      pregnancyRecord,
      appointments
    };

    // Send notification to patient that their details were viewed
    const { sendPushNotification } = require('../utils/notificationService');
    if (patient.notificationPreferences?.push) {
      sendPushNotification({
        userId: patientId,
        title: 'Medical Review',
        message: `Dr. ${req.user.firstName} ${req.user.lastName} is reviewing your medical information`,
        data: { type: 'medical-review', medicalPersonnelId: req.user.id }
      }).catch(err => console.log('Push notification failed:', err.message));
    }

    res.json({ success: true, data: patientData });
  } catch (error) {
    console.error('Get patient details error:', error);
    res.status(500).json({ message: 'Failed to get patient details' });
  }
};

// Get all patients
const getPatients = async (req, res) => {
  try {
    const appointments = await Appointment.find({ medicalPersonnelId: req.user.id })
      .populate('motherId', 'firstName lastName phone email profileImage dueDate pregnancyStage')
      .sort({ createdAt: -1 });

    // Get unique patients
    const patientsMap = new Map();
    appointments.forEach(apt => {
      if (apt.motherId && !patientsMap.has(apt.motherId._id.toString())) {
        patientsMap.set(apt.motherId._id.toString(), apt.motherId);
      }
    });

    const patients = Array.from(patientsMap.values());

    res.json({ success: true, data: patients });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ message: 'Failed to get patients' });
  }
};

// This function has been merged with getPatientInfo

// Get appointments
const getAppointments = async (req, res) => {
  try {
    const { status, date } = req.query;
    
    const filter = { medicalPersonnelId: req.user.id };
    
    if (status) {
      filter.status = status;
    }
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.appointmentDate = { $gte: startDate, $lte: endDate };
    }

    const appointments = await Appointment.find(filter)
      .populate('motherId', 'firstName lastName phone email profileImage')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.json({ success: true, data: appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Failed to get appointments' });
  }
};

// Create appointment (for medical personnel)
const createAppointment = async (req, res) => {
  try {
    const { motherId, appointmentDate, appointmentTime, type, notes } = req.body;

    // Verify the mother exists
    const mother = await User.findById(motherId);
    if (!mother || mother.role !== 'mother') {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const appointment = new Appointment({
      motherId,
      medicalPersonnelId: req.user.id,
      appointmentDate,
      appointmentTime,
      type,
      notes,
      status: 'scheduled'
    });

    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('motherId', 'firstName lastName phone email profileImage');

    // Send notifications to patient
    const { sendAppointmentReminder, sendPushNotification } = require('../utils/notificationService');
    
    // Send immediate notification
    if (mother.notificationPreferences?.push) {
      sendPushNotification({
        userId: motherId,
        title: 'New Appointment Scheduled',
        message: `Dr. ${req.user.firstName} ${req.user.lastName} has scheduled an appointment with you on ${new Date(appointmentDate).toLocaleDateString()} at ${appointmentTime}`,
        data: { type: 'appointment', appointmentId: appointment._id.toString() }
      }).catch(err => console.log('Push notification failed:', err.message));
    }

    // Send appointment reminder via all enabled channels
    sendAppointmentReminder({
      user: mother,
      appointment: {
        ...appointment.toObject(),
        medicalPersonnelId: req.user
      },
      method: 'all'
    }).catch(err => console.log('Appointment reminder failed:', err.message));

    // Emit socket event for real-time notification to patient
    if (req.io) {
      req.io.to(motherId).emit('new-appointment', populatedAppointment);
    }

    res.status(201).json({ success: true, data: populatedAppointment });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Failed to create appointment' });
  }
};

// Update appointment
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, meetingLink } = req.body;

    const appointment = await Appointment.findOne({
      _id: id,
      medicalPersonnelId: req.user.id
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;
    if (meetingLink) appointment.meetingLink = meetingLink;

    await appointment.save();

    const updatedAppointment = await Appointment.findById(id)
      .populate('motherId', 'firstName lastName phone email');

    // Emit socket event for real-time notification
    if (req.io) {
      req.io.to(appointment.motherId.toString()).emit('appointment-updated', updatedAppointment);
    }

    res.json({ success: true, data: updatedAppointment });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Failed to update appointment' });
  }
};

// Add patient notes
const addPatientNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Get patient info for notifications
    const patient = await User.findById(id).select('firstName lastName email phone notificationPreferences');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const pregnancyRecord = await PregnancyRecord.findOne({ motherId: id });
    
    if (!pregnancyRecord) {
      return res.status(404).json({ message: 'Pregnancy record not found' });
    }

    pregnancyRecord.notes.push({
      content,
      addedBy: req.user.id,
      date: new Date()
    });

    await pregnancyRecord.save();

    const populatedRecord = await PregnancyRecord.findById(pregnancyRecord._id)
      .populate('medications.prescribedBy', 'firstName lastName specialization');

    // Get updated patient data for response
    const appointments = await Appointment.find({ 
      motherId: id,
      medicalPersonnelId: req.user.id
    }).sort({ appointmentDate: -1 });

    const responseData = {
      patient: patient.toObject(),
      pregnancyRecord: populatedRecord,
      appointments
    };

    // Send notification to patient
    const { sendPushNotification } = require('../utils/notificationService');
    
    if (patient.notificationPreferences?.push) {
      sendPushNotification({
        userId: id,
        title: 'Medical Note Added',
        message: `Dr. ${req.user.firstName} ${req.user.lastName} has added a note to your medical record`,
        data: { type: 'medical-note' }
      }).catch(err => console.log('Push notification failed:', err.message));
    }

    // Emit socket event for real-time notification
    if (req.io) {
      req.io.to(id).emit('medical-note-added', {
        note: content,
        doctor: { firstName: req.user.firstName, lastName: req.user.lastName }
      });
    }

    res.json({ success: true, data: responseData });
  } catch (error) {
    console.error('Add patient notes error:', error);
    res.status(500).json({ message: 'Failed to add notes' });
  }
};

// Add medication to patient
const addMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dosage, frequency, startDate, endDate } = req.body;

    // Get patient info for notifications
    const patient = await User.findById(id).select('firstName lastName email phone notificationPreferences');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const pregnancyRecord = await PregnancyRecord.findOne({ motherId: id });
    
    if (!pregnancyRecord) {
      return res.status(404).json({ message: 'Pregnancy record not found' });
    }

    pregnancyRecord.medications.push({
      name,
      dosage,
      frequency,
      prescribedBy: req.user.id,
      startDate,
      endDate
    });

    await pregnancyRecord.save();

    const populatedRecord = await PregnancyRecord.findById(pregnancyRecord._id)
      .populate('medications.prescribedBy', 'firstName lastName specialization');

    // Get updated patient data for response
    const appointments = await Appointment.find({ 
      motherId: id,
      medicalPersonnelId: req.user.id
    }).sort({ appointmentDate: -1 });

    const responseData = {
      patient: patient.toObject(),
      pregnancyRecord: populatedRecord,
      appointments
    };

    // Send notifications to patient
    const { sendPushNotification, sendEmail, sendSMS } = require('../utils/notificationService');
    
    const notificationMessage = `Dr. ${req.user.firstName} ${req.user.lastName} has prescribed ${name} (${dosage}, ${frequency})`;
    
    // Push notification
    if (patient.notificationPreferences?.push) {
      sendPushNotification({
        userId: id,
        title: 'New Medication Prescribed',
        message: notificationMessage,
        data: { type: 'medication', medicationName: name }
      }).catch(err => console.log('Push notification failed:', err.message));
    }

    // Email notification
    if (patient.notificationPreferences?.email) {
      sendEmail({
        to: patient.email,
        subject: 'New Medication Prescribed',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">New Medication Prescribed</h2>
            <p>Dear ${patient.firstName},</p>
            <p>Dr. ${req.user.firstName} ${req.user.lastName} has prescribed a new medication for you:</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Medication:</strong> ${name}</p>
              <p><strong>Dosage:</strong> ${dosage}</p>
              <p><strong>Frequency:</strong> ${frequency}</p>
              <p><strong>Start Date:</strong> ${new Date(startDate).toLocaleDateString()}</p>
              ${endDate ? `<p><strong>End Date:</strong> ${new Date(endDate).toLocaleDateString()}</p>` : ''}
            </div>
            <p>Please follow the prescribed instructions carefully. If you have any questions, contact your healthcare provider.</p>
            <p>Best regards,<br>The MCaid Team</p>
          </div>
        `
      }).catch(err => console.log('Email notification failed:', err.message));
    }

    // SMS notification
    if (patient.notificationPreferences?.sms && patient.phone) {
      sendSMS({
        to: patient.phone,
        message: notificationMessage
      }).catch(err => console.log('SMS notification failed:', err.message));
    }

    // Emit socket event for real-time notification
    if (req.io) {
      req.io.to(id).emit('medication-prescribed', {
        medication: { name, dosage, frequency, startDate, endDate },
        doctor: { firstName: req.user.firstName, lastName: req.user.lastName }
      });
    }

    res.json({ success: true, data: responseData });
  } catch (error) {
    console.error('Add medication error:', error);
    res.status(500).json({ message: 'Failed to add medication' });
  }
};

// Get analytics
const getAnalytics = async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments({ medicalPersonnelId: req.user.id });
    
    const completedAppointments = await Appointment.countDocuments({
      medicalPersonnelId: req.user.id,
      status: 'completed'
    });

    const upcomingAppointments = await Appointment.countDocuments({
      medicalPersonnelId: req.user.id,
      status: { $in: ['scheduled', 'confirmed'] },
      appointmentDate: { $gte: new Date() }
    });

    const totalPatients = await Appointment.distinct('motherId', { medicalPersonnelId: req.user.id });

    // Get appointments by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const appointmentsByMonth = await Appointment.aggregate([
      {
        $match: {
          medicalPersonnelId: req.user._id,
          appointmentDate: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { 
            month: { $month: '$appointmentDate' },
            year: { $year: '$appointmentDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalAppointments,
        completedAppointments,
        upcomingAppointments,
        totalPatients: totalPatients.length,
        appointmentsByMonth
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Failed to get analytics' });
  }
};

module.exports = {
  getDashboard,
  getPatients,
  getPatientDetails: getPatientInfo, // Alias getPatientInfo as getPatientDetails for backward compatibility
  getAppointments,
  createAppointment,
  updateAppointment,
  addPatientNotes,
  addMedication,
  getAnalytics
};
