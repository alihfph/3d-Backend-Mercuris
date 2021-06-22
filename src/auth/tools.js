import jwt from "jsonwebtoken"

export const authenticate = async (user) => {
    const accessToken = await generateJWT({ _id: user._id })  
    if (accessToken) {
      return accessToken
    } else {
      throw new Error("Error during token generation!")
    }
  }
  
  const generateJWT = payload =>
  new Promise((res, rej) =>
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "60m" }, (err, token) => {
      if (err) rej(err)
      res(token)
    })
  )
  
    export const verifyJWT = token =>
    new Promise((res, rej) =>
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) rej(err)
        res(decoded)
      })
    )