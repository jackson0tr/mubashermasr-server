const authModel = require('../models/authModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class authController {

    register = async (req, res) => {
        try {
            const { email, password, role, name } = req.body

            const existingUser = await authModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            if (!email || !name || !password || !role || !name) {
                return res.status(404).json({ message: 'Please provide your fields' })
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new authModel({
                name,
                email,
                role,
                password: hashedPassword,
            });

            await newUser.save();

            res.status(201).json({
                success: true,
                newUser
            });

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    login = async (req, res) => {
        const { email, password } = req.body

        if (!email) {
            return res.status(404).json({ message: 'Please provide your email' })
        }
        if (!password) {
            return res.status(404).json({ message: 'Please provide your password' })
        }

        try {
            const user = await authModel.findOne({ email }).select('+password')
            if (user) {
                const match = await bcrypt.compare(password, user.password)
                if (match) {
                    const obj = {
                        id: user.id,
                        name: user.name,
                        role: user.role
                    }
                    const token = jwt.sign(obj, process.env.secret, {
                        expiresIn: process.env.exp_time
                    })
                    return res.status(200).json({
                        success: true,
                        token 
                    })
                } else {
                    return res.status(404).json({ message: 'invalid password' })
                }
            } else {
                return res.status(404).json({ message: 'user not found' })
            }
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }

    }

    get_users = async (req, res) => {
        try {
            const users = await authModel.find().sort({ createdAt: -1 })
            return res.status(200).json({
                success: true,
                users
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    delete_user = async (req, res) => {
        try {
            const { id } = req.params;
            const user = await authModel.findById(id);

            if (!user) {
                res.status(400).json({ message: "User not found" })
            }

            await user.deleteOne();
            return res.status(201).json({ message: 'User delete success' })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new authController()