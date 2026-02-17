/* eslint-disable no-useless-catch */
// =======================================================
// AUTH SERVICE - Xử lý business logic cho Authentication
// =======================================================
// File này chứa các hàm xử lý logic nghiệp vụ liên quan đến authentication:
// - Đăng ký user mới
// - Đăng nhập
// - Tạo JWT token
// - Lấy thông tin user hiện tại

import jwt from 'jsonwebtoken'
import User from '~/models/user.model.js'
import { env } from '~/config/environment.js'

/**
 * Hàm tạo JWT Token cho user
 * 
 * @param {String} userId - ID của user
 * @returns {String} - JWT token
 */
const generateToken = (userId) => {
  // jwt.sign() tạo token với:
  // - Payload: Dữ liệu muốn mã hóa vào token (ở đây là user ID)
  // - Secret key: Khóa bí mật để ký token
  // - Options: Các tùy chọn như thời gian hết hạn
  
  return jwt.sign(
    { id: userId },              // Payload - chỉ lưu ID, không lưu password hay thông tin nhạy cảm
    env.JWT_SECRET,              // Secret key từ environment variable
    { expiresIn: env.JWT_EXPIRE } // Token sẽ hết hạn sau thời gian này (ví dụ: '7d' = 7 ngày)
  )
  
  // Token trả về có dạng: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxN..."
  // Token gồm 3 phần ngăn cách bởi dấu chấm:
  // 1. Header (thông tin về thuật toán mã hóa)
  // 2. Payload (dữ liệu đã mã hóa)
  // 3. Signature (chữ ký để xác thực)
}


/**
 * ĐĂNG KÝ USER MỚI
 * 
 * Flow hoạt động:
 * 1. Kiểm tra email đã tồn tại chưa
 * 2. Kiểm tra username đã tồn tại chưa
 * 3. Tạo user mới trong database (password tự động được hash bởi model)
 * 4. Tạo JWT token cho user
 * 5. Trả về thông tin user và token
 * 
 * @param {Object} userData - Dữ liệu user { username, email, password }
 * @returns {Object} - { user, token }
 */
const register = async (userData) => {
  try {
    const { username, email, password } = userData

    // =======================
    // BƯỚC 1: Validate dữ liệu đầu vào
    // =======================
    
    if (!username || !email || !password) {
      throw new Error('Please provide username, email and password')
    }

    // Kiểm tra độ dài password
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    // =======================
    // BƯỚC 2: Kiểm tra email đã tồn tại chưa
    // =======================
    
    const emailExists = await User.findOne({ email: email.toLowerCase() })
    
    if (emailExists) {
      throw new Error('Email already registered. Please use another email or login.')
    }

    // =======================
    // BƯỚC 3: Kiểm tra username đã tồn tại chưa
    // =======================
    
    const usernameExists = await User.findOne({ username })
    
    if (usernameExists) {
      throw new Error('Username already taken. Please choose another username.')
    }

    // =======================
    // BƯỚC 4: Tạo user mới
    // =======================
    
    // User.create() sẽ:
    // - Tạo document mới trong collection users
    // - Password tự động được hash bởi pre('save') hook trong model
    // - Trả về user object đã lưu
    const user = await User.create({
      username,
      email: email.toLowerCase(), // Chuyển email về lowercase để tránh trùng lặp
      password // Password sẽ được hash tự động bởi model
    })

    // =======================
    // BƯỚC 5: Tạo JWT token
    // =======================
    
    const token = generateToken(user._id)

    // =======================
    // BƯỚC 6: Trả về kết quả
    // =======================
    
    // Chuyển đổi user document thành object và xóa password
    const userObject = user.toJSON() // toJSON() đã được định nghĩa trong model để tự động xóa password

    return {
      user: userObject,
      token
    }
    
  } catch (error) {
    throw error
  }
}


/**
 * ĐĂNG NHẬP
 * 
 * Flow hoạt động:
 * 1. Tìm user theo email
 * 2. Kiểm tra user có tồn tại không
 * 3. So sánh password (dùng bcrypt.compare)
 * 4. Nếu đúng → tạo token và trả về
 * 5. Nếu sai → throw error
 * 
 * @param {Object} loginData - { email, password }
 * @returns {Object} - { user, token }
 */
