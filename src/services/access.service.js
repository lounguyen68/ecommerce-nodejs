'use strict'

const bcrypt = require("bcrypt")
const crypto = require("crypto")
const shopModel = require("../models/shop.model")
const KeyTokenService = require("../services/keyToken.service")
const { createTokenPair } = require("../auth/authUtils")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async ({name, email, password}) => {
        try {
            // TODO step 1: check email exists
            
            const holderShop = await shopModel.findOne({ email}).lean()
            if (holderShop) {
                return {
                    code: "abc",
                    message: "Shop already registered!",
                }
            }

            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })

            if (newShop) {
                // TODO created privateKey, publicKey

                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                console.log({privateKey, publicKey})

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if (!keyStore){
                    return {
                        code: "abd",
                        message: "keyStore error",
                    }
                }

                // TODO created token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)

                console.log(`Created Token Success::`, tokens)

                return {
                    code: '201',
                    metadata: {
                        shop: newShop,
                        tokens
                    }
                }
            }

            return {
                code: '200',
                metadata: null
            }

        } catch (error) {
            return {
                code: "xyz",
                message: error.message,
                status: "error",
            }
        }
    }
}

module.exports = AccessService