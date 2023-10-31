const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secret = "oqdtr4rP9ZXh5kSs3r3EOxo9xC2NyJfoGv7QmGX7V8RIhHhQlXxkEq"

class UserController {
    async Registration(req, res) {
        try {
            const {name, email, password} = req.body;

            if (!name && !email && !password) {
                res.status(400).json({status: "Данные не заполнены"})
            }
            const candidate = await User.findOne({email})
            if (candidate) {
                res.status(400).json({status: "Пользователь зарегистрированный"})
            }

            const hashPassword = bcrypt.hashSync(password, 7)


            const user = new User({
                name,
                email,
                password: hashPassword,
                status: 'Пользователь',
                customerRating: 1
            })
            await user.save();
            res.status(201).json({created: "true"})
        } catch (e) {
            console.log(e)
        }
    }

    async getUser(req, res) {
        try {
            const {id} = req.body;

            const user = await User.findById(id);
            if (!user) {
                res.status(404).json({search: "exists"})
            }

            res.status(200).json({user})
        } catch (e) {
            console.log(e)
        }
    }

    async changeStatus(req, res) {
        try {
            const {id, status} = req.body;

            const user = await User.findById(id);
            if (!user) {
                return res.status(400).json({change: "false"});
            }
            user.status = status;

            await user.save();

            res.status(200).json({change: "true"});
        } catch (e) {
            console.log(e)
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find(); // Use await to wait for the users to be retrieved
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({error: "Internal Server Error"}); // Handle any potential errors
        }
    }

    async authenticate(req, res) {
        try {
            const {email, password} = req.body;

            const user = await User.findOne({email});
            if (!user) {
                return res.status(400).json({error: "Неверный email или пароль"});
            }

            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({error: "Неверный email или пароль"});
            }

            const token = jwt.sign({id: user._id}, secret, {expiresIn: '24h'});

            res.status(200).json({token});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Internal Server Error"});
        }
    }

    async personalAreaSign(req, res) {
        const {token} = req.body;

        try {
            const decoded = jwt.verify(token, secret)
            const id = decoded.id
            res.status(200).json({id})
        } catch (e) {
            console.log(e)
        }

    }

    async setRating(req, res) {
        const {id, rating} = req.body;

        const user = await User.findById(id);
        if (!user) {
            res.status(400).json({change: "false"})
        }
        user.customerRating = rating;

        await user.save();

        res.status(200).json({change: "true"})
    }

    async deleteUser(req, res) {
        try {
            const {email} = req.body;

            const user = await User.findOneAndDelete({email});

            if (!user) {
                return res.status(400).json({deleted: "false"});
            }

            return res.status(200).json({deleted: "true"});
        } catch (error) {
            console.log(error);
            return res.status(500).json({error: "Internal Server Error"});
        }
    }

    async addOrders(req, res) {
        const {token, order} = req.body;

        try {
            const decoded = jwt.verify(token, secret)
            const id = decoded.id
            const user = await User.findById(id);
            if (!user) {
                return res.status(400).json({added: "false", error: "User not found"});
            }

            // Create a new order object
            const newOrder = {
                id: user.orders.length + 1, // Generate custom ID based on the size of the array
                address: order.address,
                creationDate: order.creationDate ? new Date(order.creationDate) : new Date(),
                shippingDate: order.shippingDate,
                paymentType: order.paymentType,
                paymentStatus: order.paymentStatus,
                comment: order.comment,
                orderDetails: order.orderDetails,
                fullName: order.fullName,
                phoneNumber: order.phoneNumber,
                ttn: order.ttn,
                status: order.status
            };

            // Add the new order to the user's orders array
            user.orders.push(newOrder);

            await user.save();

            res.status(200).json({added: "true"});
        } catch (error) {
            console.log(error);
            res.status(500).json({added: "false", error: "Internal Server Error"});
        }
    }

    async addDeliveryAddress(req, res) {
        const {token, address} = req.body;

        try {

            const decoded = jwt.verify(token, secret)
            const id = decoded.id
            const user = await User.findById(id);
            if (!user) {
                return res.status(400).json({added: "false", error: "User not found"});
            }

            // Create a new delivery address object
            const newAddress = {
                street: address.street,
                city: address.city
            };

            // Add the new address to the user's deliveryAddresses array
            user.deliveryAddresses.push(newAddress);

            await user.save();

            res.status(200).json({added: "true"});
        } catch (error) {
            console.log(error);
            res.status(500).json({added: "false", error: "Internal Server Error"});
        }
    }

    async views(req, res) {
        try {
            const {token, productId} = req.body;
            const decoded = jwt.verify(token, secret)
            const id = decoded.id
            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({message: 'Пользователь не найден'});
            }

            user.views.unshift(productId);

            if (user.views.length > 16) {
                user.views.pop();
            }

            await user.save();

            return res.status(200).json({message: 'Товар успешно добавлен в просмотры пользователя'});
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: 'Произошла ошибка сервера'});
        }
    }

    async getViews(req, res) {
        const {token} = req.body;

        try {
            const decoded = jwt.verify(token, secret)
            const id = decoded.id

            const user = await User.findById(id);

            if (!user) {
                res.status(404).json({show: "false"})
            }

            res.status(200).json(user.views)
        } catch (e) {
            console.log(e)
        }
    }

    async favorites(req, res) {
        try {
            const {token, productID} = req.body;

            const decoded = jwt.verify(token, secret)
            const id = decoded.id

            const user = await User.findById(id);

            if (!user) {
                res.status(404).json({added: "false"})
            }

            user.favorites.push({productID})
            await user.save()

            res.status(200).json({added: "true"})
        } catch (e) {
            console.log(e)
        }
    }

    async getFavorites(req, res) {
        const {token} = req.body;

        try {
            const decoded = jwt.verify(token, secret)
            const id = decoded.id

            const user = await User.findById(id);

            if (!user) {
                res.status(404).json({show: "false"})
            }
            res.status(200).json(user.favorites)
        } catch (e) {
            console.log(e)
        }
    }

    async cart(req, res) {
        try {
            const {token, productID} = req.body;

            const decoded = jwt.verify(token, secret)
            const id = decoded.id

            const user = await User.findById(id);
            if (!user) {
                res.status(404).json({user: "exist"})
            }
            user.cart.push(productID)

            user.save()
        } catch (e) {
            console.log(e)
        }
    }
    async getCart(req, res) {
        const {token} = req.body;
        try {
            const decoded = jwt.verify(token, secret)
            const id = decoded.id

            const user = await User.findById(id);

            if (!user) {
                res.status(404).json({show: "false"})
            }
            res.status(200).json(user.cart)
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new UserController();