const login = async (loginData) => {
  try {
    const { email, password } = loginData

    // =======================
    // BƯỚC 1: Validate dữ liệu đầu vào
    // =======================
    
    if (!email || !password) {
      throw new Error('Please provide email and password')
    }

    // =======================
    // BƯỚC 2: Tìm user trong database
    // =======================
    
    // Chú ý: Phải dùng .select('+password') vì trong model ta đã set select: false
    // Điều này đảm bảo password không bao giờ được trả về mặc định
    // Nhưng ở đây ta cần password để so sánh
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).select('+password')

    // =======================
    // BƯỚC 3: Kiểm tra user có tồn tại không
    // =======================
    
    if (!user) {
      throw new Error('Invalid email or password') // Không nói cụ thể email sai để tránh lộ thông tin
    }

    // =======================
    // BƯỚC 4: Kiểm tra account có bị vô hiệu hóa không
    // =======================
    
    if (!user.isActive) {
      throw new Error('Your account has been deactivated. Please contact support.')
    }

    // =======================
    // BƯỚC 5: So sánh password
    // =======================
    
    // comparePassword() là method đã định nghĩa trong user model
    // Nó sử dụng bcrypt.compare() để so sánh password nhập vào với password đã hash
    const isPasswordCorrect = await user.comparePassword(password)
    
    if (!isPasswordCorrect) {
      throw new Error('Invalid email or password')
    }

    // =======================
    // BƯỚC 6: Tạo JWT token
    // =======================
    
    const token = generateToken(user._id)

    // =======================
    // BƯỚC 7: Trả về kết quả
    // =======================
    
    // Xóa password khỏi object trước khi trả về
    const userObject = user.toJSON()

    return {
      user: userObject,
      token
    }
    
  } catch (error) {
    throw error
  }
}


/**
 * LẤY THÔNG TIN USER HIỆN TẠI
 * 
 * Hàm này được gọi từ controller khi user đã được xác thực
 * req.user đã được gắn bởi auth middleware
 * 
 * @param {String} userId - ID của user
 * @returns {Object} - Thông tin user
 */
const getCurrentUser = async (userId) => {
  try {
    // Tìm user theo ID và không lấy password
    const user = await User.findById(userId).select('-password')
    
    if (!user) {
      throw new Error('User not found')
    }

    if (!user.isActive) {
      throw new Error('Account has been deactivated')
    }

    return user
    
  } catch (error) {
    throw error
  }
}


/**
 * CẬP NHẬT PROFILE
 * 
 * Cho phép user cập nhật thông tin cá nhân
 * Không cho phép cập nhật password qua hàm này (phải có route riêng)
 * 
 * @param {String} userId - ID của user
 * @param {Object} updateData - Dữ liệu cần cập nhật
 * @returns {Object} - User đã cập nhật
 */
const updateProfile = async (userId, updateData) => {
  try {
    // Không cho phép cập nhật những field này qua API này
    delete updateData.password
    delete updateData.role
    delete updateData.isActive

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { 
        new: true,           // Trả về document sau khi update
        runValidators: true  // Chạy validation
      }
    ).select('-password')

    if (!user) {
      throw new Error('User not found')
    }

    return user
    
  } catch (error) {
    throw error
  }
}


/**
 * ĐỔI PASSWORD
 * 
 * Cho phép user đổi password
 * Yêu cầu phải nhập password cũ để xác thực
 * 
 * @param {String} userId - ID của user
 * @param {Object} passwordData - { currentPassword, newPassword }
 * @returns {Object} - Message thành công
 */
const changePassword = async (userId, passwordData) => {
  try {
    const { currentPassword, newPassword } = passwordData

    // Validate input
    if (!currentPassword || !newPassword) {
      throw new Error('Please provide current password and new password')
    }

    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters')
    }

    // Lấy user với password
    const user = await User.findById(userId).select('+password')
    
    if (!user) {
      throw new Error('User not found')
    }

    // Kiểm tra password hiện tại có đúng không
    const isPasswordCorrect = await user.comparePassword(currentPassword)
    
    if (!isPasswordCorrect) {
      throw new Error('Current password is incorrect')
    }

    // Cập nhật password mới
    // Password sẽ tự động được hash bởi pre('save') hook
    user.password = newPassword
    await user.save()

    return {
      message: 'Password changed successfully'
    }
    
  } catch (error) {
    throw error
  }
}


// Export tất cả các functions
export default {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword
}
